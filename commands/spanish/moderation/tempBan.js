const Users = require("../../../database/Models/users.js");
const ms = require("ms");
const timeTraductor = { second: "segundo", seconds: "segundos", minute: "minuto", minutes: "minutos", hour: "hora", hours: "horas", day: "dia", days: "dias", week: "semana", weeks: "semanas", month: "mes", months: "meses", year: "año", years: "años" };

module.exports = {
    name: "tempBan",
    description: "Permite banear temporalmente a un usuario del servidor.",
    usage: "tempBan <USUARIO> <TIEMPO> [RAZÓN]",
    category: "moderation",
    lang: "es",
    requeriments: {
        userPerms: ["BAN_MEMBERS"],
        botPerms: ["BAN_MEMBERS"]
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
            const time = ms(args[1] || 0);
            const reason = args.slice(2).join(" ") || "Mal comportamiento";
            
            if(guildData.premium.actived === true) {
                if(user) {
                    if(user.id !== client.user.id && user.id !== message.author.id) {
                        if(time !== "0ms" && time) {
                            const member = await message.guild.members.fetch(user.id).catch(() => null);
    
                            if(member && !member.size) {
                                if(!member.permissions.has("ADMINISTRATOR")) {
                                    if(message.member.roles.cache.first().position > member.roles.cache.first().position) {
                                        if(message.guild.me.roles.cache.first().position > member.roles.cache.first().position) {
                                            if(member.bannable) {
                                                const banned = await message.guild.bans.fetch(user.id).catch(() => null);
                                                
                                                if(!banned) {
                                                    const msged = await member.send({embeds: [
                                                        {
                                                            author: {
                                                                name: "HAS SIDO BANEADO",
                                                                icon_url: "attachment://log-icon.png"
                                                            },
                                                            color: "#5A9EC9",
                                                            description: "Has sido baneado del servidor **" + message.guild.name + "** por **" + reason + "**.\n\n\u2007<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n\u2007<:arrow_right:964247865943801887> **Tiempo:** " + ms(time, {long: true}).replaceAll(/\b(?:second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\b/gi, i => timeTraductor[i]) + "",
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
                                                    
                                                    const banned = await member.ban({days: 7, reason: reason});
                                                    if(banned) {
                                                        await message.reply({embeds: [
                                                            {
                                                                author: {
                                                                    name: "USUARIO BANEADO",
                                                                    icon_url: "attachment://log-icon.png"
                                                                },
                                                                color: "#5A9EC9",
                                                                description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor por **" + reason + "**.\n\n\u2007<:arrow_right:964247865943801887> **Tiempo:** " + ms(time, {long: true}).replaceAll(/\b(?:second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\b/gi, i => timeTraductor[i]) + "",
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
                                                                    endAt: String(Date.now() + time)
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
                                                                endAt: String(Date.now() + time)
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
                                                                description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor por **" + reason + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Tiempo:** " + ms(time, {long: true}).replaceAll(/\b(?:second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\b/gi, i => timeTraductor[i]) + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
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
                                                } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ya esta baneado.");
                                            } else return await message.reply("`❌` | No puedo banear al " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + ".");
                                        } else return await message.reply("`❌` | No puedo banear a un " + `${user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a mi.");
                                    } else return await message.reply("`❌` | No puedes banear a un " + `${user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a ti.");
                                } else return await message.reply("`❌` | No se puede banear a un administrador del servidor.");
                            } else {
                                const banned = await message.guild.bans.fetch(user.id).catch(() => null);
                                
                                if(!banned) {
                                    await message.reply({embeds: [
                                        {
                                            author: {
                                                name: "USUARIO BANEADO",
                                                icon_url: "attachment://log-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor por **" + reason + "**.\n\n\u2007<:arrow_right:964247865943801887> **Tiempo:** " + ms(time, {long: true}).replaceAll(/\b(?:second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\b/gi, i => timeTraductor[i]) + "",
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
                                                endAt: String(Date.now() + time)
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
                                            endAt: String(Date.now() + time)
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
                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor por **" + reason + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Tiempo:** " + ms(time, {long: true}).replaceAll(/\b(?:second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\b/gi, i => timeTraductor[i]) + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
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
                                } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ya esta baneado.");
                            }
                        } else return await message.reply("`❌` | Debes dar un tiempo de baneo valido.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "tempBan <USUARIO> <TIEMPO> [RAZÓN]`");
                    } else return await message.reply("`❌` | No puedes hacer eso.");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para banearlo.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "tempBan <USUARIO> <TIEMPO> [RAZÓN]`");
            } else {
                if(user) {
                    if(user.id !== client.user.id && user.id !== message.author.id) {
                        if(time !== "0ms" && time) {
                            const member = await message.guild.members.fetch(user.id).catch(() => null);
    
                            if(member && !member.size) {
                                if(!member.permissions.has("ADMINISTRATOR")) {
                                    if(message.member.roles.cache.first().position > member.roles.cache.first().position) {
                                        if(message.guild.me.roles.cache.first().position > member.roles.cache.first().position) {
                                            if(member.bannable) {
                                                const banned = await message.guild.bans.fetch(user.id).catch(() => null);
                                                
                                                if(!banned) {
                                                    const banned = await member.ban({days: 7, reason: reason});
        
                                                    if(banned) {
                                                        await message.reply("`✅` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado por **" + reason + "**\n\n\u2007**Tiempo:** " + ms(time, {long: true}).replaceAll(/\b(?:second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\b/gi, i => timeTraductor[i]) + "");
                                                        
                                                        const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                                                        if(userData) {
                                                            await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                                                ban: {
                                                                    isBanned: true,
                                                                    endAt: String(Date.now() + time)
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
                                                                endAt: String(Date.now() + time)
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
                                                                description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor por **" + reason + "**.\n\n\u2007**Staff:** " + message.author.toString() + "\n\u2007**Tiempo:** " + ms(time, {long: true}).replaceAll(/\b(?:second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\b/gi, i => timeTraductor[i]) + "",
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
                                                } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ya esta baneado.");
                                            } else return await message.reply("`❌` | No puedo banear al " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + ".");
                                        } else return await message.reply("`❌` | No puedo banear a un " + `${user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a mi.");
                                    } else return await message.reply("`❌` | No puedes banear a un " + `${user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a ti.");
                                } else return await message.reply("`❌` | No se puede banear a un administrador del servidor.");
                            } else {
                                const banned = await message.guild.bans.fetch(user.id).catch(() => null);
                                
                                if(!banned) {
                                    await message.reply("`✅` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado por **" + reason + "**\n\n\u2007**Tiempo:** " + ms(time, {long: true}).replaceAll(/\b(?:second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\b/gi, i => timeTraductor[i]) + "");
                                    
                                    const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                                    if(userData) {
                                        await Users.updateOne({guildId: String(message.guild.id), userId: String(user.id)}, {
                                            ban: {
                                                isBanned: true,
                                                endAt: String(Date.now() + time)
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
                                            endAt: String(Date.now() + time)
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
                                            description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido baneado del servidor por **" + reason + "**.\n\n\u2007**Staff:** " + message.author.toString() + "\n\u2007**Tiempo:** " + ms(time, {long: true}).replaceAll(/\b(?:second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\b/gi, i => timeTraductor[i]) + "",
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
                                } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ya esta baneado.");
                            }
                        } else return await message.reply("`❌` | Debes dar un tiempo de baneo valido.\n\n\u2007**Uso:** `" + guildData.prefix + "tempBan <USUARIO> <TIEMPO> [RAZÓN]`");
                    } else return await message.reply("`❌` | No puedes hacer eso.");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para banearlo.\n\n\u2007**Uso:** `" + guildData.prefix + "tempBan <USUARIO> <TIEMPO> [RAZÓN]`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};