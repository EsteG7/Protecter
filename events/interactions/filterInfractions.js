const Users = require("../../database/Models/users.js");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = async (client, inter, lang) => {
    if(lang === "es") {
        if(inter.values[0].split(":")[0] === "bans") {
            const userData = await Users.findOne({guildId: String(inter.guild.id), userId: String(inter.values[0].split(":")[1])});

            if(userData) {
                const user = await client.users.fetch(inter.values[0].split(":")[1]);
                const bans = userData.infractions.filter((i) => i.type === "BAN");

                if(bans.length > 0) {
                    await inter.update({embeds: [
                        {
                            author: {
                                name: "LISTA DE BANEOS",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "Tiene un total de " + `${bans.length === 1 ? `**1** baneo.` : `**${bans.length}** baneos.`}` + "",
                            fields: [
                                {
                                    name: "NUMERO\u2007\u2007\u2007",
                                    value: bans.map((i, index) => "\u2007`#" + (index + 1) + "`").join("\n"),
                                    inline: true
                                },
                                {
                                    name: "STAFF\u2007\u2007\u2007\u2007\u2007\u2007",
                                    value: bans.map((i) => "<@" + i.staff + ">").join("\n"),
                                    inline: true
                                },
                                {
                                    name: "RAZÓN",
                                    value: bans.map((i) => "`" + i.reason + "`").join("\n"),
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
                                .setCustomId("filter infractions - " + inter.user.id + "")
                                .setMaxValues(1)
                                .setPlaceholder("Filtrar Sanciones")
                                .setOptions([
                                    {
                                        label: "REGRESAR",
                                        value: `back:${user.id}`,
                                        description: "Regresa a la lista completa.",
                                        emoji: "⏪"
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
                } else return await inter.reply({content: "`❌` | El usuario no tiene registros de baneos.", ephemeral: true});
            } else return await inter.reply({content: "`❌` | No fue posible obtener los datos del usuario.", ephemeral: true});
        } else if(inter.values[0].split(":")[0] === "mutes") {
            const userData = await Users.findOne({guildId: String(inter.guild.id), userId: String(inter.values[0].split(":")[1])});

            if(userData) {
                const user = await client.users.fetch(inter.values[0].split(":")[1]);
                const mutes = userData.infractions.filter((i) => i.type === "MUTE");

                if(mutes.length > 0) {
                    await inter.update({embeds: [
                        {
                            author: {
                                name: "LISTA DE SILENCIOS",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "Tiene un total de " + `${mutes.length === 1 ? `**1** silencio.` : `**${mutes.length}** silencios.`}` + "",
                            fields: [
                                {
                                    name: "NUMERO\u2007\u2007\u2007",
                                    value: mutes.map((i, index) => "\u2007`#" + (index + 1) + "`").join("\n"),
                                    inline: true
                                },
                                {
                                    name: "STAFF\u2007\u2007\u2007\u2007\u2007\u2007",
                                    value: mutes.map((i) => "<@" + i.staff + ">").join("\n"),
                                    inline: true
                                },
                                {
                                    name: "RAZÓN",
                                    value: mutes.map((i) => "`" + i.reason + "`").join("\n"),
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
                                .setCustomId("filter infractions - " + inter.user.id + "")
                                .setMaxValues(1)
                                .setPlaceholder("Filtrar Sanciones")
                                .setOptions([
                                    {
                                        label: "REGRESAR",
                                        value: `back:${user.id}`,
                                        description: "Regresa a la lista completa.",
                                        emoji: "⏪"
                                    },
                                    {
                                        label: "BANEOS",
                                        value: `bans:${user.id}`,
                                        description: "Muestra solo los baneos.",
                                        emoji: "🔨"
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
                } else return await inter.reply({content: "`❌` | El usuario no tiene registros de silencios.", ephemeral: true});
            } else return await inter.reply({content: "`❌` | No fue posible obtener los datos del usuario.", ephemeral: true});
        } if(inter.values[0].split(":")[0] === "warns") {
            const userData = await Users.findOne({guildId: String(inter.guild.id), userId: String(inter.values[0].split(":")[1])});

            if(userData) {
                const user = await client.users.fetch(inter.values[0].split(":")[1]);
                const warns = userData.infractions.filter((i) => i.type === "WARN");

                if(warns.length > 0) {
                    await inter.update({embeds: [
                        {
                            author: {
                                name: "LISTA DE ADVERTENCIAS",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "Tiene un total de " + `${warns.length === 1 ? `**1** advertencia.` : `**${warns.length}** advertencias.`}` + "",
                            fields: [
                                {
                                    name: "NUMERO\u2007\u2007\u2007",
                                    value: warns.map((i, index) => "\u2007`#" + (index + 1) + "`").join("\n"),
                                    inline: true
                                },
                                {
                                    name: "STAFF\u2007\u2007\u2007\u2007\u2007\u2007",
                                    value: warns.map((i) => "<@" + i.staff + ">").join("\n"),
                                    inline: true
                                },
                                {
                                    name: "RAZÓN",
                                    value: warns.map((i) => "`" + i.reason + "`").join("\n"),
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
                                .setCustomId("filter infractions - " + inter.user.id + "")
                                .setMaxValues(1)
                                .setPlaceholder("Filtrar Sanciones")
                                .setOptions([
                                    {
                                        label: "REGRESAR",
                                        value: `back:${user.id}`,
                                        description: "Regresa a la lista completa.",
                                        emoji: "⏪"
                                    },
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
                                    }
                                ])
                        )
                    ], files: ["./images/log-icon.png"]});
                } else return await inter.reply({content: "`❌` | El usuario no tiene registros de advertencias.", ephemeral: true});
            } else return await inter.reply({content: "`❌` | No fue posible obtener los datos del usuario.", ephemeral: true});
        } else if(inter.values[0].split(":")[0] === "back") {
            const userData = await Users.findOne({guildId: String(inter.guild.id), userId: String(inter.values[0].split(":")[1])});
            const user = await client.users.fetch(inter.values[0].split(":")[1]);

            if(userData) {
                await inter.update({embeds: [
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
                            .setCustomId("filter infractions - " + inter.user.id + "")
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
            } else return await inter.reply({content: "`❌` | No fue posible obtener los datos del usuario.", ephemeral: true});
        }
    }
};