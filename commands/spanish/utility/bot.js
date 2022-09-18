const Users = require("../../../database/Models/users.js");

module.exports = {
    name: "bot",
    description: "Muestra la información del bot.",
    usage: "bot",
    category: "utility",
    lang: "es",
    requeriments: {
        userPerms: [],
        botPerms: []
    },
    run: async (client, message) => {
        try {
            await message.reply({embeds: [
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
                            value: "<:arrow_right:964247865943801887> **Nombre:** " + client.user.tag + "\n<:arrow_right:964247865943801887> **Creado El:** <t:" + Math.floor(client.user.createdTimestamp / 1000) + ":f>\n<:arrow_right:964247865943801887> **Activo:** <t:" + Math.floor(client.readyTimestamp / 1000) + ":R>\n<:arrow_right:964247865943801887> **Version:** " + require("../../../package.json").version + "\n<:arrow_right:964247865943801887> **Comandos:** " + client.commands.size + "",
                            inline: true
                        },
                        {
                            name: "ESTADISTICAS",
                            value: "<:arrow_right:964247865943801887> **Servidores:** " + client.guilds.cache.size + "\n<:arrow_right:964247865943801887> **Usuarios:** " + client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0) + "\n<:arrow_right:964247865943801887> **Sanciones:** " + await Users.count({$or: [ {"mute.isMuted": true}, {"ban.isBanned": true} ]}) + "",
                            inline: true
                        },
                        {
                            name: "\u200b",
                            value: "\u200b"
                        },
                        {
                            name: "CONFIGURACIÓN",
                            value: "<:arrow_right:964247865943801887> **Lenguaje:** [JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript)\n<:arrow_right:964247865943801887> **NodeJS:** [v16](https://nodejs.org/en/)\n<:arrow_right:964247865943801887> **Libreria:** [Discord.JS - v13](https://discord.js.org/#/)",
                            inline: true
                        },
                        {
                            name: "ENLACES",
                            value: "<:arrow_right:964247865943801887> **Invitación:** [Click Aqui](" + client.generateInvite({scopes: ["bot"], permissions: ["ADMINISTRATOR"]}) + ")\n<:arrow_right:964247865943801887> **Soporte:** [Click Aqui](https://discord.gg/fjtMv9TVQw)\n<:arrow_right:964247865943801887> **Pagina Web:** Proximamente",
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
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};