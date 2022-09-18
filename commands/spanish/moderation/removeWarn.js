const Warns = require("../../../database/Models/warns.js");

module.exports = {
    name: "removeWarn",
    description: "Permite eliminar una advertencia del usuario seleccionado.",
    usage: "removeWarn <USUARIO> <ID> [RAZÓN]",
    category: "moderation",
    lang: "es",
    requeriments: {
        userPerms: ["MANAGE_MESSAGES"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
            const id = args[0];
            const reason = args.slice(2).join(" ") || "Tiempo terminado";

            if(guildData.premium.actived === true) {
                if(user) {
                    if(id && !isNaN(id) && id % 1 === 0) {
                        const warnData = await Warns.findOne({guildId: String(message.guild.id), userId: String(user.id), warnId: Number(id)});
    
                        if(warnData) {
                            await message.reply({embeds: [
                                {
                                    author: {
                                        name: "ADVERTENCIA ELIMINADA",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "La advertencia **#" + id + "** del " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido removida por **" + reason + "**.",
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
                            await Warns.deleteOne({guildId: String(message.guild.id), userId: String(user.id), warnId: Number(id)});
    
                            const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                            if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                {
                                    author: {
                                        name: "ADVERTENCIA ELIMINADA",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "La advertencia **#" + id + "** del " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido removida.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
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
                        } else return await message.reply("`❌` | No hay ninguna advertencia con esa ID.");
                    } else return await message.reply("`❌` | Debes seleccionar la ID de alguna advertencia.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "removeWarn <USUARIO> <ID> [RAZÓN]`");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para removerle una advertencia.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "removeWarn <USUARIO> <ID> [RAZÓN]`");
            } else {
                if(user) {
                    if(id && !isNaN(id) && id % 1 === 0) {
                        const warnData = await Warns.findOne({guildId: String(message.guild.id), userId: String(user.id), warnId: Number(id)});
    
                        if(warnData) {
                            await message.reply("`✅` | La advertencia **#" + id + "** del " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido removida por **" + reason + "**.");
                            await Warns.deleteOne({guildId: String(message.guild.id), userId: String(user.id), warnId: Number(id)});
    
                            const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                            if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                                {
                                    author: {
                                        name: "ADVERTENCIA ELIMINADA",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "La advertencia **#" + id + "** del " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido removida por **" + reason + "**.\n\n\u2007**Staff:** " + message.author.toString() + "",
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
                        } else return await message.reply("`❌` | No hay ninguna advertencia con esa ID.");
                    } else return await message.reply("`❌` | Debes seleccionar la ID de alguna advertencia.\n\n\u2007**Uso:** `" + guildData.prefix + "removeWarn <USUARIO> <ID>`");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para removerle una advertencia.\n\n\u2007**Uso:** `" + guildData.prefix + "removeWarn <USUARIO> <ID>`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};