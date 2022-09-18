const Warns = require("../../../database/Models/warns.js");

module.exports = {
    name: "warnEdit",
    description: "Permite editar la razón de una advertencia.",
    usage: "warnEdit <USUARIO> <ID> [NUEVA-RAZÓN]",
    category: "moderation",
    lang: "es",
    requeriments: {
        userPerms: ["MANAGE_MESSAGES"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
            const reason = args.slice(2).join(" ") || "Mal comportamiento";
            const id = args[0];

            if(guildData.premium.actived === true) {
                if(user) {
                    if(id && !isNaN(id) && id % 1 === 0) {
                        const warnData = await Warns.findOne({guildId: String(message.guild.id), userId: String(user.id), warnId: Number(id)});
    
                        if(warnData) {
                            await message.reply({embeds: [
                                {
                                    author: {
                                        name: "ADVERTENCIA EDITADA",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "La advertencia **#" + id + "** del " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido editada ha **" + reason + "**.",
                                    thumbnail: {
                                        url: "attachment://log-icon.png"
                                    },
                                    footer: {
                                        text: client.user.username + " Premium",
                                        icon_url: client.user.displayAvatarURL()
                                    },
                                    timestamp: new Date()
                                }
                            ], files: ["./images/log-icon.png"]});;

                            await Warns.updateOne({guildId: String(message.guild.id), userId: String(user.id), warnId: Number(id)}, {
                                reason: reason
                            });
    
                            const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                            if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                {
                                    author: {
                                        name: "ADVERTENCIA EDITADA",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "La advertencia **#" + id + "** del " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido editada ha **" + reason + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
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
                        } else return await message.reply("`❌` | No hay ninguna advertencia con esa ID.");
                    } else return await message.reply("`❌` | Debes seleccionar la ID de alguna advertencia.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "warnEdit <USUARIO> <ID> [NUEVA-RAZÓN]`");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para editarle una advertencia.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "warnEdit <USUARIO> <ID> [NUEVA-RAZÓN]`");
            } else {
                if(user) {
                    if(id && !isNaN(id) && id % 1 === 0) {
                        const warnData = await Warns.findOne({guildId: String(message.guild.id), userId: String(user.id), warnId: Number(id)});
    
                        if(warnData) {
                            await message.reply("`✅` | La advertencia **#" + id + "** del " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido editada a **" + reason + "**.");
                            await Warns.updateOne({guildId: String(message.guild.id), userId: String(user.id), warnId: Number(id)}, {
                                reason: reason
                            });
    
                            const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                            if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                {
                                    author: {
                                        name: "ADVERTENCIA EDITADA",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "La advertencia **#" + id + "** del " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido editada ha **" + reason + "**.\n\n\u2007**Staff:** " + message.author.toString() + "",
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
                        } else return await message.reply("`❌` | No hay ninguna advertencia con esa ID.");
                    } else return await message.reply("`❌` | Debes seleccionar la ID de alguna advertencia.\n\n\u2007**Uso:** `" + guildData.prefix + "warnEdit <USUARIO> <ID> [NUEVA-RAZÓN]`");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para editarle una advertencia.\n\n\u2007**Uso:** `" + guildData.prefix + "warnEdit <USUARIO> <ID> [NUEVA-RAZÓN]`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};