const { MessageActionRow, MessageButton } = require("discord.js");
const hastebin = require("hastebin-gen");

module.exports = {
    name: "config-AntiWords",
    description: "Permite activar o desactivar el sistema y agregar o eliminar palabras que seran bloqueadas en los mensajes.",
    usage: "configAntiWords",
    category: "configuration",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const system = guildData.systems.find((i) => i.name === "antiWords");

            if(guildData.premium.actived === true) {
                const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });

                await message.reply({embeds: [
                    {
                        author: {
                            name: "SISTEMA ANTI-WORDS",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Palabras Bloqueadas:** " + haste + "",
                        thumbnail: {
                            url: "attachment://dbConfig-icon.png"
                        },
                        footer: {
                            text: client.user.username + " Premium",
                            icon_url: client.user.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                ], components: [
                    new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`antiWords on - ${message.author.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),

                        new MessageButton()
                            .setCustomId(`antiWords off - ${message.author.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER"),

                        new MessageButton()
                            .setCustomId(`antiWords configs - ${message.author.id}`)
                            .setEmoji("⚙")
                            .setLabel("CONFIGURACIONES")
                            .setDisabled(false)
                            .setStyle("SECONDARY")
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            } else {
                const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });

                await message.reply({embeds: [
                    {
                        author: {
                            name: "SISTEMA ANTI-WORDS",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007**Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007**Palabras Bloqueadas:** " + haste + "\n\u2007**Limite:** " + system.list.length + "/4",
                        thumbnail: {
                            url: "attachment://dbConfig-icon.png"
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
                        new MessageButton()
                            .setCustomId(`antiWords on - ${message.author.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),

                        new MessageButton()
                            .setCustomId(`antiWords off - ${message.author.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER"),

                        new MessageButton()
                            .setCustomId(`antiWords configs - ${message.author.id}`)
                            .setEmoji("⚙")
                            .setLabel("CONFIGURACIONES")
                            .setDisabled(false)
                            .setStyle("SECONDARY")
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};