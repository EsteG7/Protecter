const Guilds = require("../../database/Models/guilds.js");
const Users = require("../../database/Models/users.js");
const cron = require("node-cron");
const Codes = require("../../database/Models/codes.js");
const BlackList = require("../../database/Models/blacklist.js");

module.exports = (client) => {
    try {
        cron.schedule("*/10 * * * *", async () => {
            let unBanedUsers = 0;
            let unMutedUsers = 0;

            await Promise.all(client.guilds.cache.map(async (guild) => {
                // UNBAN SISTEM
                const usersBanned = await Users.find({guildId: String(guild.id), "ban.isBanned": true, "ban.endAt": { $lte: String(Date.now())}});
                if(usersBanned.length > 0) {
                    for(i of usersBanned) {
                        const unBanned = await guild.bans.remove(i.userId, "Usuario desbaneado.").catch(() => null);
                        if(unBanned) unBanedUsers++;
                    }
                }
    
                // UNMUTE SISTEM
                const rol = guild.roles.cache.get((await Guilds.findOne({guildId: String(guild.id)}))?.muteRol);
                if(rol && !rol.size) {
                    const usersMuted = await Users.find({guildId: String(guild.id), "mute.isMuted": true, "mute.endAt": { $lte: String(Date.now())}});
                    
                    if(usersMuted.length > 0) {
                        for(i of usersMuted) {
                            const member = guild.members.cache.get(i.userId);
                            if(member && !member.size) {
                                const unMuted = await member.roles.remove(rol.id).catch(() => null);
                                if(unMuted) unMutedUsers++;
                            }
                        }
                    }
                }
            }));

            await Users.updateMany({"ban.isBanned": true, "ban.endAt": { $lte: Date.now() }}, {
                ban: {
                    isBanned: false,
                    endAt: null
                }
            });
            await Users.updateMany({"mute.isMuted": true, "mute.endAt": { $lte: Date.now() }}, {
                mute: {
                    isMuted: false,
                    endAt: null
                }
            });

            // Remove Premium Codes
            const codesRemove = await Codes.count({endAt: {$lte: String(Date.now())}});
            await Codes.deleteMany({endAt: {$lte: String(Date.now())}});

            // Remove Blacklist Users
            const usersRemoved = await BlackList.count({endAt: {$lte: String(Date.now())}});
            await BlackList.deleteMany({endAt: {$lte: String(Date.now())}});

            // INFO
            console.log("[DATABASE] ".cyan + "Se ".green + `${unBanedUsers === 1 ? "ha" : "han"}`.green + " removido ".green + `${unBanedUsers}`.brightCyan + " " + `${unBanedUsers === 1 ? "baneo" : "baneos"}`.green + ", ".green + `${unMutedUsers} `.brightCyan + `${unMutedUsers === 1 ? "silencio" : "silencios"}`.green + ", ".green + `${codesRemove}`.brightCyan + " " + `${codesRemove === 1 ? "codigo" : "codigos"}`.green + " y ".green + `${usersRemoved}`.brightCyan + " " + `${usersRemoved === 1 ? "usuario bloqueado" : "usuarios bloqueados"}`.green + ".".green);
        });
    } catch (error) {
        console.log('[ERROR] '.cyan + `${error.stack}`.red);
    };
};