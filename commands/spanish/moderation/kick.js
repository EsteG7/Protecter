const Users = require("../../../database/Models/users.js");

module.exports = {
    name: "kick",
    description: "Permite expulsar a un miembro del servidor.",
    usage: "kick <USUARIO> [RAZÓN]",
    category: "moderation",
    lang: "es",
    requeriments: {
        userPerms: ["KICK_MEMBERS"],
        botPerms: ["KICK_MEMBERS"]
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
            const reason = args.slice(1).join(" ") || "Mal comportamiento";
            
            if(guildData.premium.actived === true) {
                if(member && !member.size) {
                    if(member.user.id !== client.user.id && member.user.id !== message.author.id) {
                        if(!member.permissions.has("ADMINISTRATOR")) {
                            if(message.member.roles.cache.first().position > member.roles.cache.first().position) {
                                if(message.guild.me.roles.cache.first().position > member.roles.cache.first().position) {
                                    if(member.kickable) {
                                        const msged = await message.reply({embeds: [
                                            {
                                                author: {
                                                    name: "HAS SIDO EXPULSADO",
                                                    icon_url: "attachment://log-icon.png"
                                                },
                                                color: "#5A9EC9",
                                                description: "Has sido expulsado del servidor **" + message.guild.name + "** por **" + reason + "**.\n\n\u2007<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "",
                                                thumbnail: {
                                                    url: "attachment://hammer-icon.png"
                                                },
                                                footer: {
                                                    text: client.user.username + " Premium",
                                                    icon_url: client.user.displayAvatarURL()
                                                },
                                                timestamp: new Date()
                                            }
                                        ], files: ["./images/log-icon.png", "./images/hammer-icon.png"]}).catch(() => null);
                                        
                                        const kicked = await member.kick(reason);
                                        if(kicked) {
                                            await message.reply({embeds: [
                                                {
                                                    author: {
                                                        name: "USUARIO EXPULSADO",
                                                        icon_url: "attachment://log-icon.png"
                                                    },
                                                    color: "#5A9EC9",
                                                    description: "El " + `${user.bot ? "bot" : "usuario"}` + " ha sido expulsado del servidor por **" + reason + "**.",
                                                    thumbnail: {
                                                        url: "attachment://hammer-icon.png"
                                                    },
                                                    footer: {
                                                        text: client.user.username + " Premium",
                                                        icon_url: client.user.displayAvatarURL()
                                                    },
                                                    timestamp: new Date()
                                                }
                                            ], files: ["./images/log-icon.png", "./images/hammer-icon.png"]});

                                            const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(member.user.id)});
                                            if(userData) {
                                                await Users.updateOne({guildId: String(message.guild.id), userId: String(member.user.id)}, {
                                                    $push: {
                                                        infractions: {
                                                            type: "KICK",
                                                            staff: String(message.author.id),
                                                            reason: reason,
                                                        }
                                                    }
                                                });
                                            } else await Users.create({
                                                guildId: String(message.guild.id),
                                                userId: String(member.user.id),
                                                infractions: [
                                                    {
                                                        type: "KICK",
                                                        staff: String(message.author.id),
                                                        reason: reason
                                                    }
                                                ]
                                            });
        
                                            const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                            if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                                {
                                                    author: {
                                                        name: "USUARIO EXPULSADO",
                                                        icon_url: "attachment://log-icon.png"
                                                    },
                                                    color: "#5A9EC9",
                                                    description: "El " + `${member.user.bot ? "bot" : "usuario"}` + " " + member.user.toString() + " ha sido expulsado del servidor por **" + reason + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
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
                                        } else return await message.reply("`❌` | No fue posible expulsar al " + `${member.user.bot ? "bot" : "usuario"}` + " " + member.user.toString() + ".");
                                    } else return await message.reply("`❌` | No puedo expulsar al " + `${member.user.bot ? "bot" : "usuario"}` + " " + member.user.toString() + ".");
                                } else return await message.reply("`❌` | No puedo expulsar a un " + `${member.user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a mi.");
                            } else return await message.reply("`❌` | No puedes expulsar a un " + `${member.user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a ti.");
                        } else return await message.reply("`❌` | No se puede expulsar a un administrador del servidor.");
                    } else return await message.reply("`❌` | No puedes hacer eso.");
                } else return await message.reply("`❌` | Debes seleccionar algun miembro del servidor para expulsarlo.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "kick <USUARIO> [RAZÓN]`");
            } else {
                if(member && !member.size) {
                    if(member.user.id !== client.user.id && member.user.id !== message.author.id) {
                        if(!member.permissions.has("ADMINISTRATOR")) {
                            if(message.member.roles.cache.first().position > member.roles.cache.first().position) {
                                if(message.guild.me.roles.cache.first().position > member.roles.cache.first().position) {
                                    if(member.kickable) {
                                        const kicked = await member.kick(reason);
                                
                                        if(kicked) {
                                            await message.reply({content: "`✅` | El " + `${member.user.bot ? "bot" : "usuario"}` + " " + member.user.toString() + " ha sido expulsado del servidor por **" + reason + "**."});
                                            
                                            const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(member.user.id)});
                                            if(userData) {
                                                await Users.updateOne({guildId: String(message.guild.id), userId: String(member.user.id)}, {
                                                    $push: {
                                                        infractions: {
                                                            type: "KICK",
                                                            staff: String(message.author.id),
                                                            reason: reason,
                                                        }
                                                    }
                                                });
                                            } else await Users.create({
                                                guildId: String(message.guild.id),
                                                userId: String(member.user.id),
                                                infractions: [
                                                    {
                                                        type: "KICK",
                                                        staff: String(message.author.id),
                                                        reason: reason
                                                    }
                                                ]
                                            });
        
                                            const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                            if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                                {
                                                    author: {
                                                        name: "EXPULSIÓN REALIZADO",
                                                        icon_url: "attachment://log-icon.png"
                                                    },
                                                    color: "#5A9EC9",
                                                    description: "El " + `${member.user.bot ? "bot" : "usuario"}` + " " + member.user.toString() + " ha sido expulsado del servidor por **" + reason + "**.\n\n\u2007**Staff:** " + message.author.toString() + "",
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
                                        } else return await message.reply("`❌` | No fue posible expulsar al " + `${member.user.bot ? "bot" : "usuario"}` + " " + member.user.toString() + ".");
                                    } else return await message.reply("`❌` | No puedo expulsar al " + `${member.user.bot ? "bot" : "usuario"}` + " " + member.user.toString() + ".");
                                } else return await message.reply("`❌` | No puedo expulsar a un " + `${member.user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a mi.");
                            } else return await message.reply("`❌` | No puedes expulsar a un " + `${member.user.bot ? "bot" : "usuario"}` + " con roles iguales o superiores a ti.");
                        } else return await message.reply("`❌` | No se puede expulsar a un administrador del servidor.");
                    } else return await message.reply("`❌` | No puedes hacer eso.");
                } else return await message.reply("`❌` | Debes seleccionar algun miembro del servidor para expulsarlo.\n\n\u2007**Uso:** `" + guildData.prefix + "kick <USUARIO> [RAZÓN]`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};