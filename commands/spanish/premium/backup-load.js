const Backups = require("../../../database/Models/backups.js");
const backup = require("discord-backup");
const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    name: "backup-load",
    description: "Carga un backup del servidor.",
    usage: "backup-load <backup-id>",
    category: "premium",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            if(guildData.premium.actived === true) {
                const id = args[0];

                if(id) {
                    const backupData = await Backups.findOne({userId: String(message.author.id), id: String(id)});

                    if(backupData) {
                        const msg = await message.reply({content: "`⌛` | ¿Estas seguro de hacer el backup?", embeds: [
                            {
                                author: {
                                    name: "BACKUP DE; " + backupData.name,
                                    icon_url: backupData.iconURL
                                },
                                color: "#5A9EC9",
                                description: "<:arrow_right:964247865943801887> **ID:** " + backupData.id + "\n<:arrow_right:964247865943801887> **Categorias:** " + backupData.channels.categories.length + "\n<:arrow_right:964247865943801887> **Canales:** " + backupData.channels.others.length + "\n<:arrow_right:964247865943801887> **Roles:** " + backupData.roles.length + "\n<:arrow_right:964247865943801887> **Baneos:** " + backupData.bans.length + "\n<:arrow_right:964247865943801887> **Emojis:** " + backupData.emojis.length + "",
                                thumbnail: {
                                    url: backupData.iconURL
                                },
                                footer: {
                                    text: client.user.username + " Premium",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        ], components: [
                            new MessageActionRow()
                                .setComponents(
                                    new MessageButton()
                                        .setCustomId("load")
                                        .setDisabled(false)
                                        .setEmoji("✅")
                                        .setLabel("CARGAR")
                                        .setStyle("SUCCESS"),

                                    new MessageButton()
                                        .setCustomId("cancel")
                                        .setDisabled(false)
                                        .setEmoji("❌")
                                        .setLabel("CANCELAR")
                                        .setStyle("DANGER")
                                )
                        ]});

                        const collector = msg.createMessageComponentCollector({componentType: "BUTTON", time: 30000});
                        collector.on("collect", async (inter) => {
                            if(inter.user.id === message.author.id) {
                                if(inter.message.id === msg.id) {
                                    if(inter.customId === "load") {
                                        collector.stop();
                                        await backup.load(backupData, message.guild, {
                                            clearGuildBeforeRestore: true
                                        });
                                    } else if(inter.customId === "cancel") {
                                        collector.stop();
                                        await inter.update({content: "`❌` | Menu cancelado.", embeds: [], components: [], files: []})
                                    }
                                }
                            } else return await inter.reply({content: "`❌` | Este menu solo lo puede utilizar " + message.author.toString() + ".", ephemeral: true});
                        });

                        collector.on("end", async (collected, reason) => {
                            if(reason === "time") return await msg.edit({content: "" + msg.content + " `(Tiempo de espera agotado)`", components: [
                                new MessageActionRow()
                                .setComponents(
                                    new MessageButton()
                                        .setCustomId("load")
                                        .setDisabled(true)
                                        .setEmoji("✅")
                                        .setLabel("CARGAR")
                                        .setStyle("SUCCESS"),

                                    new MessageButton()
                                        .setCustomId("cancel")
                                        .setDisabled(true)
                                        .setEmoji("❌")
                                        .setLabel("CANCELAR")
                                        .setStyle("DANGER")
                                )
                            ]})
                        });
                    } else return await message.reply("`❌` | No se encontraron los datos del backup.");
                } else return await message.reply("`❌` | Debes seleccionar la ID de tu backup.");
            } else return await message.reply("`❌` | El servidor necesita ser premium para esta función.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};