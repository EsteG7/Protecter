const Guilds = require("../../../database/Models/guilds.js");

module.exports = {
    name: "setReportsChannel",
    description: "Permite establecer un canal donde se enviaran todos los reportes de los usuarios.",
    usage: "setReportsChannel <CANAL>",
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
                    await message.reply("`✅` | El canal " + channel.toString() + " ha sido establecido para los reportes.");
                    await Guilds.updateOne({guildId: String(message.guild.id)}, {
                        reportsChannel: String(channel.id)
                    });
                    
                    const logsChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                    if(logsChannel && !logsChannel.size) return await logsChannel.send({embeds: [
                        {
                            author: {
                                name: "CANAL DE REPORTES ESTABLECIDO",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "El canal " + channel.toString() + " ha sido establecido para los **reportes**.\n\n\u2007<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n\u2007<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
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
                } else return await message.reply("`❌` | Debes mencionar un canal de texto del servidor.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "setReportsChannel <CANAL>`");
            } else {
                if(channel && channel?.type === "GUILD_TEXT") {
                    await message.reply("`✅` | El canal " + channel.toString() + " ha sido establecido para los reportes.");
                    await Guilds.updateOne({guildId: String(message.guild.id)}, {
                        reportsChannel: String(channel.id)
                    });
                    
                    const logsChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                    if(logsChannel && !logsChannel.size) return await logsChannel.send({embeds: [
                        {
                            author: {
                                name: "CANAL DE REPORTES ESTABLECIDO",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "El canal " + channel.toString() + " ha sido establecido para los **reportes**.\n\n\u2007**Staff:** " + message.author.toString() + "",
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
                } else return await message.reply("`❌` | Debes mencionar un canal de texto del servidor.\n\n\u2007**Uso:** `" + guildData.prefix + "setReportsChannel <CANAL>`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};