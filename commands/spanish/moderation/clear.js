const wait = require("util").promisify(setTimeout);

module.exports = {
    name: "clear",
    description: "Permite eliminar una cantidad de mensajes en el canal seleccionado.",
    usage: "clear <1 - 100> [CANAL]",
    category: "moderation",
    lang: "es",
    requeriments: {
        userPerms: ["MANAGE_MESSAGES"],
        botPerms: ["MANAGE_MESSAGES"]
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const count = args[0];
            const channel = message.mentions.channels.first() || await message.guild.channels.fetch(args[1]).catch(() => null);

            if(guildData.premium.actived === true) {
                if(count && !isNaN(count) && count % 1 === 0) {
                    if(count > 0 && count <= 100) {
                        if(channel && !channel.size) {
                            if(channel.permissionsFor(client.user.id).has(["MANAGE_MESSAGES", "VIEW_CHANNEL", "SEND_MESSAGES"])) {
                                await channel.bulkDelete(count);
                                await wait(600);
                                await message.reply({embeds: [
                                    {
                                        author: {
                                            name: "LIMPIEZA REALIZADA",
                                            icon_url: "attachment://log-icon.png"
                                        },
                                        color: "#5A9EC9",
                                        description: "Se " + `${Number(count) === 1 ? "ha eliminado **" + count + "** mensaje" : "han eliminado **" + count + "** mensajes"}` + " en el canal " + channel.toString() + ".",
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
                            
                                const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                if(logChannel && !logChannel.size) await logChannel.send({embeds: [
                                    {
                                        author: {
                                            name: "LIMPIEZA DE CANAL REALIZADA",
                                            icon_url: "attachment://log-icon.png"
                                        },
                                        color: "#5A9EC9",
                                        description: "Se " + `${Number(count) === 1 ? "ha eliminado **" + count + "** mensaje" : "han eliminado **" + count + "** mensajes"}` + " en el canal " + channel.toString() + ".\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
                                        thumbnail: {
                                            url: "attachment://trashCan-icon.png"
                                        },
                                        footer: {
                                            text: client.user.username + " Premium",
                                            icon_url: client.user.displayAvatarURL()
                                        },
                                        timestamp: new Date()
                                    }
                                ], files: ["./images/log-icon.png", "./images/trashCan-icon.png"]});
                            } else return await message.reply("`❌` | No tengo los permisos suficientes para eliminar mensajes en el canal " + channel.toString() + ".");
                        } else {
                            await message.channel.bulkDelete(count);
                            await wait(600);
                            await message.channel.send({embeds: [
                                {
                                    author: {
                                        name: "LIMPIEZA REALIZADA",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "Se " + `${Number(count) === 1 ? "ha eliminado **" + count + "** mensaje" : "han eliminado **" + count + "** mensajes"}` + " en este canal.\n\n\u2007<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "",
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
                            
                            const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                            if(logChannel && !logChannel.size) await logChannel.send({embeds: [
                                {
                                    author: {
                                        name: "LIMPIEZA DE CANAL REALIZADA",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "Se " + `${Number(count) === 1 ? "ha eliminado **" + count + "** mensaje" : "han eliminado **" + count + "** mensajes"}` + " en el canal " + message.channel.toString() + ".\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "",
                                    thumbnail: {
                                        url: "attachment://trashCan-icon.png"
                                    },
                                    footer: {
                                        text: client.user.username + " Premium",
                                        icon_url: client.user.displayAvatarURL()
                                    },
                                    timestamp: new Date()
                                }
                            ], files: ["./images/log-icon.png", "./images/trashCan-icon.png"]});
                        }
                    } else return await message.reply("`❌` | Debes seleccionar una cantidad mayor a 0 y menor a 100.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "clear <1 - 100> [CANAL]`");
                } else return await message.reply("`❌` | Debes seleccionar una cantidad no decimal.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "clear <1 - 100> [CANAL]`");
            } else {
                if(count && !isNaN(count) && count % 1 === 0) {
                    if(count > 0 && count <= 100) {
                        if(channel && !channel.size) {
                            if(channel.permissionsFor(client.user.id).has(["MANAGE_MESSAGES", "VIEW_CHANNEL", "SEND_MESSAGES"])) {
                                await channel.bulkDelete(count);
                                await wait(600);
                                await message.reply("`✅` | Se " + `${Number(count) === 1 ? "ha eliminado **" + count + "** mensaje" : "han eliminado **" + count + "** mensajes"}` + " en el canal " + channel.toString() + ".");
                            
                                const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                                if(logChannel && !logChannel.size) await logChannel.send({embeds: [
                                    {
                                        author: {
                                            name: "MENSAJES EN MASA ELIMINADOS",
                                            icon_url: "attachment://log-icon.png"
                                        },
                                        color: "#5A9EC9",
                                        description: "Se " + `${Number(count) === 1 ? "ha eliminado **" + count + "** mensaje" : "han eliminado **" + count + "** mensajes"}` + " en el canal " + channel.toString() + ".\n\n\u2007**Staff:** " + message.author.toString() + "",
                                        thumbnail: {
                                            url: "attachment://trashCan-icon.png"
                                        },
                                        footer: {
                                            text: client.user.username,
                                            icon_url: client.user.displayAvatarURL()
                                        },
                                        timestamp: new Date()
                                    }
                                ], files: ["./images/log-icon.png", "./images/trashCan-icon.png"]});
                            } else return await message.reply("`❌` | No tengo los permisos suficientes para eliminar mensajes en el canal " + channel.toString() + ".");
                        } else {
                            await message.channel.bulkDelete(count);
                            await wait(600);
                            await message.channel.send("`✅` | Se " + `${Number(count) === 1 ? "ha eliminado **" + count + "** mensaje" : "han eliminado **" + count + "** mensajes"}` + ".");
                            
                            const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                            if(logChannel && !logChannel.size) await logChannel.send({embeds: [
                                {
                                    author: {
                                        name: "MENSAJES EN MASA ELIMINADOS",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "Se " + `${Number(count) === 1 ? "ha eliminado **" + count + "** mensaje" : "han eliminado **" + count + "** mensajes"}` + " en el canal " + message.channel.toString() + ".\n\n\u2007**Staff:** " + message.author.toString() + "",
                                    thumbnail: {
                                        url: "attachment://trashCan-icon.png"
                                    },
                                    footer: {
                                        text: client.user.username,
                                        icon_url: client.user.displayAvatarURL()
                                    },
                                    timestamp: new Date()
                                }
                            ], files: ["./images/log-icon.png", "./images/trashCan-icon.png"]});
                        }
                    } else return await message.reply("`❌` | Debes seleccionar una cantidad mayor a 0 y menor a 100.\n\n\u2007**Uso:** `" + guildData.prefix + "clear <1 - 100> [CANAL]`");
                } else return await message.reply("`❌` | Debes seleccionar una cantidad no decimal.\n\n\u2007**Uso:** `" + guildData.prefix + "clear <1 - 100> [CANAL]`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};