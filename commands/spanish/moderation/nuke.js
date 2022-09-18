module.exports = {
    name: "nuke",
    description: "Permite eliminar todos los mensajes de un canal.",
    usage: "nuke [RAZÓN]",
    category: "moderation",
    lang: "es",
    requeriments: {
        userPerms: ["MANAGE_MESSAGES"],
        botPerms: ["MANAGE_CHANNELS"]
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const reason = args.slice(0).join(" ") || "Desorden de mensajes";

            if(guildData.premium.actived === true) {
                const channelCloned = await message.channel.clone();
    
                if(channelCloned) {
                    await message.channel.delete();
                    const msged = await channelCloned.send({embeds: [
                        {
                            author: {
                                name: "CANAL VACIADO",
                                icon_url: "attachment://trashCan-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "El canal ha sido vaciado por **" + reason + "**.",
                            image: {
                                url: "https://i.pinimg.com/originals/6c/48/5e/6c485efad8b910e5289fc7968ea1d22f.gif"
                            },
                            thumbnail: {
                                url: "attachment://trashCan-icon.png"
                            },
                            footer: {
                                text: client.user.username + " Premium",
                                icon_url: client.user.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    ], files: ["./images/trashCan-icon.png"]}).catch(() => null);

                    const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                    if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                        {
                            author: {
                                name: "CANAL VACIADO",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "El canal " + channelCloned.toString() + " ha sido nukeado por **" + reason + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + channelCloned.toString() + "",
                            fields: [
                                {
                                    name: "\u200b",
                                    value: "<:arrow_right:964247865943801887> **Mensaje Enviado Al Canal:**",
                                    inline: true
                                },
                                {
                                    name: "\u200b",
                                    value: "" + `${msged !== null ? "<:checkboxcheck:959161404882051093>" : "<:checkboxuncheck:959161404785586218>"}` + "",
                                    inline: true
                                }
                            ],
                            thumbnail: {
                                url: "attachment://trashCan-icon.png"
                            },
                            footer: {
                                text: client.user.username + " Premium",
                                icon_url: client.user.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    ], files: ["./images/trashCan-icon.png", "./images/log-icon.png"]});
                } else return await message.reply("`❌` | No tengo los permisos suficientes para limpiar el canal.");
            } else {
                const channelCloned = await message.channel.clone();
                if(channelCloned) {
                    await message.channel.delete();
                    await channelCloned.send({embeds: [
                        {
                            author: {
                                name: "CANAL LIMPIADO",
                                icon_url: "attachment://trashCan-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "El canal ha sido vaciado por **" + reason + "**.",
                            image: {
                                url: "https://i.pinimg.com/originals/6c/48/5e/6c485efad8b910e5289fc7968ea1d22f.gif"
                            },
                            thumbnail: {
                                url: "attachment://trashCan-icon.png"
                            },
                            footer: {
                                text: client.user.username,
                                icon_url: client.user.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    ], files: ["./images/trashCan-icon.png"]});
    
                    const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                    if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                        {
                            author: {
                                name: "NUKEO REALIZADO",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "El staff " + message.author.toString() + " ha nukeado el canal " + message.channel.toString() + ".\n\n\u2007**Razón:** " + reason + "",
                            thumbnail: {
                                url: "attachment://trashCan-icon.png"
                            },
                            footer: {
                                text: client.user.username,
                                icon_url: client.user.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    ], files: ["./images/trashCan-icon.png", "./images/log-icon.png"]});
                } else return await message.reply("`❌` | No tengo los permisos suficientes para limpiar el canal.");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};