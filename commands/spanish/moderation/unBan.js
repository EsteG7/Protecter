const Users = require("../../../database/Models/users.js");

module.exports = {
    name: "unBan",
    description: "Permite quitarle el baneo a un usuario del servidor.",
    usage: "unBan <USUARIO> [RAZÓN]",
    category: "moderation",
    lang: "es",
    requeriments: {
        userPerms: ["BAN_MEMBERS"],
        botPerms: ["BAN_MEMBERS"]
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
            const reason = args.slice(1).join(" ") || "Tiempo terminado";

            if(guildData.premium.actived === true) {
                if(user) {
                    if(user.id !== message.author.id && user.id !== client.user.id) {
                        const isBanned = await message.guild.bans.fetch(user.id).catch(() => null);
    
                        if(isBanned) {
                            const unBanned = await message.guild.bans.remove(user.id, reason);
    
                            if(unBanned) {
                                await message.reply({embeds: [
                                    {
                                        author: {
                                            name: "USUARIO DESBANEADO",
                                            icon_url: "attachment://log-icon.png"
                                        },
                                        color: "#5A9EC9",
                                        description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido desbaneado del servidor por **" + reason + "**.",
                                        thumbnail: {
                                            url: "attachment://log-icon.png"
                                        },
                                        footer: {
                                            text: client.user.username + " Premium",
                                            icon_url: client.user.displayAvatarURL()
                                        },
                                        timestamp: new Date()
                                    }
                                ], files: ["./images/log-icon.png"]});

                                const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                                if(userData) await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                    ban: {
                                        isBanned: false,
                                        endAt: null
                                    }
                                });
    
                                const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                    {
                                        author: {
                                            name: "USUARIO DESBANEADO",
                                            icon_url: "attachment://log-icon.png"
                                        },
                                        color: "#5A9EC9",
                                        description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido desbaneado del servidor por **" + reason + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
                                        fields: [
                                            {
                                                name: "\u200b",
                                                value: "<:arrow_right:964247865943801887> **Mensaje Enviado Al Usuario:**",
                                                inline: true
                                            },
                                            {
                                                name: "\u200b",
                                                value: "<:checkboxuncheck:959161404785586218>",
                                                inline: true
                                            }
                                        ],
                                        thumbnail: {
                                            url: "attachment://log-icon.png"
                                        },
                                        footer: {
                                            text: client.user.username + " Premium",
                                            icon_url: client.user.displayAvatarURL()
                                        },
                                        timestamp: new Date()
                                    }
                                ], files: ["./images/log-icon.png"]});
                            } else return await message.reply("`❌` | No fue posible quitarle el baneo.");
                        } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " no esta baneado.");
                    } else return await message.reply("`❌` | No puedes hacer eso.");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para quitarle el baneo.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "unban <USUARIO> [RAZÓN]`");
            } else {
                if(user) {
                    if(user.id !== message.author.id && user.id !== client.user.id) {
                        const isBanned = await message.guild.bans.fetch(user.id).catch(() => null);
    
                        if(isBanned) {
                            const unBanned = await message.guild.bans.remove(user.id, reason);
    
                            if(unBanned) {
                                await message.reply("`✅` | El " + `${user.bot ? "bot" : "usuario"}` + " ha sido desbaneado del servidor por **" + reason + "**.");
                                
                                const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                                if(userData) await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                    ban: {
                                        isBanned: false,
                                        endAt: null
                                    }
                                });
    
                                const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                    {
                                        author: {
                                            name: "BANEO REMOVIDO",
                                            icon_url: "attachment://log-icon.png"
                                        },
                                        color: "#5A9EC9",
                                        description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido desbaneado del servidor por **" + reason + "**.\n\n\u2007**Staff:** " + message.author.toString() + "",
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
                            } else return await message.reply("`❌` | No fue posible quitarle el baneo.");
                        } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " no esta baneado.");
                    } else return await message.reply("`❌` | No puedes hacer eso.");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para quitarle el baneo.\n\n\u2007**Uso:** `" + guildData.prefix + "unban <USUARIO> [RAZÓN]`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};