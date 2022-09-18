const Guilds = require("../../../database/Models/guilds.js");

module.exports = {
    name: "setPrefix",
    description: "Permite establecer un prefijo personalizado al bot.",
    usage: "setPrefix",
    category: "configuration",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const newPrefix = args[0]?.toLowerCase();

            if(guildData.premium.actived === true) {
                if(newPrefix) {
                    if(newPrefix.length < 5) {
                        await message.reply("`✅` | El prefijo **" + newPrefix + "** ha sido establecido correctamente.");
                        await Guilds.updateOne({guildId: String(message.guild.id)}, {
                            prefix: newPrefix
                        });

                        const logsChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                        if(logsChannel && !logsChannel.size) return await logsChannel.send({embeds: [
                            {
                                author: {
                                    name: "PREFIJO CAMBIADO",
                                    icon_url: "attachment://log-icon.png"
                                },
                                color: "#5A9EC9",
                                description: "El prefijo del bot ha sido cambiado a **" + newPrefix + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
                                thumbnail: {
                                    url: "attachment://exclamation-icon.png"
                                },
                                footer: {
                                    text: client.user.username + " Premium",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        ], files: ["./images/log-icon.png", "./images/exclamation-icon.png"]});
                    } else return await message.reply("`❌` | El prefijo solo puede tener un maximo de 5 caracteres.");
                } else return await message.reply("`❌` | Debes escribir el nuevo prefijo que quieres establecer.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "setPrefix <NUEVO PREFIJO>`");
            } else {
                const newPrefix = args[0]?.toLowerCase();

                if(newPrefix) {
                    if(newPrefix.length < 5) {
                        await message.reply("`✅` | El prefijo **" + newPrefix + "** ha sido establecido correctamente.");
                        await Guilds.updateOne({guildId: String(message.guild.id)}, {
                            prefix: newPrefix
                        });

                        const logsChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                        if(logsChannel && !logsChannel.size) return await logsChannel.send({embeds: [
                            {
                                author: {
                                    name: "PREFIJO CAMBIADO",
                                    icon_url: "attachment://log-icon.png"
                                },
                                color: "#5A9EC9",
                                description: "El prefijo del bot ha sido cambiado a **" + newPrefix + "**.\n\n\u2007**Staff:** " + message.author.toString() + "",
                                thumbnail: {
                                    url: "attachment://exclamation-icon.png"
                                },
                                footer: {
                                    text: client.user.username,
                                    icon_url: client.user.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        ], files: ["./images/log-icon.png", "./images/exclamation-icon.png"]});
                    } else return await message.reply("`❌` | El prefijo solo puede tener un maximo de 5 caracteres.");
                } else return await message.reply("`❌` | Debes escribir el nuevo prefijo que quieres establecer.\n\n\u2007**Uso:** `" + guildData.prefix + "setPrefix <NUEVO PREFIJO>`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};