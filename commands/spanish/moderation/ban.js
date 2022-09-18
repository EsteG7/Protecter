const Users = require("../../../database/Models/users.js");

module.exports = {
    name: "ban",
    description: "Permite banear indefinidamente a un usuario del servidor.",
    usage: "ban <USUARIO> [RAZÓN]",
    category: "moderation",
    lang: "es",
    requeriments: {
        userPerms: ["BAN_MEMBERS"],
        botPerms: ["BAN_MEMBERS"]
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
            const reason = args.slice(1).join(" ") || "Mal comportamiento";

            if(guildData.premium.actived === true) {
                if(user) {
                    if(user.id !== client.user.id && user.id !== message.author.id) {
                        const member = await message.guild.members.fetch(user).catch(() => null);
    
                        if(member && !member.size) {
                            if(!member.permissions.has("ADMINISTRATOR")) {
                                if(message.member.roles.cache.first().position > member.roles.cache.first().position) {
                                    if(message.guild.me.roles.cache.first().position > member.roles.cache.first().position) {
                                        if(member.bannable) {
                                            const isBanned = await message.guild.bans.fetch(user.id).catch(() => null);
            
                                            if(!isBanned) {
                                                const msged = await member.send({embeds: [
                                                    {
                                                        author: {
                                                            name: "HAS SIDO BANEADO",
                                                            icon_url: "attachment://log-icon.png"
                                                        },
                                                        color: "#5A9EC9",
                                                        description: "Has sido baneado del servidor **" + message.guild.name + "** por **" + reason + "**.\n\n\u2007<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n\u2007<:arrow_right:964247865943801887> **Tiempo:** Indefinido",
                                                        thumbnail: {
                                                            url: "attachment://hammer-icon.png"
                                                        },
                                                        footer: {
                                                            text: client.user.username + " Premium",
                                                            icon_url: client.user.displayAvatarURL()
                                                        },
                                                        timestamp: new Date()
                                                    }
                                                ]}).catch(() => null);

                                                const banned = await member.ban({days: 7, reason: reason});
                                                if(banned) {
                                                    await message.reply({embeds: [
                                                        {
                                                            author: {
                                                                name: "USUARIO BANEADO",
                                                                icon_url: "attachment://log-icon.png"
                                                            },
                                                            color: "#5A9EC9",
                                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor por **" + reason + "**.\n\n\u2007<:arrow_right:964247865943801887> **Tiempo:** Indefinido",
                                                            thumbnail: {
                                                                url: "attachment://hammer-icon.png"
                                                            },
                                                            footer: {
                                                                text: client.user.username + " Premium",
                                                                icon_url: client.user.displayAvatarURL()
                                                            },
                                                            timestamp: new Date()
                                                        }
                                                    ], files: ["./images/hammer-icon.png", "./images/log-icon.png"]});

                                                    const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                                                    if(userData) {
                                                        await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                                            ban: {
                                                                isBanned: true,
                                                                endAt: null
                                                            },
                                                            $push: {
                                                                infractions: {
                                                                    type: "BAN",
                                                                    staff: String(message.author.id),
                                                                    reason: reason
                                                                }
                                                            }
                                                        });
                                                    } else await Users.create({
                                                        guildId: String(message.guild.id),
                                                        userId: String(user.id),
                                                        ban: {
                                                            isBanned: true,
                                                            endAt: null
                                                        },
                                                        infractions: [
                                                            {
                                                                type: "BAN",
                                                                staff: String(message.author.id),
                                                                reason: reason
                                                            }
                                                        ]
                                                    });
            
                                                    const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                                    if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                                        {
                                                            author: {
                                                                name: "USUARIO BANEADO",
                                                                icon_url: "attachment://log-icon.png"
                                                            },
                                                            color: "#5A9EC9",
                                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor por **" + reason + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Tiempo:** Indefinido\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
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
                                                                url: "attachment://hammer-icon.png"
                                                            },
                                                            footer: {
                                                                text: client.user.username + " Premium",
                                                                icon_url: client.user.displayAvatarURL()
                                                            },
                                                            timestamp: new Date()
                                                        }
                                                    ], files: ["./images/hammer-icon.png", "./images/log-icon.png"]});
                                                } else return await message.reply("`❌` | No fue posible banear al " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + ".");
                                            } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ya esta baneado del servidor.");
                                        } else return await message.reply("`❌` | No puedo banear al " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + ".");
                                    } else return await message.reply("`❌` | No puedo banear a un " + `${user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a mi.");
                                } else return await message.reply("`❌` | No puedes banear a un " + `${user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a ti.");
                            } else return await message.reply("`❌` | No se puede banear a un administrador del servidor.");
                        } else {
                            const isBanned = await message.guild.bans.fetch(user.id).catch(() => null);
    
                            if(!isBanned) {
                                const banned = await message.guild.bans.create(user.id, { reason: reason });
    
                                if(banned) {
                                    await message.reply({embeds: [
                                        {
                                            author: {
                                                name: "USUARIO BANEADO",
                                                icon_url: "attachment://log-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor por **" + reason + "**.\n\n\u2007<:arrow_right:964247865943801887> **Tiempo:** Indefinido",
                                            thumbnail: {
                                                url: "attachment://hammer-icon.png"
                                            },
                                            footer: {
                                                text: client.user.username + " Premium",
                                                icon_url: client.user.displayAvatarURL()
                                            },
                                            timestamp: new Date()
                                        }
                                    ], files: ["./images/hammer-icon.png", "./images/log-icon.png"]});

                                    const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                                    if(userData) {
                                        await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                            ban: {
                                                isBanned: true,
                                                endAt: null
                                            },
                                            $push: {
                                                infractions: {
                                                    type: "BAN",
                                                    staff: String(message.author.id),
                                                    reason: reason
                                                }
                                            }
                                        });
                                    } else await Users.create({
                                        guildId: String(message.guild.id),
                                        userId: String(user.id),
                                        ban: {
                                            isBanned: true,
                                            endAt: null
                                        },
                                        infractions: [
                                            {
                                                type: "BAN",
                                                staff: String(message.author.id),
                                                reason: reason
                                            }
                                        ]
                                    });
    
                                    const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                    if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                        {
                                            author: {
                                                name: "USUARIO BANEADO",
                                                icon_url: "attachment://log-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor por **" + reason + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Tiempo:** Indefinido\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
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
                                                url: "attachment://hammer-icon.png"
                                            },
                                            footer: {
                                                text: client.user.username + " Premium",
                                                icon_url: client.user.displayAvatarURL()
                                            },
                                            timestamp: new Date()
                                        }
                                    ], files: ["./images/hammer-icon.png", "./images/log-icon.png"]});
                                } else return await message.reply("`❌` | No fue posible banear al " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + ".");
                            } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ya esta baneado del servidor.");
                        }
                    } else return await message.reply("`❌` | No puedes hacer eso.");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para banearlo.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "ban <USUARIO> [RAZÓN]`");
            } else {
                if(user) {
                    if(user.id !== client.user.id && user.id !== message.author.id) {
                        const member = await message.guild.members.fetch(user).catch(() => null);
    
                        if(member && !member.size) {
                            if(!member.permissions.has("ADMINISTRATOR")) {
                                if(message.member.roles.cache.first().position > member.roles.cache.first().position) {
                                    if(message.guild.me.roles.cache.first().position > member.roles.cache.first().position) {
                                        if(member.bannable) {
                                            const isBanned = await message.guild.bans.fetch(user.id).catch(() => null);
            
                                            if(!isBanned) {
                                                const banned = await member.ban({days: 7, reason: reason});
                                        
                                                if(banned) {
                                                    await message.reply({content: "`✅` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor por **" + reason + "**.\n\n\u2007**Tiempo:** Indefinido"});
                                                    
                                                    const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                                                    if(userData) {
                                                        await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                                            ban: {
                                                                isBanned: true,
                                                                endAt: null
                                                            },
                                                            $push: {
                                                                infractions: {
                                                                    type: "BAN",
                                                                    staff: String(message.author.id),
                                                                    reason: reason
                                                                }
                                                            }
                                                        });
                                                    } else await Users.create({
                                                        guildId: String(message.guild.id),
                                                        userId: String(user.id),
                                                        ban: {
                                                            isBanned: true,
                                                            endAt: null
                                                        },
                                                        infractions: [
                                                            {
                                                                type: "BAN",
                                                                staff: String(message.author.id),
                                                                reason: reason
                                                            }
                                                        ]
                                                    });
            
                                                    const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                                    if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                                        {
                                                            author: {
                                                                name: "BANEO REALIZADO",
                                                                icon_url: "attachment://log-icon.png"
                                                            },
                                                            color: "#5A9EC9",
                                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor.\n\n\u2007**Razón:** " + reason + "\n\u2007**Staff:** " + message.author.toString() + "\n\u2007**Tiempo:** Indefinido",
                                                            thumbnail: {
                                                                url: "attachment://hammer-icon.png"
                                                            },
                                                            footer: {
                                                                text: client.user.username,
                                                                icon_url: client.user.displayAvatarURL()
                                                            },
                                                            timestamp: new Date()
                                                        }
                                                    ], files: ["./images/hammer-icon.png", "./images/log-icon.png"]});
                                                } else return await message.reply("`❌` | No fue posible banear al " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + ".");
                                            } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ya esta baneado del servidor.");
                                        } else return await message.reply("`❌` | No puedo banear al " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + ".");
                                    } else return await message.reply("`❌` | No puedo banear a un " + `${user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a mi.");
                                } else return await message.reply("`❌` | No puedes banear a un " + `${user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a ti.");
                            } else return await message.reply("`❌` | No se puede banear a un administrador del servidor.");
                        } else {
                            const isBanned = await message.guild.bans.fetch(user.id).catch(() => null);
    
                            if(!isBanned) {
                                const banned = await message.guild.bans.create(user.id, { reason: reason });
    
                                if(banned) {
                                    await message.reply({content: "`✅` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor por **" + reason + "**.\n\n\u2007**Tiempo:** Indefinido"});
                                    
                                    const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                                    if(userData) {
                                        await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                            ban: {
                                                isBanned: true,
                                                endAt: null
                                            },
                                            $push: {
                                                infractions: {
                                                    type: "BAN",
                                                    staff: String(message.author.id),
                                                    reason: reason
                                                }
                                            }
                                        });
                                    } else await Users.create({
                                        guildId: String(message.guild.id),
                                        userId: String(user.id),
                                        ban: {
                                            isBanned: true,
                                            endAt: null
                                        },
                                        infractions: [
                                            {
                                                type: "BAN",
                                                staff: String(message.author.id),
                                                reason: reason
                                            }
                                        ]
                                    });
    
                                    const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                    if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                        {
                                            author: {
                                                name: "BANEO REALIZADO",
                                                icon_url: "attachment://log-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor.\n\n\u2007**Razón:** " + reason + "\n\u2007**Staff:** " + message.author.toString() + "\n\u2007**Tiempo:** Indefinido",
                                            thumbnail: {
                                                url: "attachment://hammer-icon.png"
                                            },
                                            footer: {
                                                text: client.user.username,
                                                icon_url: client.user.displayAvatarURL()
                                            },
                                            timestamp: new Date()
                                        }
                                    ], files: ["./images/hammer-icon.png", "./images/log-icon.png"]});
                                } else return await message.reply("`❌` | No fue posible banear al " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + ".");
                            } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ya esta baneado del servidor.");
                        }
                    } else return await message.reply("`❌` | No puedes hacer eso.");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para banearlo.\n\n\u2007**Uso:** `" + guildData.prefix + "ban <USUARIO> [RAZÓN]`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};