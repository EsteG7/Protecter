const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "policys",
    description: "Muestra las politicas de privacidad del bot.",
    usage: "policys",
    category: "utility",
    lang: "es",
    requeriments: {
        userPerms: [],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            await message.reply({embeds: [
                {
                    author: {
                        name: "POLITICAS DE PRIVACIDAD",
                        icon_url: client.user.displayAvatarURL()
                    },
                    color: "#5A9EC9",
                    description: "<:arrow_right:964247865943801887> Fecha de modificación: **14/04/2022 - 12:00pm**",
                    fields: [
                        {
                            name: "RECOLECCIÓN DE DATOS DEL USUARIO:",
                            value: "El bot guarda datos del usuario, como **Su ID**, **Nombre de usuario**, **Servidor donde se guardaron los datos** y **Sanciones en el servidor**.\nEstos datos se utilizan para el uso de los sistemas del bot y no se envian a terceros.\n\u200b"
                        },
                        {
                            name: "USO DE LOS MENSAJES DEL USUARIO",
                            value: "El bot lee los mensajes del usuario enviados en el servidor en cualquier momento, para uso exclusivo de configuración y uso de los sistemas del mismo. No se recopilan, guardan o usan para otro fin."
                        }
                    ],
                    thumbnail: {
                        url: "attachment://privacy-icon.png"
                    },
                    footer: {
                        text: client.user.username,
                        icon_url: client.user.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            ], files: ["./images/privacy-icon.png"]});
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        }
    }
}