const Guilds = require("../../../database/Models/guilds.js");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "configAntiBots",
    description: "Permite activar o desactivar el sistema de bloqueo a la entrada de bots no verificados.",
    usage: "configAntiBots",
    category: "configuration",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const system = guildData.systems.find((i) => i.name === "antiBots");

            if(guildData.premium.actived === true) {
                await message.reply({embeds: [
                    {
                        author: {
                            name: "SISTEMA ANTI-BOTS",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Prohibe la entrada a bots no verificados al servidor.\n\n<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "",
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
                            .setCustomId(`on antiBots:${message.author.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),

                        new MessageButton()
                            .setCustomId(`off antiBots:${message.author.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER")
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            } else {
                await message.reply({embeds: [
                    {
                        author: {
                            name: "SISTEMA ANTI-BOTS",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Prohibe la entrada a bots no verificados al servidor.\n\n\u2007**Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "",
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
                            .setCustomId(`on antiBots:${message.author.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),

                        new MessageButton()
                            .setCustomId(`off antiBots:${message.author.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER")
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};