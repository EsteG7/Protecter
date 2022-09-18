const Guilds = require("../database/Models/guilds.js");

module.exports = {
    name: "guildCreate",
    run: async (client, guild) => {
        try {
            if(!await Guilds.exists({guildId: String(guild.id)})) {
                await Guilds.create({
                    guildId: String(guild.id)
                });
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};