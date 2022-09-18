const wait = require("util").promisify(setTimeout);

module.exports = {
    name: "ping",
    description: "Muestra la latencia del bot.",
    usage: "ping",
    category: "utility",
    lang: "es",
    requeriments: {
        userPerms: [],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const msg = await message.reply("`⌛` | Calculando latencia actual...");
            await wait(1500);
            await msg.edit({content: null, embeds: [
                {
                    author: {
                        name: "LATENCIA ACTUAL",
                        icon_url: "attachment://log-icon.png"
                    },
                    color: "#5A9EC9",
                    description: "La latencia promedio es de **" + client.ws.ping + "**ms",
                    thumbnail: {
                        url: "attachment://log-icon.png"
                    },
                    footer: {
                        text: client.user.username,
                        icon_url: client.user.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            ], files: ["./images/log-icon.png"]});
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};