const Guilds = require("../database/Models/guilds.js");

module.exports = {
    name: "ready",
    run: async (client) => {
        try {
            // --- SYSTEM • DATABASE CHECKER ---
            client.guilds.cache.forEach(async (guild) => {
                if(!await Guilds.exists({guildId: String(guild.id)})) {
                    await Guilds.create({
                        guildId: String(guild.id)
                    });
                }
            });

            client.user.setPresence({
                status: "online",
                afk: false,
                activities: [
                    {
                        name: "🏁 | Meta: " + (client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0) + 50) + " usuarios",
                        type: "PLAYING"
                    },
                    {
                        name: "🏁 | Meta: " + (client.guilds.cache.size + 10) + " servidores",
                        type: "PLAYING"
                    },
                    {
                        name: "Protecter Fase Beta",
                        type: "WATCHING"
                    },
                    {
                        name: "Más de 30 Comandos FASE BETA",
                        type: "WATCHING"
                    },
                    {
                        name: "Más de 10 SISTEMAS",
                        type: "WATCHING"
                    }
                ]
            });
            console.log("[BOT] ".cyan + "Todo Listo Como -> " + `${client.user.tag}`.green + "\n[BOT] ".cyan + "Servidores: " + `${client.guilds.cache.size}`.green + "" + "\n[BOT] ".cyan + "Usuarios: " + `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`.green + "");
            require("./systems/timer.js")(client);
        } catch (error) {
            console.log("[ERROR] ".cyan + `${error.stack}`.red);
        }
    }
};