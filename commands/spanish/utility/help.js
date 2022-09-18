const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "help",
    description: "Muestra el panel de ayuda del bot.",
    usage: "help",
    category: "utility",
    lang: "es",
    requeriments: {
        userPerms: [],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            await message.reply({embeds: [
                {
                    author: {
                        name: "PANEL DE AYUDA",
                        icon_url: client.user.displayAvatarURL()
                    },
                    color: "#5A9EC9",
                    description: "<:arrow_right:964247865943801887> Para ver la lista de los comandos disponibles: `" + guildData.prefix + "commands`\n<:arrow_right:964247865943801887> Para ver la información de un comando: `" + guildData.prefix + "cmd <COMANDO>`\n<:arrow_right:964247865943801887> Para ver las politicas de privacidad: `" + guildData.prefix + "policys`\n<:arrow_right:964247865943801887> Para ver la información del bot: `" + guildData.prefix + "info`",
                    fields: [
                        {
                            name: "📌 ENLACES UTILES\u2007\u2007\u2007\u2007\u2007\u2007",
                            value: "\u2007[[Invitación Del Bot]](https://www.google.com/)\n\u2007[[Discord De Soporte]](https://discord.gg/fjtMv9TVQw)",
                            inline: true
                        },
                        {
                            name: "📁 COMANDOS UTILES",
                            value: "\u2007`" + guildData.prefix + "commands`, `" + guildData.prefix + "invite`,\n\u2007`" + guildData.prefix + "bot`, `" + guildData.prefix + "help`, `" + guildData.prefix + "policys`, `" + guildData.prefix + "info`",
                            inline: true
                        }
                    ],
                    thumbnail: {
                        url: "attachment://about-icon.png"
                    },
                    footer: {
                        text: client.user.username,
                        icon_url: client.user.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            ], components: [
                new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`help menu - ${message.author.id}`)
                        .setMaxValues(1)
                        .setPlaceholder("Lista de ayudas")
                        .setOptions([
                            {
                                label: "Discord De Soporte",
                                value: "discord support",
                                emoji: "👨‍✈️"
                            },
                            {
                                label: "Quejas o Reportes",
                                value: "complaints or reports",
                                emoji: "📮"
                            },
                            {
                                label: "Sobre Mí",
                                value: "about me",
                                emoji: "🔎"
                            },
                            {
                                label: "Configuraciónes",
                                value: "configurations",
                                emoji: "📗"
                            }
                        ])
                )
            ], files: ["./images/about-icon.png"]});
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        }
    }
}