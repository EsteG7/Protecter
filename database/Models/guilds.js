const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
    premium: {
        actived: {
            type: Boolean,
            default: false
        },
        endAt: {
            type: String,
            default: null
        }
    },
    guildId: {
        type: String,
        unique: true
    },
    lang: {
        type: String,
        default: "es"
    },
    prefix: {
        type: String,
        default: "p!"
    },
    logsChannel: {
        type: String,
        default: null
    },
    muteRol: {
        type: String,
        default: null
    },
    reportsChannel: {
        type: String,
        default: null
    },
    welcomeChannel: {
        type: String,
        default: null
    },
    firedChannel: {
        type: String,
        default: null
    },
    systems: {
        type: [Object],
        default: [
            {
                name: "antiBots",
                isActived: false,
                description: {
                    es: "Permite activar o desactivar el sistema de bloqueo a la entrada de bots no verificados.",
                    en: "Enable or disable the system to block the entry of unverified bots."
                }
            },
            {
                name: "antiWords",
                isActived: false,
                list: [],
                configsPremium: {
                    notifyUserInChannel: true,
                    notifyUserInMD: true
                },
                description: {
                    es: "Permite bloquear palabras en los mensajes.",
                    en: "Allows blocking words in messages"
                }
            },
            {
                name: "verification",
                isActived: false,
                channel: null,
                roles: {
                    add: [],
                    remove: []
                },
                configsPremium: {
                    captchaInDM: true,
                },
                description: {
                    es: "Implementa un sistema de verificación en el servidor.",
                    en: ""
                }
            },
        ]
    }
});

module.exports = model("guilds", guildSchema);