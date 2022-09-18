const Guilds = require("../../database/Models/guilds.js");
const wait = require("util").promisify(setTimeout);
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = async (client, inter, customId, lang) => {
    if(lang === "es") {
        const guildData = await Guilds.findOne({guildId: String(inter.guild.id)});

        if(guildData?.premium.actived === true) {
            const system = guildData.systems.find((i) => i.name === "antiBots");

            if(customId === "antiBots on" || customId === "antiBots off") {
                const msg = await inter.update({content: "`✅` | El sistema **AntiBots** ha sido " + `${customId === "antiBots on" ? "Activado" : "Desactivado"}` + ".", embeds: [], files: [], components: [], fetchReply: true});

                system.isActived = customId === "antiBots on" ? true : false;
                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                    systems: guildData.systems
                });

                await wait(2200);
                await msg.edit({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA ANTI-BOTS",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Prohibe la entrada a bots no verificados al servidor.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "",
                        thumbnail: {
                            url: "attachment://dbConfig-icon.png"
                        },
                        footer: {
                            text: client.user.username + " Premium",
                            icon_url: client.user.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                ], components: [
                    new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`antiBots on - ${inter.user.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),

                        new MessageButton()
                            .setCustomId(`antiBots off - ${inter.user.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER")
                    )
                ], files: ["./images/dbConfig-icon.png"]});

                const logsChannel = await inter.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                if(logsChannel && !logsChannel.size) return await logsChannel.send({embeds: [
                    {
                        author: {
                            name: "SISTEMA MODIFICADO",
                            icon_url: "attachment://log-icon.png"
                        },
                        color: "#5A9EC9",
                        description: "El sistema **Anti-Bots** ha sido " + `${system.isActived === true ? "Activado" : "Desactivado"}` + ".\n\n\u2007<:arrow_right:964247865943801887> **Staff:** " + inter.user.toString() + "\n\u2007<:arrow_right:964247865943801887> **Canal De Ejecución:** " + inter.message.channel.toString() + "",
                        thumbnail: {
                            url: "attachment://dbConfig-icon.png"
                        },
                        footer: {
                            text: client.user.username + " Premium",
                            icon_url: client.user.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                ], files: ["./images/log-icon.png", "./images/dbConfig-icon.png"]});
            }
        } else {
            const system = guildData.systems.find((i) => i.name === "antiBots");

            if(customId === "antiBots on" || customId === "antiBots off") {
                const msg = await inter.update({content: "`✅` | El sistema **AntiBots** ha sido " + `${customId === "antiBots on" ? "Activado" : "Desactivado"}` + ".", embeds: [], files: [], components: [], fetchReply: true});

                system.isActived = customId === "antiBots on" ? true : false;
                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                    systems: guildData.systems
                });

                await wait(2200);
                await msg.edit({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA ANTI-BOTS",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Prohibe la entrada a bots no verificados al servidor.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "",
                        thumbnail: {
                            url: "attachment://dbConfig-icon.png"
                        },
                        footer: {
                            text: client.user.username,
                            icon_url: client.user.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                ], components: [
                    new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`antiBots on - ${inter.user.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),

                        new MessageButton()
                            .setCustomId(`antiBots off - ${inter.user.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER")
                    )
                ], files: ["./images/dbConfig-icon.png"]});

                const logsChannel = await inter.guild.channels.fetch(guildData.logsChannel).catch(() => null);
                if(logsChannel && !logsChannel.size) return await logsChannel.send({embeds: [
                    {
                        author: {
                            name: "SISTEMA MODIFICADO",
                            icon_url: "attachment://log-icon.png"
                        },
                        color: "#5A9EC9",
                        description: "El sistema **Anti-Bots** ha sido " + `${system.isActived === true ? "Activado" : "Desactivado"}` + ".\n\n\u2007 **Staff:** " + inter.user.toString() + "",
                        thumbnail: {
                            url: "attachment://dbConfig-icon.png"
                        },
                        footer: {
                            text: client.user.username,
                            icon_url: client.user.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                ], files: ["./images/log-icon.png", "./images/dbConfig-icon.png"]});
            }
        }
    }
};