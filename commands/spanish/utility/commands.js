module.exports = {
    name: "commands",
    description: "Muestra la lista de comandos disponibles del bot.",
    usage: "commands",
    category: "utility",
    lang: "es",
    requeriments: {
        userPerms: [],
        botPerms: []
    },
    run: async (client, message) => {
        try {
            let index = 0;

            await message.reply({embeds: [
                {
                    author: {
                        name: "LISTA DE COMANDOS",
                        icon_url: client.user.displayAvatarURL()
                    },
                    color: "#5A9EC9",
                    description: "Actualmente hay **" + client.commands.filter((i) => i?.lang === "es").size + "** comandos disponibles.",
                    fields: [
                        {
                            name: "🔧 CONFIGURACIÓN",
                            value: client.commands.filter((i) => i?.lang === "es" && i?.category === "configuration").map((i) => "`" + i.name + "`").join(", ")
                        },
                        {
                            name: "👨‍✈️ MODERACIÓN",
                            value: client.commands.filter((i) => i?.lang === "es" && i?.category === "moderation").map((i) => "`" + i.name + "`").join(", ")
                        },
                        {
                            name: "📌 UTILIDAD",
                            value: client.commands.filter((i) => i?.lang === "es" && i?.category === "utility").map((i) => "`" + i.name + "`").join(", ")
                        },
                        {
                            name: "📁 SISTEMAS",
                            value: "`AntiWords`, `Logs`, `AntiBots`, `RaidLogs`, `AutoMod`, `AntiSpam`, `AntiRaid`"
                        }
                    ],
                    thumbnail: {
                        url: client.user.displayAvatarURL()
                    },
                    footer: {
                        text: client.user.username,
                        icon_url: client.user.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            ]});
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};