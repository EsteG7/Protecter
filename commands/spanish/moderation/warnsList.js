const Warns = require("../../../database/Models/warns.js");

module.exports = {
    name: "warnsList",
    description: "Permite ver la lista de advertencias de algun usuario.",
    usage: "warnsList <USUARIO>",
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
                    const userData = await Warns.find({guildId: String(message.guild.id), userId: String(user.id)});
    
                    if(user.id !== client.user.id) {
                        if(user.id !== message.author.id) {
                            if(userData?.length > 0) {
                                await message.reply({embeds: [
                                    {
                                        author: {
                                            name: "LISTA DE ADVERTENCIAS",
                                            icon_url: "attachment://log-icon.png"
                                        },
                                        color: "#5A9EC9",
                                        description: "El " + `${user.bot ? "bot" : "usuario"}` + " tiene un total de **" + userData.length + "** " + `${userData.length === 1 ? "advertencia" : "advertencias"}` + ".",
                                        fields: [
                                            {
                                                name: "ID",
                                                value: userData.map((i) => "`#" + i.warnId + "`").join("\n"),
                                                inline: true
                                            },
                                            {
                                                name: "STAFF",
                                                value: userData.map((i) => "<@" + i.staff + ">").join("\n"),
                                                inline: true
                                            },
                                            {
                                                name: "RAZÓN",
                                                value: userData.map((i) => "`" + i.reason + "`").join("\n"),
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
                            } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " no tiene advertencias registradas en mi base de datos.");
                        } else {
                            if(userData?.length > 0) {
                                await message.reply({embeds: [
                                    {
                                        author: {
                                            name: "LISTA DE ADVERTENCIAS",
                                            icon_url: "attachment://log-icon.png"
                                        },
                                        color: "#5A9EC9",
                                        description: "Tienes un total de **" + userData.length + "** " + `${userData.length === 1 ? "advertencia" : "advertencias"}` + ".",
                                        fields: [
                                            {
                                                name: "ID",
                                                value: userData.map((i) => "`#" + i.warnId + "`").join("\n"),
                                                inline: true
                                            },
                                            {
                                                name: "STAFF",
                                                value: userData.map((i) => "<@" + i.staff + ">").join("\n"),
                                                inline: true
                                            },
                                            {
                                                name: "RAZÓN",
                                                value: userData.map((i) => "`" + i.reason + "`").join("\n"),
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
                            } else return await message.reply("`❌` | No tienes advertencias registradas en mi base de datos.");
                        }
                    } else return await message.reply("`❌` | Oye!, yo no tengo advertencias.");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para ver las advertencias.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "warnsList <USUARIO>`");
            } else {
                if(user) {
                    const userData = await Warns.find({guildId: String(message.guild.id), userId: String(user.id)});
    
                    if(user.id !== client.user.id) {
                        if(user.id !== message.author.id) {
                            if(userData?.length > 0) {
                                await message.reply({embeds: [
                                    {
                                        author: {
                                            name: "LISTA DE ADVERTENCIAS",
                                            icon_url: "attachment://log-icon.png"
                                        },
                                        color: "#5A9EC9",
                                        description: "El " + `${user.bot ? "bot" : "usuario"}` + " tiene un total de **" + userData.length + "** " + `${userData.length === 1 ? "advertencia" : "advertencias"}` + ".",
                                        fields: [
                                            {
                                                name: "ID",
                                                value: userData.map((i) => "`#" + i.warnId + "`").join("\n"),
                                                inline: true
                                            },
                                            {
                                                name: "STAFF",
                                                value: userData.map((i) => "<@" + i.staff + ">").join("\n"),
                                                inline: true
                                            },
                                            {
                                                name: "RAZÓN",
                                                value: userData.map((i) => "`" + i.reason + "`").join("\n"),
                                                inline: true
                                            }
                                        ],
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
                            } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " no tiene advertencias registradas en mi base de datos.");
                        } else {
                            if(userData?.length > 0) {
                                await message.reply({embeds: [
                                    {
                                        author: {
                                            name: "LISTA DE ADVERTENCIAS",
                                            icon_url: "attachment://log-icon.png"
                                        },
                                        color: "#5A9EC9",
                                        description: "Tienes un total de **" + userData.length + "** " + `${userData.length === 1 ? "advertencia" : "advertencias"}` + ".",
                                        fields: [
                                            {
                                                name: "ID",
                                                value: userData.map((i) => "`#" + i.warnId + "`").join("\n"),
                                                inline: true
                                            },
                                            {
                                                name: "STAFF",
                                                value: userData.map((i) => "<@" + i.staff + ">").join("\n"),
                                                inline: true
                                            },
                                            {
                                                name: "RAZÓN",
                                                value: userData.map((i) => "`" + i.reason + "`").join("\n"),
                                                inline: true
                                            }
                                        ],
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
                            } else return await message.reply("`❌` | No tienes advertencias registradas en mi base de datos.");
                        }
                    } else return await message.reply("`❌` | Oye!, yo no tengo advertencias.");
                } else return await message.reply("`❌` | Debes seleccionar algun usuario para ver las advertencias.\n\n\u2007**Uso:** `" + guildData.prefix + "warnsList <USUARIO>`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};