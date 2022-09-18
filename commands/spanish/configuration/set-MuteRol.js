const Guilds = require("../../../database/Models/guilds.js");

module.exports = {
    name: "set-MuteRol",
    description: "Permite establecer un rol para los silenciados.",
    usage: "setMuteRol",
    category: "configuration",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const rol = message.mentions.roles.first();

            if(guildData.premium.actived === true) {
                if(rol) {
                    await message.reply("`✅` | El rol " + rol.toString() + " ha sido establecido para los **silenciados**.");
                    await Guilds.updateOne({guildId: String(message.guild.id)}, {
                        muteRol: String(rol.id)
                    });

                    const logsChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                    if(logsChannel && !logsChannel.size) return await logsChannel.send({embeds: [
                        {
                            author: {
                                name: "ROL DE SILENCIO ESTABLECIDO",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "El rol " + rol.toString() + " ha sido establecido para los **silenciados**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
                            thumbnail: {
                                url: "attachment://at-icon.png"
                            },
                            footer: {
                                text: client.user.username + " Premium",
                                icon_url: client.user.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    ], files: ["./images/log-icon.png", "./images/at-icon.png"]});
                } else return await message.reply("`❌` | Debes mencionar un rol para establecerlo.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "setMuteRol <@ROL>`");
            } else {
                if(rol) {
                    await message.reply("`✅` | El rol " + rol.toString() + " ha sido establecido para los **silenciados**.");
                    await Guilds.updateOne({guildId: String(message.guild.id)}, {
                        muteRol: String(rol.id)
                    });

                    const logsChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                    if(logsChannel && !logsChannel.size) return await logsChannel.send({embeds: [
                        {
                            author: {
                                name: "ROL DE SILENCIO ESTABLECIDO",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "El rol " + rol.toString() + " ha sido establecido para los **silenciados**.\n\n\u2007**Staff:** " + message.author.toString() + "",
                            thumbnail: {
                                url: "attachment://at-icon.png"
                            },
                            footer: {
                                text: client.user.username,
                                icon_url: client.user.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    ], files: ["./images/log-icon.png", "./images/at-icon.png"]});
                } else return await message.reply("`❌` | Debes mencionar un rol para establecerlo.\n\n\u2007**Uso:** `" + guildData.prefix + "setMuteRol <@ROL>`");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};