const Guilds = require("../../../database/Models/guilds.js");
const langs = {
    "es": "Español",
    "en": "Ingles"
};

module.exports = {
    name: "set-Lang",
    description: "Permite establecer el lenguaje del bot.",
    usage: "setLang",
    category: "configuration",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const newLang = args[0]?.toLowerCase();
            
            if(guildData.premium.actived === true) {
                if(newLang === "es") {
                    await message.reply("`✅` | El lenguaje ha sido establecido a **" + langs[newLang] + "** correctamente.");
                    await Guilds.updateOne({guildId: String(message.guild.id)}, {
                        lang: newLang
                    });
                    
                    const logsChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                    if(logsChannel && !logsChannel.size) return await logsChannel.send({embeds: [
                        {
                            author: {
                                name: "LENGUAJE CAMBIADO",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "El lenguaje del bot ha sido cambiado a **" + langs[newLang] + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
                            thumbnail: {
                                url: "attachment://lang-icon.png"
                            },
                            footer: {
                                text: client.user.username + " Premium",
                                icon_url: client.user.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    ], files: ["./images/log-icon.png", "./images/lang-icon.png"]});
                } else return await message.reply("`❌` | Debes seleccionar algun lenguaje disponible para establecerlo.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "setLang <ES | EN>`");
            } else {
                if(newLang === "es") {
                    await message.reply("`✅` | El lenguaje ha sido establecido a **" + langs[newLang] + "** correctamente.");
                    await Guilds.updateOne({guildId: String(message.guild.id)}, {
                        lang: newLang
                    });
                    
                    const logsChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                    if(logsChannel && !logsChannel.size) return await logsChannel.send({embeds: [
                        {
                            author: {
                                name: "LENGUAJE CAMBIADO",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "El lenguaje del bot ha sido cambiado a **" + langs[newLang] + "**.\n\n\u2007**Staff:** " + message.author.toString() + "",
                            thumbnail: {
                                url: "attachment://lang-icon.png"
                            },
                            footer: {
                                text: client.user.username,
                                icon_url: client.user.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    ], files: ["./images/log-icon.png", "./images/lang-icon.png"]});
                } else return await message.reply("`❌` | Debes seleccionar algun lenguaje disponible para establecerlo.\n\n\u2007**Uso:** `" + guildData.prefix + "setLang <ES>`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};