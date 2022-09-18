module.exports = {
    name: "unBanAll",
    description: "Permite quitarle el baneo a todos los baneado del servidor.",
    usage: "unBanAll [RAZÓN]",
    category: "moderation",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: ["BAN_MEMBERS"]
    },
    run: async (client, message, args, command, guildData) => {
        try {
            let usersUnBanned = 0;
            const reason = args.slice(0).join(" ") || "Limpieza necesaria";
            const msg = await message.reply("`⌛` | Obteniendo todos los baneos del servidor...");
            const members = await message.guild.bans.fetch();

            if(guildData.premium.actived === true) {
                await msg.edit("`⌛` | Desbaneando **" + members.size + "** usuarios...");
                await Promise.all(members.forEach(async (i) => {
                    const unBanned = await message.guild.bans.remove(i.user.id, reason).catch(() => null);
                    if(unBanned) usersUnBanned++;
                }));

                await msg.edit({embeds: [
                    {
                        author: {
                            name: "USUARIOS DESBANEADOS",
                            icon_url: "attachment://log-icon.png"
                        },
                        color: "#5A9EC9",
                        description: "Se han desbaneado **" + usersUnBanned + "** usuarios de **" + members.size + "** por **" + reason + "**.",
                        thumbnail: {
                            url: "attachment://log-icon.png"
                        },
                        footer: {
                            text: client.user.username + " Premium",
                            icon_url: client.user.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                ], files: ["./images/log-icon.png"]});
    
                const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                    {
                        author: {
                            name: "USUARIOS DESBANEADOS",
                            icon_url: "attachment://log-icon.png"
                        },
                        color: "#5A9EC9",
                        description: "Se han desbaneado **" + usersUnBanned + "** usuarios de **" + members.size + "** por **" + reason + "**.\n\n<:arrow_right:964247865943801887> **Staff:** " + message.author.toString() + "\n<:arrow_right:964247865943801887> **Canal De Ejecución:** " + message.channel.toString() + "",
                        thumbnail: {
                            url: "attachment://log-icon.png"
                        },
                        footer: {
                            text: client.user.username + " Premium",
                            icon_url: client.user.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                ], files: ["./images/log-icon.png"]});
            } else {
                await msg.edit("`⌛` | Desbaneando **" + members.size + "** usuarios...");
                await Promise.all(members.forEach(async (i) => {
                    const unBanned = await message.guild.bans.remove(i.user.id, reason).catch(() => null);
                    if(unBanned) usersUnBanned++;
                }));
                await msg.edit("`✅` | Se han desbaneado **" + usersUnBanned + "** usuarios de **" + members.size + "** por **" + reason + "**.");
    
                const logChannel = await message.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                if(logChannel && !logChannel.size) return await logChannel.send({embeds: [
                    {
                        author: {
                            name: "BANEOS ELIMINADOS",
                            icon_url: "attachment://log-icon.png"
                        },
                        color: "#5A9EC9",
                        description: "Se han desbaneado **" + usersUnBanned + "** usuarios de **" + members.size + "** por **" + reason + "**.\n\n\u2007**Staff:** " + message.author.toString() + "",
                        thumbnail: {
                            url: "attachment://log-icon.png"
                        },
                        footer: {
                            text: client.user.username,
                            icon_url: client.user.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                ], files: ["./images/log-icon.png"]});
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};