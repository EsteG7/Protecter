const Users = require("../../../database/Models/users.js");

module.exports = {
    name: "unMute",
    description: "Permite quitarle el silencio a un usuario sancionado.",
    usage: "unMute <USUARIO> [RAZÓN]",
    category: "moderation",
    lang: "es",
    requeriments: {
        userPerms: ["MANAGE_MESSAGES"],
        botPerms: ["MANAGE_ROLES"]
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
            const reason = args.slice(1).join(" ") || "Tiempo terminado";

            if(guildData.premium.actived === true) {
                if(user) {
                    if(user.id !== client.user.id && user.id !== message.author.id) {
                        const rol = await message.guild.roles.fetch(guildData.muteRol).catch(() => null);
    
                        if(rol && !rol.size) {
                            const member = await message.guild.members.fetch(user.id).catch(() => null);
                            
                            if(member && !member.size) {
                                if(member.roles.cache.has(rol.id)) {
                                    const msged = await member.send({embeds: [
                                        {
                                            author: {
                                                name: "HAS SIDO DES-SILENCIADO",
                                                icon_url: "attachment://log-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "Has sido des-silenciado en el servidor **" + message.guild.name + "** por **" + reason + "**.\n\n\u2007<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "",
                                            thumbnail: {
                                                url: "attachment://speaker-icon.png"
                                            },
                                            footer: {
                                                text: client.user.username + " Premium",
                                                icon_url: client.user.displayAvatarURL()
                                            },
                                            timestamp: new Date()
                                        }
                                    ], files: ["./images/speaker-icon.png", "./images/log-icon.png"]}).catch(() => null);

                                    const unMuted = await member.roles.remove(rol.id);
                                    if(unMuted) {
                                        await message.reply({embeds: [
                                            {
                                                author: {
                                                    name: "USUARIO DES-SILENCIADO",
                                                    icon_url: "attachment://log-icon.png"
                                                },
                                                color: "#5A9EC9",
                                                description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido des-silenciado por **" + reason + "**.",
                                                thumbnail: {
                                                    url: "attachment://speaker-icon.png"
                                                },
                                                footer: {
                                                    text: client.user.username + " Premium",
                                                    icon_url: client.user.displayAvatarURL()
                                                },
                                                timestamp: new Date()
                                            }
                                        ], files: ["./images/speaker-icon.png", "./images/log-icon.png"]});

                                        const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                                        if(userData) {
                                            await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                                mute: {
                                                    isMuted: false,
                                                    endAt: null
                                                }
                                            });
                                        } else await Users.create({
                                            guildId: String(message.guild.id),
                                            userId: String(user.id),
                                            mute: {
                                                isMuted: false,
                                                endAt: null
                                            }
                                        });
    
                                        const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                        if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                            {
                                                author: {
                                                    name: "USUARIO DES-SILENCIADO",
                                                    icon_url: "attachment://log-icon.png"
                                                },
                                                color: "#5A9EC9",
                                                description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido des-silenciado por **" + reason + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
                                                fields: [
                                                    {
                                                        name: "\u200b",
                                                        value: "<:arrow_right:964247865943801887> **Mensaje Enviado Al Usuario:**",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "\u200b",
                                                        value: "" + `${msged !== null ? "<:checkboxcheck:959161404882051093>" : "<:checkboxuncheck:959161404785586218>"}` + "",
                                                        inline: true
                                                    }
                                                ],
                                                thumbnail: {
                                                    url: "attachment://speaker-icon.png"
                                                },
                                                footer: {
                                                    text: client.user.username + " Premium",
                                                    icon_url: client.user.displayAvatarURL()
                                                },
                                                timestamp: new Date()
                                            }
                                        ], files: ["./images/speaker-icon.png", "./images/log-icon.png"]});
                                    } else return await message.reply("`❌` | No fue posible quitarle el silencio.");
                                } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " no esta silenciado.");
                            } else {
                                const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
    
                                if(userData && userData.mute.isMuted === true) {
                                    await message.reply({embeds: [
                                        {
                                            author: {
                                                name: "USUARIO DES-SILENCIADO",
                                                icon_url: "attachment://log-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido des-silenciado por **" + reason + "**.",
                                            thumbnail: {
                                                url: "attachment://speaker-icon.png"
                                            },
                                            footer: {
                                                text: client.user.username + " Premium",
                                                icon_url: client.user.displayAvatarURL()
                                            },
                                            timestamp: new Date()
                                        }
                                    ], files: ["./images/speaker-icon.png", "./images/log-icon.png"]});
                                    
                                    if(userData) {
                                        await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                            mute: {
                                                isMuted: false,
                                                endAt: null
                                            }
                                        });
                                    } else await Users.create({
                                        guildId: String(message.guild.id),
                                        userId: String(user.id),
                                        mute: {
                                            isMuted: false,
                                            endAt: null
                                        }
                                    });
    
                                    const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                    if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                        {
                                            author: {
                                                name: "USUARIO DES-SILENCIADO",
                                                icon_url: "attachment://log-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido des-silenciado por **" + reason + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
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
                                                url: "attachment://speaker-icon.png"
                                            },
                                            footer: {
                                                text: client.user.username + " Premium",
                                                icon_url: client.user.displayAvatarURL()
                                            },
                                            timestamp: new Date()
                                        }
                                    ], files: ["./images/speaker-icon.png", "./images/log-icon.png"]});
                                } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " no esta silenciado.");
                            }
                        } else return await message.reply("`❌` | El servidor no tiene un rol para los sileciados establecido.");
                    } else return await message.reply("`❌` | No puedes hacer eso.");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para quitarle el silencio.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "unMute <USUARIO> [RAZÓN]`");
            } else {
                if(user) {
                    if(user.id !== client.user.id && user.id !== message.author.id) {
                        const rol = await message.guild.roles.fetch(guildData.muteRol).catch(() => null);
    
                        if(rol && !rol.size) {
                            const member = await message.guild.members.fetch(user.id).catch(() => null);
                            
                            if(member && !member.size) {
                                if(member.roles.cache.has(rol.id)) {
                                    const unMuted = await member.roles.remove(rol.id);
                                    
                                    if(unMuted) {
                                        await message.reply("`✅` | Se le quito el silencio al " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + ".");
                                        
                                        const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                                        if(userData) {
                                            await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                                mute: {
                                                    isMuted: false,
                                                    endAt: null
                                                }
                                            });
                                        } else await Users.create({
                                            guildId: String(message.guild.id),
                                            userId: String(user.id),
                                            mute: {
                                                isMuted: false,
                                                endAt: null
                                            }
                                        });
    
                                        const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                        if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                            {
                                                author: {
                                                    name: "SILENCIO REMOVIDO",
                                                    icon_url: "attachment://log-icon.png"
                                                },
                                                color: "#5A9EC9",
                                                description: "Se le quito el silencio al " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + ".\n\n\u2007**Staff:** " + message.author.toString() + "",
                                                thumbnail: {
                                                    url: "attachment://speaker-icon.png"
                                                },
                                                footer: {
                                                    text: client.user.username,
                                                    icon_url: client.user.displayAvatarURL()
                                                },
                                                timestamp: new Date()
                                            }
                                        ], files: ["./images/speaker-icon.png", "./images/log-icon.png"]});
                                    } else return await message.reply("`❌` | No fue posible quitarle el silencio.");
                                } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " no esta silenciado.");
                            } else {
                                const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
    
                                if(userData && userData.mute.isMuted === true) {
                                    await message.reply("`✅` | Se le quito el silencio al " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + ".");
                                    
                                    if(userData) {
                                        await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                            mute: {
                                                isMuted: false,
                                                endAt: null
                                            }
                                        });
                                    } else await Users.create({
                                        guildId: String(message.guild.id),
                                        userId: String(user.id),
                                        mute: {
                                            isMuted: false,
                                            endAt: null
                                        }
                                    });
    
                                    const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                    if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                        {
                                            author: {
                                                name: "SILENCIO REMOVIDO",
                                                icon_url: "attachment://log-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "Se le quito el silencio al " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + ".\n\n\u2007**Staff:** " + message.author.toString() + "",
                                            thumbnail: {
                                                url: "attachment://speaker-icon.png"
                                            },
                                            footer: {
                                                text: client.user.username,
                                                icon_url: client.user.displayAvatarURL()
                                            },
                                            timestamp: new Date()
                                        }
                                    ], files: ["./images/speaker-icon.png", "./images/log-icon.png"]});
                                } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " no esta silenciado.");
                            }
                        } else return await message.reply("`❌` | El servidor no tiene un rol para los sileciados establecido.");
                    } else return await message.reply("`❌` | No puedes hacer eso.");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para quitarle el silencio.\n\n\u2007**Uso:** `" + guildData.prefix + "unMute <USUARIO> [RAZÓN]`");
            }
        } catch (error) {
            console.log("[ERROR] ".cyan + `${error.stack}`.red);
        }
    }
}