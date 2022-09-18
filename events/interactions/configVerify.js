const Guilds = require("../../database/Models/guilds.js");
const { MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const wait = require("util").promisify(setTimeout);

module.exports = async (client, inter, customId, lang) => {
    if(lang === "es") {
        const guildData = await Guilds.findOne({guildId: String(inter.guild.id)});

        if(guildData?.premium.actived === true) {
            const system = guildData.systems.find((i) => i.name === "verification");

            if(customId === "verify on" || customId === "verify off") {
                const msg = await inter.update({content: "`✅` | El sistema de **Verificación** ha sido " + `${customId === "verify on" ? "Activado" : "Desactivado"}` + ".", embeds: [], files: [], components: [], fetchReply: true});

                system.isActived = customId === "verify on" ? true : false;
                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                    systems: guildData.systems
                });

                await wait(2200);
                await msg.edit({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA DE VERIFICACIÓN",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Implementa un sistema de verificación en el servidor.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Estado Del Captcha:** " + `${system.configsPremium.captchaInDM === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                            .setCustomId(`verify on - ${inter.user.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),
            
                        new MessageButton()
                            .setCustomId(`verify off - ${inter.user.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER"),
            
                        new MessageButton()
                            .setCustomId(`verify configsList - ${inter.user.id}`)
                            .setEmoji("⚙")
                            .setLabel("CONFIGURACIONES")
                            .setDisabled(false)
                            .setStyle("SECONDARY")
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            } else if(customId === "verify configsList") {
                await inter.update({components: [
                    new MessageActionRow()
                    .setComponents(
                        new MessageSelectMenu()
                            .setCustomId("verify configs - " + inter.user.id + "")
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Lista de configuraciones")
                            .setOptions([
                                {
                                    label: "Regresar",
                                    value: "back",
                                    emoji: "⏪"
                                },
                                {
                                    label: "Establecer Canal",
                                    value: "set channel",
                                    description: "Establece un canal para el sistema de verificación",
                                    emoji: "#️⃣"
                                },
                                {
                                    label: "Togglear Captcha Por DM",
                                    value: "toggle captcha",
                                    description: "Activa o Desactiva el captcha requerido por mensaje privado",
                                    emoji: "💎"
                                },
                                {
                                    label: "Establecer Roles Para Otorgar",
                                    value: "add roles",
                                    description: "Establece roles para otorgar al completar la verificación",
                                    emoji: "🟢"
                                },
                                {
                                    label: "Establecer Roles Para Remover",
                                    value: "remove roles",
                                    description: "Establece roles para remover al completar la verificación",
                                    emoji: "🔴"
                                },
                                {
                                    label: "Resetear Configuraciones",
                                    value: "reset configs",
                                    description: "Resetea todas las configuraciones del sistema",
                                    emoji: "🔄"
                                }
                            ])
                    )
                ]});
            } else if(inter.isSelectMenu() && inter.values[0] === "back") {
                await inter.update({components: [
                    new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`verify on - ${inter.user.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),
            
                        new MessageButton()
                            .setCustomId(`verify off - ${inter.user.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER"),
            
                        new MessageButton()
                            .setCustomId(`verify configsList - ${inter.user.id}`)
                            .setEmoji("⚙")
                            .setLabel("CONFIGURACIONES")
                            .setDisabled(false)
                            .setStyle("SECONDARY")
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            } else if(inter.isSelectMenu() && inter.values[0] === "set channel") {
                const collector = inter.message.channel.createMessageCollector({filter: (m) => m.author.id === inter.user.id, time: 60000});
                await inter.update({content: "`⌛` | Menciona el canal de texto que quieres establecer...\n\n\u2007<:arrow_right:964247865943801887> **Para Cancelar:** `cancel`", embeds: [], components: [], files: []});

                collector.on("collect", async (m) => {
                    if(m.content.toLowerCase() !== "cancel") {
                        const channel = m.mentions.channels.first();
    
                        if(channel) {
                            if(channel.type === "GUILD_TEXT") {
                                if(channel.permissionsFor(client.user.id).has("SEND_MESSAGES")) {
                                    const msgSend = await channel.send({embeds: [
                                        {
                                            author: {
                                                name: "SISTEMA DE VERIFICACIÓN",
                                                icon_url: "attachment://captcha-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "Para poder verificarte, debes completar un captcha que se te fue enviado por privado, luego presiona el boton de este mensaje.",
                                            thumbnail: {
                                                url: inter.guild.iconURL({dynamic: true})
                                            },
                                            footer: {
                                                text: client.user.username,
                                                icon_url: client.user.displayAvatarURL()
                                            },
                                            timestamp: new Date()
                                        }
                                    ], components: [
                                        new MessageActionRow()
                                        .setComponents(
                                            new MessageButton()
                                                .setCustomId("verify")
                                                .setEmoji("✅")
                                                .setLabel("UNIRSE")
                                                .setStyle("SUCCESS")
                                        )
                                    ], files: ["./images/captcha-icon.png"]});
    
                                    if(msgSend) {
                                        collector.stop();
                                        system.channel = String(channel.id);
                                        await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                                            systems: guildData.systems
                                        });
    
                                        const msg = await m.reply({content: "`✅` | El canal se establecio correctamente!", fetchReply: true});
                                        await wait(2200);
                                        await msg.edit({content: null, embeds: [
                                            {
                                                author: {
                                                    name: "SISTEMA DE VERIFICACIÓN",
                                                    icon_url: client.user.displayAvatarURL()
                                                },
                                                color: "#5A9EC9",
                                                description: "Implementa un sistema de verificación en el servidor.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Estado Del Captcha:** " + `${system.configsPremium.captchaInDM === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                                            .setComponents(
                                                new MessageSelectMenu()
                                                    .setCustomId("verify configs - " + inter.user.id + "")
                                                    .setMaxValues(1)
                                                    .setMinValues(1)
                                                    .setPlaceholder("Lista de configuraciones")
                                                    .setOptions([
                                                        {
                                                            label: "Regresar",
                                                            value: "back",
                                                            emoji: "⏪"
                                                        },
                                                        {
                                                            label: "Establecer Canal",
                                                            value: "set channel",
                                                            description: "Establece un canal para el sistema de verificación",
                                                            emoji: "#️⃣"
                                                        },
                                                        {
                                                            label: "Togglear Captcha Por DM",
                                                            value: "toggle captcha",
                                                            description: "Activa o Desactiva el captcha requerido por mensaje privado",
                                                            emoji: "💎"
                                                        },
                                                        {
                                                            label: "Establecer Roles Para Otorgar",
                                                            value: "add roles",
                                                            description: "Establece roles para otorgar al completar la verificación",
                                                            emoji: "🟢"
                                                        },
                                                        {
                                                            label: "Establecer Roles Para Remover",
                                                            value: "remove roles",
                                                            description: "Establece roles para remover al completar la verificación",
                                                            emoji: "🔴"
                                                        },
                                                        {
                                                            label: "Resetear Configuraciones",
                                                            value: "reset configs",
                                                            description: "Resetea todas las configuraciones del sistema",
                                                            emoji: "🔄"
                                                        }
                                                    ])
                                            )
                                        ], files: ["./images/dbConfig-icon.png"]});
                                    } else return await m.reply("`❌` | No pude enviar el mensaje al canal.");
                                } else await m.reply("`❌` | No tengo permisos para enviar mensajes a ese canal.");
                            } else await m.reply("`❌` | El canal debe ser de texto.");
                        } else await m.reply("`❌` | Debes mencionar el canal de texto que quieres establecer.");
                    } else {
                        collector.stop();
                        const msg = await m.reply("`✅` | La configuración ha sido cancelada.");

                        await wait(2200);
                        await msg.edit({content: null, embeds: [
                            {
                                author: {
                                    name: "SISTEMA DE VERIFICACIÓN",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                color: "#5A9EC9",
                                description: "Implementa un sistema de verificación en el servidor.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Estado Del Captcha:** " + `${system.configsPremium.captchaInDM === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                            .setComponents(
                                new MessageSelectMenu()
                                    .setCustomId("verify configs - " + inter.user.id + "")
                                    .setMaxValues(1)
                                    .setMinValues(1)
                                    .setPlaceholder("Lista de configuraciones")
                                    .setOptions([
                                        {
                                            label: "Regresar",
                                            value: "back",
                                            emoji: "⏪"
                                        },
                                        {
                                            label: "Establecer Canal",
                                            value: "set channel",
                                            description: "Establece un canal para el sistema de verificación",
                                            emoji: "#️⃣"
                                        },
                                        {
                                            label: "Togglear Captcha Por DM",
                                            value: "toggle captcha",
                                            description: "Activa o Desactiva el captcha requerido por mensaje privado",
                                            emoji: "💎"
                                        },
                                        {
                                            label: "Establecer Roles Para Otorgar",
                                            value: "add roles",
                                            description: "Establece roles para otorgar al completar la verificación",
                                            emoji: "🟢"
                                        },
                                        {
                                            label: "Establecer Roles Para Remover",
                                            value: "remove roles",
                                            description: "Establece roles para remover al completar la verificación",
                                            emoji: "🔴"
                                        },
                                        {
                                            label: "Resetear Configuraciones",
                                            value: "reset configs",
                                            description: "Resetea todas las configuraciones del sistema",
                                            emoji: "🔄"
                                        }
                                    ])
                            )
                        ], files: ["./images/dbConfig-icon.png"]});
                    }
                });
            } else if(inter.isSelectMenu() && inter.values[0] === "add roles") {
                const collector = inter.message.channel.createMessageCollector({filter: (m) => m.author.id === inter.user.id, time: 60000});
                await inter.update({content: "`⌛` | Menciona los roles que quieres establecer...\n\n\u2007<:arrow_right:964247865943801887> **Para Cancelar:** `cancel`", embeds: [], components: [], files: []});

                collector.on("collect", async (m) => {
                    if(m.content.toLowerCase() !== "cancel") {
                        const roles = m.mentions.roles;

                        if(roles.size > 0) {
                            const rolesToAdd = roles.map((r) => {
                                if(!system.roles.add.includes(String(r.id))) return String(r.id);
                            }).filter((i) => i);

                            if(rolesToAdd.length > 0) {
                                collector.stop();

                                system.roles.add = system.roles.add.concat(rolesToAdd);
                                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                                    systems: guildData.systems
                                });

                                const msg = await m.reply("`✅` | Los roles " + rolesToAdd.map((i) => `<@&${i}>`).join(", ") + " han sido establecidos!");
                                await wait(2200);
                                await msg.edit({content: null, embeds: [
                                    {
                                        author: {
                                            name: "SISTEMA DE VERIFICACIÓN",
                                            icon_url: client.user.displayAvatarURL()
                                        },
                                        color: "#5A9EC9",
                                        description: "Implementa un sistema de verificación en el servidor.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Estado Del Captcha:** " + `${system.configsPremium.captchaInDM === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                                    .setComponents(
                                        new MessageSelectMenu()
                                            .setCustomId("verify configs - " + inter.user.id + "")
                                            .setMaxValues(1)
                                            .setMinValues(1)
                                            .setPlaceholder("Lista de configuraciones")
                                            .setOptions([
                                                {
                                                    label: "Regresar",
                                                    value: "back",
                                                    emoji: "⏪"
                                                },
                                                {
                                                    label: "Establecer Canal",
                                                    value: "set channel",
                                                    description: "Establece un canal para el sistema de verificación",
                                                    emoji: "#️⃣"
                                                },
                                                {
                                                    label: "Togglear Captcha Por DM",
                                                    value: "toggle captcha",
                                                    description: "Activa o Desactiva el captcha requerido por mensaje privado",
                                                    emoji: "💎"
                                                },
                                                {
                                                    label: "Establecer Roles Para Otorgar",
                                                    value: "add roles",
                                                    description: "Establece roles para otorgar al completar la verificación",
                                                    emoji: "🟢"
                                                },
                                                {
                                                    label: "Establecer Roles Para Remover",
                                                    value: "remove roles",
                                                    description: "Establece roles para remover al completar la verificación",
                                                    emoji: "🔴"
                                                },
                                                {
                                                    label: "Resetear Configuraciones",
                                                    value: "reset configs",
                                                    description: "Resetea todas las configuraciones del sistema",
                                                    emoji: "🔄"
                                                }
                                            ])
                                    )
                                ], files: ["./images/dbConfig-icon.png"]});
                            } else await m.reply("`❌` | Los roles mencionados ya estan en la lista.");
                        } else await m.reply("`❌` | Debes mencionar algun rol para establecer.");
                    } else {
                        collector.stop();
                        const msg = await m.reply("`✅` | La configuración ha sido cancelada.");

                        await wait(2200);
                        await msg.edit({content: null, embeds: [
                            {
                                author: {
                                    name: "SISTEMA DE VERIFICACIÓN",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                color: "#5A9EC9",
                                description: "Implementa un sistema de verificación en el servidor.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Estado Del Captcha:** " + `${system.configsPremium.captchaInDM === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                            .setComponents(
                                new MessageSelectMenu()
                                    .setCustomId("verify configs - " + inter.user.id + "")
                                    .setMaxValues(1)
                                    .setMinValues(1)
                                    .setPlaceholder("Lista de configuraciones")
                                    .setOptions([
                                        {
                                            label: "Regresar",
                                            value: "back",
                                            emoji: "⏪"
                                        },
                                        {
                                            label: "Establecer Canal",
                                            value: "set channel",
                                            description: "Establece un canal para el sistema de verificación",
                                            emoji: "#️⃣"
                                        },
                                        {
                                            label: "Togglear Captcha Por DM",
                                            value: "toggle captcha",
                                            description: "Activa o Desactiva el captcha requerido por mensaje privado",
                                            emoji: "💎"
                                        },
                                        {
                                            label: "Establecer Roles Para Otorgar",
                                            value: "add roles",
                                            description: "Establece roles para otorgar al completar la verificación",
                                            emoji: "🟢"
                                        },
                                        {
                                            label: "Establecer Roles Para Remover",
                                            value: "remove roles",
                                            description: "Establece roles para remover al completar la verificación",
                                            emoji: "🔴"
                                        },
                                        {
                                            label: "Resetear Configuraciones",
                                            value: "reset configs",
                                            description: "Resetea todas las configuraciones del sistema",
                                            emoji: "🔄"
                                        }
                                    ])
                            )
                        ], files: ["./images/dbConfig-icon.png"]});
                    }
                });
            } else if(inter.isSelectMenu() && inter.values[0] === "remove roles") {
                const collector = inter.message.channel.createMessageCollector({filter: (m) => m.author.id === inter.user.id, time: 60000});
                await inter.update({content: "`⌛` | Menciona los roles que quieres establecer...\n\n\u2007<:arrow_right:964247865943801887> **Para Cancelar:** `cancel`", embeds: [], components: [], files: []});

                collector.on("collect", async (m) => {
                    if(m.content.toLowerCase() !== "cancel") {
                        const roles = m.mentions.roles;

                        if(roles.size > 0) {
                            const rolesToRemove = roles.map((r) => {
                                if(!system.roles.remove.includes(String(r.id))) return String(r.id);
                            }).filter((i) => i);

                            if(rolesToRemove.length > 0) {
                                collector.stop();

                                system.roles.remove = system.roles.remove.concat(rolesToRemove);
                                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                                    systems: guildData.systems
                                });

                                const msg = await m.reply("`✅` | Los roles " + rolesToRemove.map((i) => `<@&${i}>`).join(", ") + " han sido establecidos!");
                                await wait(2200);
                                await msg.edit({content: null, embeds: [
                                    {
                                        author: {
                                            name: "SISTEMA DE VERIFICACIÓN",
                                            icon_url: client.user.displayAvatarURL()
                                        },
                                        color: "#5A9EC9",
                                        description: "Implementa un sistema de verificación en el servidor.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Estado Del Captcha:** " + `${system.configsPremium.captchaInDM === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                                    .setComponents(
                                        new MessageSelectMenu()
                                            .setCustomId("verify configs - " + inter.user.id + "")
                                            .setMaxValues(1)
                                            .setMinValues(1)
                                            .setPlaceholder("Lista de configuraciones")
                                            .setOptions([
                                                {
                                                    label: "Regresar",
                                                    value: "back",
                                                    emoji: "⏪"
                                                },
                                                {
                                                    label: "Establecer Canal",
                                                    value: "set channel",
                                                    description: "Establece un canal para el sistema de verificación",
                                                    emoji: "#️⃣"
                                                },
                                                {
                                                    label: "Togglear Captcha Por DM",
                                                    value: "toggle captcha",
                                                    description: "Activa o Desactiva el captcha requerido por mensaje privado",
                                                    emoji: "💎"
                                                },
                                                {
                                                    label: "Establecer Roles Para Otorgar",
                                                    value: "add roles",
                                                    description: "Establece roles para otorgar al completar la verificación",
                                                    emoji: "🟢"
                                                },
                                                {
                                                    label: "Establecer Roles Para Remover",
                                                    value: "remove roles",
                                                    description: "Establece roles para remover al completar la verificación",
                                                    emoji: "🔴"
                                                },
                                                {
                                                    label: "Resetear Configuraciones",
                                                    value: "reset configs",
                                                    description: "Resetea todas las configuraciones del sistema",
                                                    emoji: "🔄"
                                                }
                                            ])
                                    )
                                ], files: ["./images/dbConfig-icon.png"]});
                            } else await m.reply("`❌` | Los roles mencionados ya estan en la lista.");
                        } else await m.reply("`❌` | Debes mencionar algun rol para remover.");
                    } else {
                        collector.stop();

                        const msg = await m.reply("`✅` | La configuración ha sido cancelada.");
                        await wait(2200);
                        await msg.edit({content: null, embeds: [
                            {
                                author: {
                                    name: "SISTEMA DE VERIFICACIÓN",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                color: "#5A9EC9",
                                description: "Implementa un sistema de verificación en el servidor.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Estado Del Captcha:** " + `${system.configsPremium.captchaInDM === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                            .setComponents(
                                new MessageSelectMenu()
                                    .setCustomId("verify configs - " + inter.user.id + "")
                                    .setMaxValues(1)
                                    .setMinValues(1)
                                    .setPlaceholder("Lista de configuraciones")
                                    .setOptions([
                                        {
                                            label: "Regresar",
                                            value: "back",
                                            emoji: "⏪"
                                        },
                                        {
                                            label: "Establecer Canal",
                                            value: "set channel",
                                            description: "Establece un canal para el sistema de verificación",
                                            emoji: "#️⃣"
                                        },
                                        {
                                            label: "Togglear Captcha Por DM",
                                            value: "toggle captcha",
                                            description: "Activa o Desactiva el captcha requerido por mensaje privado",
                                            emoji: "💎"
                                        },
                                        {
                                            label: "Establecer Roles Para Otorgar",
                                            value: "add roles",
                                            description: "Establece roles para otorgar al completar la verificación",
                                            emoji: "🟢"
                                        },
                                        {
                                            label: "Establecer Roles Para Remover",
                                            value: "remove roles",
                                            description: "Establece roles para remover al completar la verificación",
                                            emoji: "🔴"
                                        },
                                        {
                                            label: "Resetear Configuraciones",
                                            value: "reset configs",
                                            description: "Resetea todas las configuraciones del sistema",
                                            emoji: "🔄"
                                        }
                                    ])
                            )
                        ], files: ["./images/dbConfig-icon.png"]});
                    }
                });
            } else if(inter.isSelectMenu() && inter.values[0] === "reset configs") {
                system.isActived = false;
                system.channel = null
                system.roles.add = [];
                system.roles.remove = [];
                system.configsPremium.captchaInDM = true;
                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                    systems: guildData.systems
                });

                const msg = await inter.update({content: "`✅` | Todas las configuraciones del sistema han sido reestablecidas.", embeds: [], components: [], files: [], fetchReply: true});
                await wait(2200);
                await msg.edit({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA DE VERIFICACIÓN",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Implementa un sistema de verificación en el servidor.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Estado Del Captcha:** " + `${system.configsPremium.captchaInDM === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                    .setComponents(
                        new MessageSelectMenu()
                            .setCustomId("verify configs - " + inter.user.id + "")
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Lista de configuraciones")
                            .setOptions([
                                {
                                    label: "Regresar",
                                    value: "back",
                                    emoji: "⏪"
                                },
                                {
                                    label: "Establecer Canal",
                                    value: "set channel",
                                    description: "Establece un canal para el sistema de verificación",
                                    emoji: "#️⃣"
                                },
                                {
                                    label: "Togglear Captcha Por DM",
                                    value: "toggle captcha",
                                    description: "Activa o Desactiva el captcha requerido por mensaje privado",
                                    emoji: "💎"
                                },
                                {
                                    label: "Establecer Roles Para Otorgar",
                                    value: "add roles",
                                    description: "Establece roles para otorgar al completar la verificación",
                                    emoji: "🟢"
                                },
                                {
                                    label: "Establecer Roles Para Remover",
                                    value: "remove roles",
                                    description: "Establece roles para remover al completar la verificación",
                                    emoji: "🔴"
                                },
                                {
                                    label: "Resetear Configuraciones",
                                    value: "reset configs",
                                    description: "Resetea todas las configuraciones del sistema",
                                    emoji: "🔄"
                                }
                            ])
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            } else if(inter.isSelectMenu() && inter.values[0] === "toggle captcha") {
                system.configsPremium.captchaInDM = system.configsPremium.captchaInDM === true ? false : true
                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                    systems: guildData.systems
                });

                const msg = await inter.update({content: "`✅` | El **Captcha** ha sido " + `${system.configsPremium.captchaInDM === true ? "Activado" : "Desactivado"}` + ".", embeds: [], components: [], files: [], fetchReply: true});
                await wait(2200);
                await msg.edit({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA DE VERIFICACIÓN",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Implementa un sistema de verificación en el servidor.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Estado Del Captcha:** " + `${system.configsPremium.captchaInDM === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007<:arrow_right:964247865943801887> **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                    .setComponents(
                        new MessageSelectMenu()
                            .setCustomId("verify configs - " + inter.user.id + "")
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Lista de configuraciones")
                            .setOptions([
                                {
                                    label: "Regresar",
                                    value: "back",
                                    emoji: "⏪"
                                },
                                {
                                    label: "Establecer Canal",
                                    value: "set channel",
                                    description: "Establece un canal para el sistema de verificación",
                                    emoji: "#️⃣"
                                },
                                {
                                    label: "Togglear Captcha Por DM",
                                    value: "toggle captcha",
                                    description: "Activa o Desactiva el captcha por mensaje privado",
                                    emoji: "💎"
                                },
                                {
                                    label: "Establecer Roles Para Otorgar",
                                    value: "add roles",
                                    description: "Establece roles para otorgar al completar la verificación",
                                    emoji: "🟢"
                                },
                                {
                                    label: "Establecer Roles Para Remover",
                                    value: "remove roles",
                                    description: "Establece roles para remover al completar la verificación",
                                    emoji: "🔴"
                                },
                                {
                                    label: "Resetear Configuraciones",
                                    value: "reset configs",
                                    description: "Resetea todas las configuraciones del sistema",
                                    emoji: "🔄"
                                }
                            ])
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            }
        } else {
            const system = guildData.systems.find((i) => i.name === "verification");

            if(customId === "verify on" || customId === "verify off") {
                const msg = await inter.update({content: "`✅` | El sistema de **Verificación** ha sido " + `${customId === "verify on" ? "Activado" : "Desactivado"}` + ".", embeds: [], files: [], components: [], fetchReply: true});

                system.isActived = customId === "verify on" ? true : false;
                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                    systems: guildData.systems
                });

                await wait(2200);
                await msg.edit({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA DE VERIFICACIÓN",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Implementa un sistema de verificación en el servidor.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007 **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + " (" + system.roles.add.length + "/3)\n\u2007 **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + " (" + system.roles.remove.length + "/3)",
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
                            .setCustomId(`verify on - ${inter.user.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),
            
                        new MessageButton()
                            .setCustomId(`verify off - ${inter.user.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER"),
            
                        new MessageButton()
                            .setCustomId(`verify configsList - ${inter.user.id}`)
                            .setEmoji("⚙")
                            .setLabel("CONFIGURACIONES")
                            .setDisabled(false)
                            .setStyle("SECONDARY")
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            } else if(inter.isButton() && customId === "verify configsList") {
                await inter.update({components: [
                    new MessageActionRow()
                    .setComponents(
                        new MessageSelectMenu()
                            .setCustomId("verify configsList - " + inter.user.id + "")
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Lista de configuraciones")
                            .setOptions([
                                {
                                    label: "Regresar",
                                    value: "back",
                                    emoji: "⏪"
                                },
                                {
                                    label: "Establecer Canal",
                                    value: "set channel",
                                    description: "Establece un canal para el sistema de verificación",
                                    emoji: "#️⃣"
                                },
                                {
                                    label: "Establecer Roles Para Otorgar",
                                    value: "add roles",
                                    description: "Establece roles para otorgar al completar la verificación",
                                    emoji: "🟢"
                                },
                                {
                                    label: "Establecer Roles Para Remover",
                                    value: "remove roles",
                                    description: "Establece roles para remover al completar la verificación",
                                    emoji: "🔴"
                                },
                                {
                                    label: "Resetear Configuraciones",
                                    value: "reset configs",
                                    description: "Resetea todas las configuraciones del sistema",
                                    emoji: "🔄"
                                }
                            ])
                    )
                ]});
            } else if(inter.isSelectMenu() && inter.values[0] === "back") {
                await inter.update({components: [
                    new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`verify on - ${inter.user.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),
            
                        new MessageButton()
                            .setCustomId(`verify off - ${inter.user.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER"),
            
                        new MessageButton()
                            .setCustomId(`verify configsList - ${inter.user.id}`)
                            .setEmoji("⚙")
                            .setLabel("CONFIGURACIONES")
                            .setDisabled(false)
                            .setStyle("SECONDARY")
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            } else if(inter.isSelectMenu() && inter.values[0] === "set channel") {
                const collector = inter.channel.createMessageCollector({filter: (m) => m.author.id === inter.user.id, time: 60000});
                await inter.update({content: "`⌛` | Menciona el canal de texto que quieres establecer...\n\n\u2007 **Para Cancelar:** `cancel`", embeds: [], components: [], files: []});

                collector.on("collect", async (m) => {
                    if(m.content.toLowerCase() !== "cancel") {
                        const channel = m.mentions.channels.first();
    
                        if(channel) {
                            if(channel.type === "GUILD_TEXT") {
                                if(channel.permissionsFor(client.user.id).has("SEND_MESSAGES")) {
                                    const msgSend = await channel.send({embeds: [
                                        {
                                            author: {
                                                name: "SISTEMA DE VERIFICACIÓN",
                                                icon_url: "attachment://captcha-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "Para poder verificarte, debes presionar el boton de este mensaje.",
                                            thumbnail: {
                                                url: inter.guild.iconURL({dynamic: true})
                                            },
                                            footer: {
                                                text: client.user.username,
                                                icon_url: client.user.displayAvatarURL()
                                            },
                                            timestamp: new Date()
                                        }
                                    ], components: [
                                        new MessageActionRow()
                                        .setComponents(
                                            new MessageButton()
                                                .setCustomId("verify")
                                                .setEmoji("✅")
                                                .setLabel("UNIRSE")
                                                .setStyle("SUCCESS")
                                        )
                                    ], files: ["./images/captcha-icon.png"]});
    
                                    if(msgSend) {
                                        collector.stop();
                                        system.channel = String(channel.id);
                                        await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                                            systems: guildData.systems
                                        });
    
                                        const msg = await m.reply({content: "`✅` | El canal se establecio correctamente!", fetchReply: true});
                                        await wait(2200);
                                        await msg.edit({content: null, embeds: [
                                            {
                                                author: {
                                                    name: "SISTEMA DE VERIFICACIÓN",
                                                    icon_url: client.user.displayAvatarURL()
                                                },
                                                color: "#5A9EC9",
                                                description: "Implementa un sistema de verificación en el servidor.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007 **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + " (" + system.roles.add.length + "/3)\n\u2007 **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + " (" + system.roles.remove.length + "/3)",
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
                                            .setComponents(
                                                new MessageSelectMenu()
                                                    .setCustomId("verify configsList - " + inter.user.id + "")
                                                    .setMaxValues(1)
                                                    .setMinValues(1)
                                                    .setPlaceholder("Lista de configuraciones")
                                                    .setOptions([
                                                        {
                                                            label: "Regresar",
                                                            value: "back",
                                                            emoji: "⏪"
                                                        },
                                                        {
                                                            label: "Establecer Canal",
                                                            value: "set channel",
                                                            description: "Establece un canal para el sistema de verificación",
                                                            emoji: "#️⃣"
                                                        },
                                                        {
                                                            label: "Establecer Roles Para Otorgar",
                                                            value: "add roles",
                                                            description: "Establece roles para otorgar al completar la verificación",
                                                            emoji: "🟢"
                                                        },
                                                        {
                                                            label: "Establecer Roles Para Remover",
                                                            value: "remove roles",
                                                            description: "Establece roles para remover al completar la verificación",
                                                            emoji: "🔴"
                                                        },
                                                        {
                                                            label: "Resetear Configuraciones",
                                                            value: "reset configs",
                                                            description: "Resetea todas las configuraciones del sistema",
                                                            emoji: "🔄"
                                                        }
                                                    ])
                                            )
                                        ], files: ["./images/dbConfig-icon.png"]});
                                    } else return await m.reply("`❌` | No pude enviar el mensaje al canal.");
                                } else await m.reply("`❌` | No tengo permisos para enviar mensajes a ese canal.");
                            } else await m.reply("`❌` | El canal debe ser de texto.");
                        } else await m.reply("`❌` | Debes mencionar el canal de texto que quieres establecer.");
                    } else {
                        collector.stop();
                        const msg = await m.reply("`✅` | La configuración ha sido cancelada.");

                        await wait(2200);
                        await msg.edit({content: null, embeds: [
                            {
                                author: {
                                    name: "SISTEMA DE VERIFICACIÓN",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                color: "#5A9EC9",
                                description: "Implementa un sistema de verificación en el servidor.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007 **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + " (" + system.roles.add.length + "/3)\n\u2007 **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + " (" + system.roles.remove.length + "/3)",
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
                            .setComponents(
                                new MessageSelectMenu()
                                    .setCustomId("verify configsList - " + inter.user.id + "")
                                    .setMaxValues(1)
                                    .setMinValues(1)
                                    .setPlaceholder("Lista de configuraciones")
                                    .setOptions([
                                        {
                                            label: "Regresar",
                                            value: "back",
                                            emoji: "⏪"
                                        },
                                        {
                                            label: "Establecer Canal",
                                            value: "set channel",
                                            description: "Establece un canal para el sistema de verificación",
                                            emoji: "#️⃣"
                                        },
                                        {
                                            label: "Establecer Roles Para Otorgar",
                                            value: "add roles",
                                            description: "Establece roles para otorgar al completar la verificación",
                                            emoji: "🟢"
                                        },
                                        {
                                            label: "Establecer Roles Para Remover",
                                            value: "remove roles",
                                            description: "Establece roles para remover al completar la verificación",
                                            emoji: "🔴"
                                        },
                                        {
                                            label: "Resetear Configuraciones",
                                            value: "reset configs",
                                            description: "Resetea todas las configuraciones del sistema",
                                            emoji: "🔄"
                                        }
                                    ])
                            )
                        ], files: ["./images/dbConfig-icon.png"]});
                    }
                });
            } else if(inter.isSelectMenu() && inter.values[0] === "add roles") {
                const collector = inter.channel.createMessageCollector({filter: (m) => m.author.id === inter.user.id, time: 60000});
                await inter.update({content: "`⌛` | Menciona los roles que quieres establecer...\n\n\u2007 **Para Cancelar:** `cancel`", embeds: [], components: [], files: []});

                collector.on("collect", async (m) => {
                    if(m.content.toLowerCase() !== "cancel") {
                        const roles = m.mentions.roles;

                        console.log(roles.toJSON())
                        if(roles.size > 0) {
                            const rolesToAdd = roles.map((r) => {
                                if(!system.roles.add.includes(String(r.id))) return String(r.id);
                            }).filter((i) => i);

                            if(rolesToAdd.length > 0) {
                                collector.stop();

                                system.roles.add = system.roles.add.concat(rolesToAdd);
                                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                                    systems: guildData.systems
                                });

                                const msg = await m.reply("`✅` | Los roles " + rolesToAdd.map((i) => `<@&${i}>`).join(", ") + " han sido establecidos!");
                                await wait(2200);
                                await msg.edit({content: null, embeds: [
                                    {
                                        author: {
                                            name: "SISTEMA DE VERIFICACIÓN",
                                            icon_url: client.user.displayAvatarURL()
                                        },
                                        color: "#5A9EC9",
                                        description: "Implementa un sistema de verificación en el servidor.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007 **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007 **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                                    .setComponents(
                                        new MessageSelectMenu()
                                            .setCustomId("verify configsList - " + inter.user.id + "")
                                            .setMaxValues(1)
                                            .setMinValues(1)
                                            .setPlaceholder("Lista de configuraciones")
                                            .setOptions([
                                                {
                                                    label: "Regresar",
                                                    value: "back",
                                                    emoji: "⏪"
                                                },
                                                {
                                                    label: "Establecer Canal",
                                                    value: "set channel",
                                                    description: "Establece un canal para el sistema de verificación",
                                                    emoji: "#️⃣"
                                                },
                                                {
                                                    label: "Establecer Roles Para Otorgar",
                                                    value: "add roles",
                                                    description: "Establece roles para otorgar al completar la verificación",
                                                    emoji: "🟢"
                                                },
                                                {
                                                    label: "Establecer Roles Para Remover",
                                                    value: "remove roles",
                                                    description: "Establece roles para remover al completar la verificación",
                                                    emoji: "🔴"
                                                },
                                                {
                                                    label: "Resetear Configuraciones",
                                                    value: "reset configs",
                                                    description: "Resetea todas las configuraciones del sistema",
                                                    emoji: "🔄"
                                                }
                                            ])
                                    )
                                ], files: ["./images/dbConfig-icon.png"]});
                            } else await m.reply("`❌` | Los roles mencionados ya estan en la lista.");
                        } else await m.reply("`❌` | Debes mencionar algun rol para establecer.");
                    } else {
                        collector.stop();
                        const msg = await m.reply("`✅` | La configuración ha sido cancelada.");

                        await wait(2200);
                        await msg.edit({content: null, embeds: [
                            {
                                author: {
                                    name: "SISTEMA DE VERIFICACIÓN",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                color: "#5A9EC9",
                                description: "Implementa un sistema de verificación en el servidor.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007 **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007 **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                            .setComponents(
                                new MessageSelectMenu()
                                    .setCustomId("verify configsList - " + inter.user.id + "")
                                    .setMaxValues(1)
                                    .setMinValues(1)
                                    .setPlaceholder("Lista de configuraciones")
                                    .setOptions([
                                        {
                                            label: "Regresar",
                                            value: "back",
                                            emoji: "⏪"
                                        },
                                        {
                                            label: "Establecer Canal",
                                            value: "set channel",
                                            description: "Establece un canal para el sistema de verificación",
                                            emoji: "#️⃣"
                                        },
                                        {
                                            label: "Establecer Roles Para Otorgar",
                                            value: "add roles",
                                            description: "Establece roles para otorgar al completar la verificación",
                                            emoji: "🟢"
                                        },
                                        {
                                            label: "Establecer Roles Para Remover",
                                            value: "remove roles",
                                            description: "Establece roles para remover al completar la verificación",
                                            emoji: "🔴"
                                        },
                                        {
                                            label: "Resetear Configuraciones",
                                            value: "reset configs",
                                            description: "Resetea todas las configuraciones del sistema",
                                            emoji: "🔄"
                                        }
                                    ])
                            )
                        ], files: ["./images/dbConfig-icon.png"]});
                    }
                });
            } else if(inter.isSelectMenu() && inter.values[0] === "remove roles") {
                const collector = inter.message.channel.createMessageCollector({filter: (m) => m.author.id === inter.user.id, time: 60000});
                await inter.update({content: "`⌛` | Menciona los roles que quieres establecer...\n\n\u2007<:arrow_right:964247865943801887> **Para Cancelar:** `cancel`", embeds: [], components: [], files: []});

                collector.on("collect", async (m) => {
                    if(m.content.toLowerCase() !== "cancel") {
                        const roles = m.mentions.roles;

                        if(roles.size > 0) {
                            const rolesToRemove = roles.map((r) => {
                                if(!system.roles.remove.includes(String(r.id))) return String(r.id);
                            }).filter((i) => i);

                            if(rolesToRemove.length > 0) {
                                collector.stop();

                                system.roles.remove = system.roles.remove.concat(rolesToRemove);
                                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                                    systems: guildData.systems
                                });

                                const msg = await m.reply("`✅` | Los roles " + rolesToRemove.map((i) => `<@&${i}>`).join(", ") + " han sido establecidos!");
                                await wait(2200);
                                await msg.edit({content: null, embeds: [
                                    {
                                        author: {
                                            name: "SISTEMA DE VERIFICACIÓN",
                                            icon_url: client.user.displayAvatarURL()
                                        },
                                        color: "#5A9EC9",
                                        description: "Implementa un sistema de verificación en el servidor.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007 **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007 **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                                    .setComponents(
                                        new MessageSelectMenu()
                                            .setCustomId("verify configsList - " + inter.user.id + "")
                                            .setMaxValues(1)
                                            .setMinValues(1)
                                            .setPlaceholder("Lista de configuraciones")
                                            .setOptions([
                                                {
                                                    label: "Regresar",
                                                    value: "back",
                                                    emoji: "⏪"
                                                },
                                                {
                                                    label: "Establecer Canal",
                                                    value: "set channel",
                                                    description: "Establece un canal para el sistema de verificación",
                                                    emoji: "#️⃣"
                                                },
                                                {
                                                    label: "Establecer Roles Para Otorgar",
                                                    value: "add roles",
                                                    description: "Establece roles para otorgar al completar la verificación",
                                                    emoji: "🟢"
                                                },
                                                {
                                                    label: "Establecer Roles Para Remover",
                                                    value: "remove roles",
                                                    description: "Establece roles para remover al completar la verificación",
                                                    emoji: "🔴"
                                                },
                                                {
                                                    label: "Resetear Configuraciones",
                                                    value: "reset configs",
                                                    description: "Resetea todas las configuraciones del sistema",
                                                    emoji: "🔄"
                                                }
                                            ])
                                    )
                                ], files: ["./images/dbConfig-icon.png"]});
                            } else await m.reply("`❌` | Los roles mencionados ya estan en la lista.");
                        } else await m.reply("`❌` | Debes mencionar algun rol para remover.");
                    } else {
                        collector.stop();

                        const msg = await m.reply("`✅` | La configuración ha sido cancelada.");
                        await wait(2200);
                        await msg.edit({content: null, embeds: [
                            {
                                author: {
                                    name: "SISTEMA DE VERIFICACIÓN",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                color: "#5A9EC9",
                                description: "Implementa un sistema de verificación en el servidor.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007 **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007 **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                            .setComponents(
                                new MessageSelectMenu()
                                    .setCustomId("verify configsList - " + inter.user.id + "")
                                    .setMaxValues(1)
                                    .setMinValues(1)
                                    .setPlaceholder("Lista de configuraciones")
                                    .setOptions([
                                        {
                                            label: "Regresar",
                                            value: "back",
                                            emoji: "⏪"
                                        },
                                        {
                                            label: "Establecer Canal",
                                            value: "set channel",
                                            description: "Establece un canal para el sistema de verificación",
                                            emoji: "#️⃣"
                                        },
                                        {
                                            label: "Establecer Roles Para Otorgar",
                                            value: "add roles",
                                            description: "Establece roles para otorgar al completar la verificación",
                                            emoji: "🟢"
                                        },
                                        {
                                            label: "Establecer Roles Para Remover",
                                            value: "remove roles",
                                            description: "Establece roles para remover al completar la verificación",
                                            emoji: "🔴"
                                        },
                                        {
                                            label: "Resetear Configuraciones",
                                            value: "reset configs",
                                            description: "Resetea todas las configuraciones del sistema",
                                            emoji: "🔄"
                                        }
                                    ])
                            )
                        ], files: ["./images/dbConfig-icon.png"]});
                    }
                });
            } else if(inter.isSelectMenu() && inter.values[0] === "reset configs") {
                system.isActived = false;
                system.channel = null
                system.roles.add = [];
                system.roles.remove = [];
                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                    systems: guildData.systems
                });

                const msg = await inter.update({content: "`✅` | Todas las configuraciones del sistema han sido reestablecidas.", embeds: [], components: [], files: [], fetchReply: true});
                await wait(2200);
                await msg.edit({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA DE VERIFICACIÓN",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Implementa un sistema de verificación en el servidor.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Canal Establecido:** " + `${system.channel !== null ? `<#${system.channel}>` : "Sin establecer"}` + "\n\u2007 **Roles Para Otorgar:** " + `${system.roles.add.length > 0 ? system.roles.add.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "\n\u2007 **Roles Para Remover:** " + `${system.roles.remove.length > 0 ? system.roles.remove.map((i) => `<@&${i}>`).join(", ") : "Sin establecer"}` + "",
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
                    .setComponents(
                        new MessageSelectMenu()
                            .setCustomId("verify configsList - " + inter.user.id + "")
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Lista de configuraciones")
                            .setOptions([
                                {
                                    label: "Regresar",
                                    value: "back",
                                    emoji: "⏪"
                                },
                                {
                                    label: "Establecer Canal",
                                    value: "set channel",
                                    description: "Establece un canal para el sistema de verificación",
                                    emoji: "#️⃣"
                                },
                                {
                                    label: "Establecer Roles Para Otorgar",
                                    value: "add roles",
                                    description: "Establece roles para otorgar al completar la verificación",
                                    emoji: "🟢"
                                },
                                {
                                    label: "Establecer Roles Para Remover",
                                    value: "remove roles",
                                    description: "Establece roles para remover al completar la verificación",
                                    emoji: "🔴"
                                },
                                {
                                    label: "Resetear Configuraciones",
                                    value: "reset configs",
                                    description: "Resetea todas las configuraciones del sistema",
                                    emoji: "🔄"
                                }
                            ])
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            }
        }
    }
};