const Guilds = require("../../../database/Models/guilds.js");

module.exports = {
    name: "setChannelLogs",
    description: "Permite establecer un canal donde se enviaran todos los registros del bot.",
    usage: "setChannelLogs",
    category: "configuration",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const channel = message.mentions.channels.first();

            if(guildData.premium.actived === true) {
                if(channel && channel?.type === "GUILD_TEXT") {
                    await message.reply("`✅` | El canal " + channel.toString() + " ha sido establecido para los registros.");
                    await Guilds.updateOne({guildId: String(message.guild.id)}, {
                        logsChannel: String(channel.id)
                    });
                    
                    return await channel.send({embeds: [
                        {
                            author: {
                                name: "REGISTROS ESTABLECIDOS",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "El canal " + channel.toString() + " ha sido establecido para los registros.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
                            thumbnail: {
                                url: "attachment://hashtag-icon.png"
                            },
                            footer: {
                                text: client.user.username + " Premium",
                                icon_url: client.user.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    ], files: ["./images/log-icon.png", "./images/hashtag-icon.png"]});
                } else return await message.reply("`❌` | Debes mencionar un canal de texto del servidor.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "setChannelLogs <#CANAL>`");
            } else {
                if(channel && channel?.type === "GUILD_TEXT") {
                    await message.reply("`✅` | El canal " + channel.toString() + " ha sido establecido para los registros.");
                    await Guilds.updateOne({guildId: String(message.guild.id)}, {
                        logsChannel: String(channel.id)
                    });
                    
                    return await channel.send({embeds: [
                        {
                            author: {
                                name: "REGISTROS ESTABLECIDOS",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "El canal " + channel.toString() + " ha sido establecido para los registros.\n\n\u2007**Staff:** " + message.author.toString() + "",
                            thumbnail: {
                                url: "attachment://hashtag-icon.png"
                            },
                            footer: {
                                text: client.user.username,
                                icon_url: client.user.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    ], files: ["./images/log-icon.png", "./images/hastag-icon.png"]});
                } else return await message.reply("`❌` | Debes mencionar un canal de texto del servidor.\n\n\u2007**Uso:** `" + guildData.prefix + "setChannelLogs <#CANAL>`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};