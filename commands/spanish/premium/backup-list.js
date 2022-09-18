const Backups = require("../../../database/Models/backups.js");

module.exports = {
    name: "backup-list",
    description: "Muestra la lista de tus backups hechos.",
    usage: "backup-list",
    category: "premium",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            if(guildData.premium.actived === true) {
                const backups = await Backups.find({userId: String(message.author.id)});

                if(backups.length > 0) {
                    await message.reply({embeds: [
                        {
                            author: {
                                name: "BACKUPS DE; " + message.guild.name,
                                icon_url: message.guild.iconURL({dynamic: true}) ? message.guild.iconURL({dynamic: true}) : "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "<:arrow_right:964247865943801887> **Lista De Backups:**\n```md\n" + backups.map((i, index) => `${index + 1}. ${i.name} (${i.id})`).join("\n") + "\n```",
                            thumbnail: {
                                url: message.guild.iconURL({dynamic: true}) ? message.guild.iconURL({dynamic: true}) : "attachment://log-icon.png"
                            },
                            footer: {
                                text: client.user.username + " Premium",
                                icon_url: client.user.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    ]});
                } else return await message.reply("`❌` | El servidor no tiene backups.");
            } else return await message.reply("`❌` | El servidor necesita ser premium para esta función.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};