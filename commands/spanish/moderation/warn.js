const Users = require("../../../database/Models/users.js");
const Warns = require("../../../database/Models/warns.js");

module.exports = {
    name: "warn",
    description: "Permite advertir a un usuario del servidor.",
    usage: "warn <USUARIO> [RAZÓN]",
    category: "moderation",
    lang: "es",
    requeriments: {
        userPerms: ["MANAGE_MESSAGES"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
            const reason = args.slice(1).join(" ") || "Mal comportamiento";

            if(guildData.premium.actived === true) {
                if(user) {
                    if(user.id !== client.user.id && user.id !== message.author.id) {
                        const member = await message.guild.members.fetch(user.id).catch(() => null);
    
                        if(member && !member.size) {
                            if(message.member.roles.cache.first().position > member.roles.cache.first().position) {
                                if(message.guild.me.roles.cache.first().position > member.roles.cache.first().position) {
                                    const msged = await user.send({embeds: [
                                        {
                                            author: {
                                                name: "HAS SIDO ADVERTIDO",
                                                icon_url: "attachment://log-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "Has sido advertido en el servidor **" + message.guild.name + "** por **" + reason + "**.\n\n\u2007<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n\u2007<:arrow_right:964247865943801887> **Tiempo:** Indefinido",
                                            thumbnail: {
                                                url: "attachment://hammer-icon.png"
                                            },
                                            footer: {
                                                text: client.user.username + " Premium",
                                                icon_url: client.user.displayAvatarURL()
                                            },
                                            timestamp: new Date()
                                        }
                                    ], files: ["./images/hammer-icon.png", "./images/log-icon.png"]}).catch(() => null);

                                    await message.reply({embeds: [
                                        {
                                            author: {
                                                name: "USUARIO ADVERTIDO",
                                                icon_url: "attachment://log-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido advertido por **" + reason + "**.\n\n\u2007<:arrow_right:964247865943801887> **Tiempo:** Indefinido",
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
                                            warns: userData.warns + 1,
                                            $push: {
                                                infractions: {
                                                    type: "WARN",
                                                    staff: String(message.author.id),
                                                    reason: reason
                                                }
                                            }
                                        });
                                    } else await Users.create({
                                        guildId: String(message.guild.id),
                                        userId: String(user.id),
                                        warns: 1,
                                        infractions: [
                                            {
                                                type: "WARN",
                                                staff: String(message.author.id),
                                                reason: reason
                                            }
                                        ]
                                    });
    
                                    const warns = await Warns.count({guildId: String(message.guild.id), userId: String(user.id)});
                                    await Warns.create({
                                        guildId: String(message.guild.id),
                                        userId: String(user.id),
                                        warnId: warns + 1,
                                        reason: reason,
                                        staff: String(message.author.id)
                                    });
        
                                    const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                    if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                        {
                                            author: {
                                                name: "USUARIO ADVERTIDO",
                                                icon_url: "attachment://log-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido advertido por **" + reason + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
                                            fields: [
                                                {
                                                    name: "\u200b",
                                                    value: "<:arrow_right:964247865943801887> **Mensaje Enviado Al Usuario:**",
                                                    inline: true
                                                },
                                                {
                                                    name: "\u200b",
                                                    value: "" + `${msged !== null ? "<:checkboxcheck:959161404882051093>" : "<:checkboxuncheck:959161404785586218>"}` + ""
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
                                } else return await message.reply("`❌` | No puedo advertir a un " + `${user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a mi.");
                            } else return await message.reply("`❌` | No puedes advertir a un " + `${user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a ti.");
                        } else {
                            await message.reply({embeds: [
                                {
                                    author: {
                                        name: "USUARIO ADVERTIDO",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido advertido por **" + reason + "**.\n\n\u2007<:arrow_right:964247865943801887> **Tiempo:** Indefinido",
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
                                    warns: userData.warns + 1,
                                    $push: {
                                        infractions: {
                                            type: "WARN",
                                            staff: String(message.author.id),
                                            reason: reason
                                        }
                                    }
                                });
                            } else await Users.create({
                                guildId: String(message.guild.id),
                                userId: String(user.id),
                                warns: 1,
                                infractions: [
                                    {
                                        type: "WARN",
                                        staff: String(message.author.id),
                                        reason: reason
                                    }
                                ]
                            });
    
                            const warns = await Warns.count({guildId: String(message.guild.id), userId: String(user.id)});
                            await Warns.create({
                                guildId: String(message.guild.id),
                                userId: String(user.id),
                                warnId: warns + 1,
                                reason: reason,
                                staff: String(message.author.id)
                            });
    
                            const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                            if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                {
                                    author: {
                                        name: "USUARIO ADVERTIDO",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido advertido por **" + reason + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
                                    fields: [
                                        {
                                            name: "\u200b",
                                            value: "<:arrow_right:964247865943801887> **Mensaje Enviado Al Usuario:**",
                                            inline: true
                                        },
                                        {
                                            name: "\u200b",
                                            value: "<:checkboxuncheck:959161404785586218>"
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
                        }
                    } else return await message.reply("`❌` | No puedes hacer eso.");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para sancionarle.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "warn <USUARIO> [RAZÓN]`");
            } else {
                if(user) {
                    if(user.id !== client.user.id && user.id !== message.author.id) {
                        const member = await message.guild.members.fetch(user.id).catch(() => null);
    
                        if(member && !member.size) {
                            if(message.member.roles.cache.first().position > member.roles.cache.first().position) {
                                if(message.guild.me.roles.cache.first().position > member.roles.cache.first().position) {
                                    await message.reply("`✅` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido advertido por **" + reason + "**.");
                                    
                                    const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                                    if(userData) {
                                        await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                            warns: userData.warns + 1,
                                            $push: {
                                                infractions: {
                                                    type: "WARN",
                                                    staff: String(message.author.id),
                                                    reason: reason
                                                }
                                            }
                                        });
                                    } else await Users.create({
                                        guildId: String(message.guild.id),
                                        userId: String(user.id),
                                        warns: 1,
                                        infractions: [
                                            {
                                                type: "WARN",
                                                staff: String(message.author.id),
                                                reason: reason
                                            }
                                        ]
                                    });
    
                                    const warns = await Warns.count({guildId: String(message.guild.id), userId: String(user.id)});
                                    await Warns.create({
                                        guildId: String(message.guild.id),
                                        userId: String(user.id),
                                        warnId: warns + 1,
                                        reason: reason,
                                        staff: String(message.author.id)
                                    });
        
                                    const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                    if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                        {
                                            author: {
                                                name: "ADVERTENCIA REALIZADA",
                                                icon_url: "attachment://log-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido advertido por **" + reason + "**.\n\n\u2007**Staff:** " + message.author.toString() + "",
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
                                } else return await message.reply("`❌` | No puedo advertir a un " + `${user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a mi.");
                            } else return await message.reply("`❌` | No puedes advertir a un " + `${user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a ti.");
                        } else {
                            await message.reply("`✅` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido advertido por **" + reason + "**.");
                            
                            const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                            if(userData) {
                                await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                    warns: userData.warns + 1,
                                    $push: {
                                        infractions: {
                                            type: "WARN",
                                            staff: String(message.author.id),
                                            reason: reason
                                        }
                                    }
                                });
                            } else await Users.create({
                                guildId: String(message.guild.id),
                                userId: String(user.id),
                                warns: 1,
                                infractions: [
                                    {
                                        type: "WARN",
                                        staff: String(message.author.id),
                                        reason: reason
                                    }
                                ]
                            });
    
                            const warns = await Warns.count({guildId: String(message.guild.id), userId: String(user.id)});
                            await Warns.create({
                                guildId: String(message.guild.id),
                                userId: String(user.id),
                                warnId: warns + 1,
                                reason: reason,
                                staff: String(message.author.id)
                            });
    
                            const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                            if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                {
                                    author: {
                                        name: "ADVERTENCIA REALIZADA",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido advertido por **" + reason + "**.\n\n\u2007**Staff:** " + message.author.toString() + "",
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
                        }
                    } else return await message.reply("`❌` | No puedes hacer eso.");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para sancionarle.\n\n\u2007**Uso:** `" + guildData.prefix + "warn <USUARIO> [RAZÓN]`");
            }
        } catch (error) {
            console.log("[ERROR] ".cyan + `${error.stack}`.red);
        }
    }
};