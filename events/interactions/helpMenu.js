const Guilds = require("../../database/Models/guilds.js");
const Users = require("../../database/Models/users.js");

module.exports = async (client, inter, lang) => {
    try {
        if(lang === "es") {
            if(inter.customId.split(":")[1] === inter.user.id) {
                if(inter.values[0].split(":")[0] === "discord support") {
                    await inter.update({content: "`✅` | **Servidor De Soporte:** https://discord.gg/fjtMv9TVQw", embeds: [], files: []})
                } else if(inter.values[0].split(":")[0] === "complaints or reports") {
                    await inter.update({content: "`✅` | **Canal De Quejas o Reportes:** https://discord.gg/SdTzwwxtuY", embeds: [], files: []})
                } else if(inter.values[0].split(":")[0] === "about me") {
                    const infractions = await Users.count({$or: [ {"mute.isMuted": true}, {"ban.isBanned": true} ]});

                    await inter.update({content: null, embeds: [
                        {
                            author: {
                                name: "INFORMACIÓN DEL BOT",
                                icon_url: client.user.displayAvatarURL()
                            },
                            color: "#5A9EC9",
                            description: "> `🛡️` ¿Seguridad y Protección? Soy ideal para lo que necesites",
                            fields: [
                                {
                                    name: "INFORMACIÓN",
                                    value: "<:arrow_right:964247865943801887> **Nombre:** " + client.user.tag + "\n<:arrow_right:964247865943801887> **Creado El:** <t:" + Math.floor(client.user.createdTimestamp / 1000) + ":f>\n<:arrow_right:964247865943801887> **Activo:** <t:" + Math.floor(client.readyTimestamp / 1000) + ":R>\n<:arrow_right:964247865943801887> **Version:** " + require("../../package.json").version + "\n<:arrow_right:964247865943801887> **Comandos:** " + client.commands.size + "",
                                    inline: true
                                },
                                {
                                    name: "ESTADISTICAS",
                                    value: "<:arrow_right:964247865943801887> **Servidores:** " + client.guilds.cache.size + "\n<:arrow_right:964247865943801887> **Usuarios:** " + client.users.cache.size + "\n<:arrow_right:964247865943801887> **Sanciones:** " + infractions + "",
                                    inline: true
                                },
                                {
                                    name: "CONFIGURACIÓN",
                                    value: "<:arrow_right:964247865943801887> **Lenguaje:** [JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript)\n<:arrow_right:964247865943801887> **NodeJS:** [v16](https://nodejs.org/en/)\n<:arrow_right:964247865943801887> **Libreria:** [Discord.JS - v13](https://discord.js.org/#/)",
                                    inline: false
                                },
                                {
                                    name: "ENLACES",
                                    value: "<:arrow_right:964247865943801887> **Invitación:** Proximamente\n<:arrow_right:964247865943801887> **Soporte:** Proximamente\n<:arrow_right:964247865943801887> **Pagina Web:** Proximamente...",
                                    inline: true
                                }
                            ],
                            thumbnail: {
                                url: client.user.displayAvatarURL()
                            },
                            footer: {
                                text: client.user.username,
                                icon_url: client.user.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    ]});
                } else if(inter.values[0].split(":")[0] === "configurations") {
                    await inter.update({content: "Proximamente", embeds: [], files: []})
                }
            } else return await inter.reply({content: "`❌` | Este menu no es funcional para ti.", ephemeral: true});
        }
    } catch (error) {
        console.log('[ERROR] '.cyan + `${error.stack}`.red);
    };
}