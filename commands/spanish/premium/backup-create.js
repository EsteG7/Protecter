const Backups = require("../../../database/Models/backups.js");
const backup = require("discord-backup");
const listWords = "abcdefghijqlmnñopqrstuvwxyz0123456789@#?+ABCDEFGHIJKLMNÑOPQRSTUVWYZ";

module.exports = {
    name: "backup-create",
    description: "Crea un backup del servidor.",
    usage: "backup-create",
    category: "premium",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            if(guildData.premium.actived === true) {
                const msg = await message.reply("`⌛` | Creando backup del servidor... (Porfavor espera)");
                const json = await backup.create(message.guild, {
                    maxMessagesPerChannel: 0,
                    jsonSave: false,
                    jsonBeautify: true,
                    doNotBackup: [],
                    saveImages: "base64"
                });
                const code = await GenCoder();

                await Backups.create({
                    guildId: String(json.guildID),
                    userId: String(message.author.id),
                    id: String(code),
                    name: String(json.name),
                    verificationLevel: String(json.verificationLevel),
                    explicitContentFilter: String(json.explicitContentFilter),
                    defaultMessageNotifications: String(json.defaultMessageNotifications),
                    widget: {
                        enabled: json.widget.enabled,
                        channel: json.widget.channel
                    },
                    channels: {
                        categories: json.channels.categories,
                        others: json.channels.others
                    },
                    roles: json.roles,
                    bans: json.bans,
                    emojis: json.emojis,
                    createdTimestamp: Number(json.createdTimestamp),
                    iconBase64: String(json.iconBase64),
                    iconURL: String(json.iconURL)
                });
                await msg.edit("`✅` | El backup ha sido creado. (**ID:** " + code + ")");
            } else return await message.reply("`❌` | El servidor necesita ser premium para esta función.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};

const GenCoder = async () => {
    let code = "";
    const coderString = listWords.split("");

    for(let i = 0; i <= 6; i++) {
        code += coderString[Math.floor(Math.random() * coderString.length)];
    }
    
    if(await Backups.exists({userId: String(message.author.id), id: code})) {
        return GenCoder();
    } else return code;
};