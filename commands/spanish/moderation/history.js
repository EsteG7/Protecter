const Users = require("../../../database/Models/users.js");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "history",
    description: "Permite ver el historial de sanciones de un usuario.",
    usage: "history <USUARIO>",
    category: "moderation",
    lang: "es",
    requeriments: {
        userPerms: ["MANAGE_MESSAGES"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);

            if(guildData.premium.actived === true) {
                if(user) {
                    const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                    
                    if(user.id !== message.author.id) {
                        if(userData && userData.infractions.length > 0) {
                            await message.reply({content: "`✅` | Estos son los datos del " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + "", embeds: [
                                {
                                    author: {
                                        name: "LISTA DE SANCIONES",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "Tiene un total de " + `${userData.infractions.length === 1 ? `**1** sanción.` : `**${userData.infractions.length}** sanciones.`}` + "",
                                    fields: [
                                        {
                                            name: "SANCIÓN\u2007\u2007\u2007",
                                            value: userData.infractions.map((i) => "\u2007`" + i.type + "`").join("\n"),
                                            inline: true
                                        },
                                        {
                                            name: "STAFF\u2007\u2007\u2007\u2007\u2007\u2007",
                                            value: userData.infractions.map((i) => "<@" + i.staff + ">").join("\n"),
                                            inline: true
                                        },
                                        {
                                            name: "RAZÓN",
                                            value: userData.infractions.map((i) => "`" + i.reason + "`").join("\n"),
                                            inline: true
                                        }
                                    ],
                                    thumbnail: {
                                        url: user.displayAvatarURL({dynamic: true})
                                    },
                                    footer: {
                                        text: client.user.username + " Premium",
                                        icon_url: client.user.displayAvatarURL()
                                    },
                                    timestamp: new Date()
                                }
                            ], components: [new MessageActionRow()
                                .addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId("filter infractions - " + message.author.id + "")
                                        .setMaxValues(1)
                                        .setPlaceholder("Filtrar Sanciones")
                                        .setOptions([
                                            {
                                                label: "BANEOS",
                                                value: `bans:${user.id}`,
                                                description: "Muestra solo los baneos.",
                                                emoji: "🔨"
                                            },
                                            {
                                                label: "SILENCIOS",
                                                value: `mutes:${user.id}`,
                                                description: "Muestra solo los silencios.",
                                                emoji: "🔇"
                                            },
                                            {
                                                label: "ADVERTENCIAS",
                                                value: `warns:${user.id}`,
                                                description: "Muestra solo las advertencias.",
                                                emoji: "⚠"
                                            }
                                        ])
                                )
                            ], files: ["./images/log-icon.png"]});
                        } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " no tiene sanciones registradas en mi base de datos.");
                    } else if(user.id === message.author.id) {
                        if(userData && userData.infractions.length > 0) {
                            await message.reply({content: "`✅` | Estos son tus datos", embeds: [
                                {
                                    author: {
                                        name: "LISTA DE SANCIONES",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "Tienes un total de " + `${userData.infractions.length === 1 ? `**1** sanción.` : `**${userData.infractions.length}** sanciones.`}` + "",
                                    fields: [
                                        {
                                            name: "SANCIÓN\u2007\u2007\u2007",
                                            value: userData.infractions.map((i) => "\u2007`" + i.type + "`").join("\n"),
                                            inline: true
                                        },
                                        {
                                            name: "STAFF\u2007\u2007\u2007\u2007\u2007\u2007",
                                            value: userData.infractions.map((i) => "<@" + i.staff + ">").join("\n"),
                                            inline: true
                                        },
                                        {
                                            name: "RAZÓN",
                                            value: userData.infractions.map((i) => "`" + i.reason + "`").join("\n"),
                                            inline: true
                                        }
                                    ],
                                    thumbnail: {
                                        url: user.displayAvatarURL({dynamic: true})
                                    },
                                    footer: {
                                        text: client.user.username + " Premium",
                                        icon_url: client.user.displayAvatarURL()
                                    },
                                    timestamp: new Date()
                                }
                            ], components: [new MessageActionRow()
                                .addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId("filter infractions - " + message.author.id + "")
                                        .setMaxValues(1)
                                        .setPlaceholder("Filtrar Sanciones")
                                        .setOptions([
                                            {
                                                label: "BANEOS",
                                                value: `bans:${user.id}`,
                                                description: "Muestra solo los baneos.",
                                                emoji: "🔨"
                                            },
                                            {
                                                label: "SILENCIOS",
                                                value: `mutes:${user.id}`,
                                                description: "Muestra solo los silencios.",
                                                emoji: "🔇"
                                            },
                                            {
                                                label: "ADVERTENCIAS",
                                                value: `warns:${user.id}`,
                                                description: "Muestra solo las advertencias.",
                                                emoji: "⚠"
                                            }
                                        ])
                                )
                            ], files: ["./images/log-icon.png"]});
                        } else return await message.reply("`❌` | No tienes sanciones registradas en mi base de datos.");
                    } else if(user.id === client.user.id) return await message.reply("`❌` | Oye!, yo no tengo sanciones.");
                } else return await message.reply("`❌` | Debes seleccionar a usuario para ver sus registros.\n\n\u2007**Uso:** `" + guildData.prefix + "history <USUARIO>`");
            } else {
                if(user) {
                    const userData = await Users.findOne({guildId: String(message.guild.id), userId: String(user.id)});
                    
                    if(user.id !== message.author.id) {
                        if(userData && userData.infractions.length > 0) {
                            await message.reply({content: "`✅` | Estos son los datos del " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + "", embeds: [
                                {
                                    author: {
                                        name: "LISTA DE SANCIONES",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "Tiene un total de " + `${userData.infractions.length === 1 ? `**1** sanción.` : `**${userData.infractions.length}** sanciones.`}` + "",
                                    fields: [
                                        {
                                            name: "SANCIÓN\u2007\u2007\u2007",
                                            value: userData.infractions.map((i) => "\u2007`" + i.type + "`").join("\n"),
                                            inline: true
                                        },
                                        {
                                            name: "STAFF\u2007\u2007\u2007\u2007\u2007\u2007",
                                            value: userData.infractions.map((i) => "<@" + i.staff + ">").join("\n"),
                                            inline: true
                                        },
                                        {
                                            name: "RAZÓN",
                                            value: userData.infractions.map((i) => "`" + i.reason + "`").join("\n"),
                                            inline: true
                                        }
                                    ],
                                    thumbnail: {
                                        url: user.displayAvatarURL({dynamic: true})
                                    },
                                    footer: {
                                        text: client.user.username,
                                        icon_url: client.user.displayAvatarURL()
                                    },
                                    timestamp: new Date()
                                }
                            ], components: [new MessageActionRow()
                                .addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId("filter infractions - " + message.author.id + "")
                                        .setMaxValues(1)
                                        .setPlaceholder("Filtrar Sanciones")
                                        .setOptions([
                                            {
                                                label: "BANEOS",
                                                value: `bans:${user.id}`,
                                                description: "Muestra solo los baneos.",
                                                emoji: "🔨"
                                            },
                                            {
                                                label: "SILENCIOS",
                                                value: `mutes:${user.id}`,
                                                description: "Muestra solo los silencios.",
                                                emoji: "🔇"
                                            },
                                            {
                                                label: "ADVERTENCIAS",
                                                value: `warns:${user.id}`,
                                                description: "Muestra solo las advertencias.",
                                                emoji: "⚠"
                                            }
                                        ])
                                )
                            ], files: ["./images/log-icon.png"]});
                        } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " no tiene sanciones registradas en mi base de datos.");
                    } else if(user.id === message.author.id) {
                        if(userData && userData.infractions.length > 0) {
                            await message.reply({content: "`✅` | Estos son tus datos", embeds: [
                                {
                                    author: {
                                        name: "LISTA DE SANCIONES",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "Tienes un total de " + `${userData.infractions.length === 1 ? `**1** sanción.` : `**${userData.infractions.length}** sanciones.`}` + "",
                                    fields: [
                                        {
                                            name: "SANCIÓN\u2007\u2007\u2007",
                                            value: userData.infractions.map((i) => "\u2007`" + i.type + "`").join("\n"),
                                            inline: true
                                        },
                                        {
                                            name: "STAFF\u2007\u2007\u2007\u2007\u2007\u2007",
                                            value: userData.infractions.map((i) => "<@" + i.staff + ">").join("\n"),
                                            inline: true
                                        },
                                        {
                                            name: "RAZÓN",
                                            value: userData.infractions.map((i) => "`" + i.reason + "`").join("\n"),
                                            inline: true
                                        }
                                    ],
                                    thumbnail: {
                                        url: user.displayAvatarURL({dynamic: true})
                                    },
                                    footer: {
                                        text: client.user.username,
                                        icon_url: client.user.displayAvatarURL()
                                    },
                                    timestamp: new Date()
                                }
                            ], components: [new MessageActionRow()
                                .addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId("filter infractions - " + message.author.id + "")
                                        .setMaxValues(1)
                                        .setPlaceholder("Filtrar Sanciones")
                                        .setOptions([
                                            {
                                                label: "BANEOS",
                                                value: `bans:${user.id}`,
                                                description: "Muestra solo los baneos.",
                                                emoji: "🔨"
                                            },
                                            {
                                                label: "SILENCIOS",
                                                value: `mutes:${user.id}`,
                                                description: "Muestra solo los silencios.",
                                                emoji: "🔇"
                                            },
                                            {
                                                label: "ADVERTENCIAS",
                                                value: `warns:${user.id}`,
                                                description: "Muestra solo las advertencias.",
                                                emoji: "⚠"
                                            }
                                        ])
                                )
                            ], files: ["./images/log-icon.png"]});
                        } else return await message.reply("`❌` | No tienes sanciones registradas en mi base de datos.");
                    } else if(user.id === client.user.id) return await message.reply("`❌` | Oye!, yo no tengo sanciones.");
                } else return await message.reply("`❌` | Debes seleccionar a usuario para ver sus registros.\n\n\u2007**Uso:** `" + guildData.prefix + "history <USUARIO>`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};