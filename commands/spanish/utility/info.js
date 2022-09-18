const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "info",
    description: "Muestra información del bot.",
    usage: "info",
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
                        name: "INFORMACIÓN",
                        icon_url: client.user.displayAvatarURL()
                    },
                    color: "#5A9EC9",
                    description: "<:arrow_right:964247865943801887> ¡Anunciamos la **REAPERTURA** de Protecter el **Sábado 16**!\n\nSe lanzará la **Fase BETA** de Protecter con más de 30 Comandos funcionales y 3 Sistemas funcionales.\nAnunciamos que es la FASE BETA del bot, rogamos que cualquier fallo, error o bug nos lo comuniquen de inmediato. Agradeceríamos su opinión y valoración entrando en el servidor de soporte de Protecter.\n\n\u2007<:arrow_right:964247865943801887> **Servidor:** https://discord.gg/fjtMv9TVQw",
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