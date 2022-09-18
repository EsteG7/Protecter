module.exports = {
    name: "report",
    description: "Permite crear un reporte para los staffs del servidor.",
    usage: "report <REPORTE>",
    category: "utility",
    lang: "es",
    requeriments: {
        userPerms: [],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const channel = await message.guild.channels.fetch(guildData.reportsChannel).catch(() => null);
            const report = args.slice(0).join(" ");

            if(guildData.premium.actived === true) {
                if(channel && !channel.size) {
                    if(report) {
                        const sended = await channel.send({embeds: [
                            {
                                author: {
                                    name: "REPORTE DE: " + message.author.username + "",
                                    icon_url: "attachment://log-icon.png"
                                },
                                color: "#5A9EC9",
                                description: report,
                                thumbnail: {
                                    url: message.author.displayAvatarURL({dynamic: true})
                                },
                                footer: {
                                    text: client.user.username + " Premium",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        ], files: ["./images/log-icon.png"]}).catch(() => null);
                        
                        if(sended) {
                            return await message.reply("`✅` | Tu reporte ha sido enviado.");
                        } else return await message.reply("`❌` | No fue posible enviar tu reporte.");
                    } else return await message.reply("`❌` | Debes escribir tu reporte.\n\n\u2007**Uso:** `" + guildData.prefix + "report <REPORTE>`");
                } else return await message.reply("`❌` | El servidor no tiene un canal de reportes establecido.");
            } else {
                if(channel && !channel.size) {
                    if(report) {
                        const sended = await channel.send({embeds: [
                            {
                                author: {
                                    name: "REPORTE DE: " + message.author.username + "",
                                    icon_url: "attachment://log-icon.png"
                                },
                                color: "#5A9EC9",
                                description: report,
                                thumbnail: {
                                    url: message.author.displayAvatarURL({dynamic: true})
                                },
                                footer: {
                                    text: client.user.username,
                                    icon_url: client.user.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        ], files: ["./images/log-icon.png"]}).catch(() => null);
                        
                        if(sended) {
                            return await message.reply("`✅` | Tu reporte ha sido enviado.");
                        } else return await message.reply("`❌` | No fue posible enviar tu reporte.");
                    } else return await message.reply("`❌` | Debes escribir tu reporte.\n\n\u2007**Uso:** `" + guildData.prefix + "report <REPORTE>`");
                } else return await message.reply("`❌` | El servidor no tiene un canal de reportes establecido.");
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};