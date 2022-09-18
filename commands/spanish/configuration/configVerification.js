const Guilds = require("../../../database/Models/guilds.js");
const Discord = require("discord.js");

module.exports = {
    name: "configVerification",
    description: "Permite configurar el sistema de verificación del servidor.",
    usage: "configVerification",
    category: "configuration",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const system = guildData.systems.find((i) => i.name === "verification");

            if(guildData.premium.actived === true) {
                await message.reply({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA DE VERIFICACIÓN",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Implementa un sistema de verificación en el servidor con funciones premium.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Captcha Extra:** " + `${system.configsPremium.captchaInDM === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId(`on verification:${message.author.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),
            
                        new Discord.MessageButton()
                            .setCustomId(`off verification:${message.author.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER"),
            
                        new Discord.MessageButton()
                            .setCustomId(`configs verification:${message.author.id}`)
                            .setEmoji("⚙")
                            .setLabel("CONFIGURACIONES")
                            .setDisabled(false)
                            .setStyle("SECONDARY")
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            } else {
                await message.reply({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA VERIFICACIÓN",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Implementa un sistema de verificación en el servidor.\n\n\u2007**Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007**Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007**Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007**Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId(`on verification:${message.author.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),
            
                        new Discord.MessageButton()
                            .setCustomId(`off verification:${message.author.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER"),
            
                        new Discord.MessageButton()
                            .setCustomId(`configs verification:${message.author.id}`)
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