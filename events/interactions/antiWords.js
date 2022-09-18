const Guilds = require("../../database/Models/guilds.js");
const wait = require("util").promisify(setTimeout);
const hastebin = require("hastebin-gen");
const { MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

module.exports = async (client, inter, customId, lang) => {
    if(lang === "es") {
        const guildData = await Guilds.findOne({guildId: String(inter.guild.id)});
        const system = guildData?.systems.find((i) => i.name === "antiWords");

        if(guildData?.premium.actived === true) {
            if(customId === "antiWords on" || customId === "antiWords off") {
                const msg = await inter.update({content: "`✅` | El sistema **AntiWords** ha sido " + `${customId === "antiWords on" ? "Activado" : "Desactivado"}` + ".", embeds: [], files: [], components: [], fetchReply: true});
    
                system.isActived = customId === "antiWords on" ? true : false;
                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                    systems: guildData.systems
                });
    
                await wait(2200);
                const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                await msg.edit({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA ANTI-WORDS",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Palabras Bloqueadas:** " + haste + "",
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
                            .setCustomId(`antiWords on - ${inter.user.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),
    
                        new MessageButton()
                            .setCustomId(`antiWords off - ${inter.user.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER"),
    
                        new MessageButton()
                            .setCustomId(`antiWords configs - ${inter.user.id}`)
                            .setEmoji("⚙")
                            .setLabel("CONFIGURACIONES")
                            .setDisabled(false)
                            .setStyle("SECONDARY")
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            } else if(customId === "antiWords configs") {
                await inter.update({components: [
                    new MessageActionRow()
                    .setComponents(
                        new MessageSelectMenu()
                            .setCustomId(`antiWords listConfigs - ${inter.user.id}`)
                            .setPlaceholder("Lista de configuraciones")
                            .setOptions([
                                {
                                    label: "Regresar",
                                    value: "back",
                                    emoji: "⏪"
                                },
                                {
                                    label: "Añadir Palabras",
                                    value: "add",
                                    emoji: "🟢",
                                    description: "Añade palabras a la lista"
                                },
                                {
                                    label: "Remover Palabras",
                                    value: "remove",
                                    emoji: "🔴",
                                    description: "Remueve palabras a la lista"
                                },
                                {
                                    label: "Reestablecer Configuraciones",
                                    value: "reset configs",
                                    emoji: "🔄",
                                    description: "Reestablece todas las configuraciones del sistema, incluyendo la lista de palabras"
                                }
                            ])
                    )
                ]});
            } else if(inter.values[0] === "back") {
                const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                await inter.update({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA ANTI-WORDS",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Palabras Bloqueadas:** " + haste + "",
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
                            .setCustomId(`antiWords on - ${inter.user.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),
    
                        new MessageButton()
                            .setCustomId(`antiWords off - ${inter.user.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER"),
    
                        new MessageButton()
                            .setCustomId(`antiWords configs - ${inter.user.id}`)
                            .setEmoji("⚙")
                            .setLabel("CONFIGURACIONES")
                            .setDisabled(false)
                            .setStyle("SECONDARY")
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            } else if(inter.values[0] === "add") {
                const collector = inter.channel.createMessageCollector({filter: (m) => m.author.id === inter.user.id, time: 60000});
                await inter.update({content: "`⌛` | Para añadir palabras separalas con `,`.\n\n\u2007<:arrow_right:964247865943801887> **Para Cancelar:** `cancel`\n\u2007<:arrow_right:964247865943801887> **Ejemplo:** `hola, mundo`", embeds: [], files: [], components: []});

                collector.on("collect", async (msg) => {
                    if(msg.content.toLowerCase() !== "cancel") {
                        const newWords = msg.content.toLowerCase().split(",");
                        const addWords = newWords.map((word) => { if(!system.list.find((i) => i.toLowerCase().trim() === word.toLowerCase().trim())) return word.toLowerCase().trim() }).filter((i) => i);
                    
                        if(addWords.length > 0) {
                            collector.stop();
                            system.list = system.list.concat(addWords);
    
                            const msgData = await msg.reply({content: "`✅` | Las palabras " + addWords.map((i) => `**${i}**`).join(", ") + " han sido agregadas a la lista.", fetchReply: true});
                            await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                                systems: guildData.systems
                            });
    
                            const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                            await wait(2200);
                            await msgData.edit({content: null, embeds: [
                                {
                                    author: {
                                        name: "SISTEMA ANTI-WORDS",
                                        icon_url: client.user.displayAvatarURL()
                                    },
                                    color: "#5A9EC9",
                                    description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Palabras Bloqueadas:** " + haste + "",
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
                                        .setCustomId(`antiWords listConfigs - ${msg.author.id}`)
                                        .setPlaceholder("Lista de configuraciones")
                                        .setOptions([
                                            {
                                                label: "Regresar",
                                                value: "back",
                                                emoji: "⏪"
                                            },
                                            {
                                                label: "Añadir Palabras",
                                                value: "add",
                                                emoji: "🟢",
                                                description: "Añade palabras a la lista"
                                            },
                                            {
                                                label: "Remover Palabras",
                                                value: "remove",
                                                emoji: "🔴",
                                                description: "Remueve palabras a la lista"
                                            },
                                            {
                                                label: "Reestablecer Configuraciones",
                                                value: "reset configs",
                                                emoji: "🔄",
                                                description: "Reestablece todas las configuraciones del sistema, incluyendo la lista de palabras"
                                            }
                                        ])
                                )
                            ], files: ["./images/dbConfig-icon.png"]});
                        } else await msg.reply("`❌` | Las palabras seleccionadas ya estan en la lista.");
                    } else {
                        collector.stop();
                        const msgData = await msg.reply({content: "`✅` | La configuración ha sido cancelada.", embeds: [], components: [], files: []});

                        const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                        await wait(2200);
                        await msgData.edit({content: null, embeds: [
                            {
                                author: {
                                    name: "SISTEMA ANTI-WORDS",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                color: "#5A9EC9",
                                description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Palabras Bloqueadas:** " + haste + "",
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
                                    .setCustomId(`antiWords listConfigs - ${msg.author.id}`)
                                    .setPlaceholder("Lista de configuraciones")
                                    .setOptions([
                                        {
                                            label: "Regresar",
                                            value: "back",
                                            emoji: "⏪"
                                        },
                                        {
                                            label: "Añadir Palabras",
                                            value: "add",
                                            emoji: "🟢",
                                            description: "Añade palabras a la lista"
                                        },
                                        {
                                            label: "Remover Palabras",
                                            value: "remove",
                                            emoji: "🔴",
                                            description: "Remueve palabras a la lista"
                                        },
                                        {
                                            label: "Reestablecer Configuraciones",
                                            value: "reset configs",
                                            emoji: "🔄",
                                            description: "Reestablece todas las configuraciones del sistema, incluyendo la lista de palabras"
                                        }
                                    ])
                            )
                        ], files: ["./images/dbConfig-icon.png"]});
                    }
                });
            } else if(inter.values[0] === "remove") {
                const collector = inter.channel.createMessageCollector({filter: (m) => m.author.id === inter.user.id, time: 60000});
                await inter.update({content: "`⌛` | Para eliminar palabras, seleccionalas tal cual y separalas con `,`.\n\n\u2007<:arrow_right:964247865943801887> **Para Cancelar:** `cancel`\n\u2007<:arrow_right:964247865943801887> **Ejemplo:** `hola, mundo`", embeds: [], files: [], components: []}).catch(() => null);
    
                collector.on("collect", async (msg) => {
                    if(msg.content.toLowerCase() !== "cancel") {
                        const removeWords = msg.content.split(",");
                        const words = removeWords.map((word) => { if(system.list.find((i) => i.toLowerCase().trim() === word.toLowerCase().trim())) return word.toLowerCase().trim() }).filter((i) => i);
                    
                        if(words.length > 0) {
                            collector.stop();
                            for(i of words) { system.list.splice(system.list.indexOf(i), 1); }
    
                            const msgData = await msg.reply({content: "`✅` | Las palabras " + words.map((i) => `**${i}**`).join(", ") + " han sido eliminadas de la lista.", fetchReply: true});
                            await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                                systems: guildData.systems
                            });
    
                            const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                            await wait(2200);
                            await msgData.edit({content: null, embeds: [
                                {
                                    author: {
                                        name: "SISTEMA ANTI-WORDS",
                                        icon_url: client.user.displayAvatarURL()
                                    },
                                    color: "#5A9EC9",
                                    description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Palabras Bloqueadas:** " + haste + "",
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
                                        .setCustomId(`antiWords listConfigs - ${msg.author.id}`)
                                        .setPlaceholder("Lista de configuraciones")
                                        .setOptions([
                                            {
                                                label: "Regresar",
                                                value: "back",
                                                emoji: "⏪"
                                            },
                                            {
                                                label: "Añadir Palabras",
                                                value: "add",
                                                emoji: "🟢",
                                                description: "Añade palabras a la lista"
                                            },
                                            {
                                                label: "Remover Palabras",
                                                value: "remove",
                                                emoji: "🔴",
                                                description: "Remueve palabras a la lista"
                                            },
                                            {
                                                label: "Reestablecer Configuraciones",
                                                value: "reset configs",
                                                emoji: "🔄",
                                                description: "Reestablece todas las configuraciones del sistema, incluyendo la lista de palabras"
                                            }
                                        ])
                                )
                            ], files: ["./images/dbConfig-icon.png"]});
                        } else await msg.reply("`❌` | Las palabras seleccionadas no estan en la lista.");
                    } else {
                        collector.stop();
                        const msgData = await msg.reply({content: "`✅` | La configuración ha sido cancelada."});

                        const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                        await wait(2200);
                        await msgData.edit({content: null, embeds: [
                            {
                                author: {
                                    name: "SISTEMA ANTI-WORDS",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                color: "#5A9EC9",
                                description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Palabras Bloqueadas:** " + haste + "",
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
                                    .setCustomId(`antiWords listConfigs - ${msg.author.id}`)
                                    .setPlaceholder("Lista de configuraciones")
                                    .setOptions([
                                        {
                                            label: "Regresar",
                                            value: "back",
                                            emoji: "⏪"
                                        },
                                        {
                                            label: "Añadir Palabras",
                                            value: "add",
                                            emoji: "🟢",
                                            description: "Añade palabras a la lista"
                                        },
                                        {
                                            label: "Remover Palabras",
                                            value: "remove",
                                            emoji: "🔴",
                                            description: "Remueve palabras a la lista"
                                        },
                                        {
                                            label: "Reestablecer Configuraciones",
                                            value: "reset configs",
                                            emoji: "🔄",
                                            description: "Reestablece todas las configuraciones del sistema, incluyendo la lista de palabras"
                                        }
                                    ])
                            )
                        ], files: ["./images/dbConfig-icon.png"]});
                    }
                });
            } else if(inter.values[0] === "reset configs") {
                const msg = await inter.update({content: "`✅` | Todas las configuraciones del sistema han sido eliminadas.", embeds: [], components: [], files: [], fetchReply: true});

                system.isActived = false;
                system.list = [];
                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                    systems: guildData.systems
                });

                await wait(2200);
                const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                await msg.edit({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA ANTI-WORDS",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Palabras Bloqueadas:** " + haste + "",
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
                            .setCustomId(`antiWords listConfigs - ${inter.user.id}`)
                            .setPlaceholder("Lista de configuraciones")
                            .setOptions([
                                {
                                    label: "Regresar",
                                    value: "back",
                                    emoji: "⏪"
                                },
                                {
                                    label: "Añadir Palabras",
                                    value: "add",
                                    emoji: "🟢",
                                    description: "Añade palabras a la lista"
                                },
                                {
                                    label: "Remover Palabras",
                                    value: "remove",
                                    emoji: "🔴",
                                    description: "Remueve palabras a la lista"
                                },
                                {
                                    label: "Reestablecer Configuraciones",
                                    value: "reset configs",
                                    emoji: "🔄",
                                    description: "Reestablece todas las configuraciones del sistema, incluyendo la lista de palabras"
                                }
                            ])
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            }
        } else {
            if(customId === "antiWords on" || customId === "antiWords off") {
                const msg = await inter.update({content: "`✅` | El sistema **AntiWords** ha sido " + `${customId === "antiWords on" ? "Activado" : "Desactivado"}` + ".", embeds: [], files: [], components: [], fetchReply: true});
    
                system.isActived = customId === "antiWords on" ? true : false;
                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                    systems: guildData.systems
                });
    
                await wait(2200);
                const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                await msg.edit({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA ANTI-WORDS",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Palabras Bloqueadas:** " + haste + "\n\u2007 **Limite:** " + system.list.length + "/5",
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
                            .setCustomId(`antiWords on - ${inter.user.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),
    
                        new MessageButton()
                            .setCustomId(`antiWords off - ${inter.user.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER"),
    
                        new MessageButton()
                            .setCustomId(`antiWords configs - ${inter.user.id}`)
                            .setEmoji("⚙")
                            .setLabel("CONFIGURACIONES")
                            .setDisabled(false)
                            .setStyle("SECONDARY")
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            } else if(customId === "antiWords configs") {
                await inter.update({components: [
                    new MessageActionRow()
                    .setComponents(
                        new MessageSelectMenu()
                            .setCustomId(`antiWords listConfigs - ${inter.user.id}`)
                            .setPlaceholder("Lista de configuraciones")
                            .setOptions([
                                {
                                    label: "Regresar",
                                    value: "back",
                                    emoji: "⏪"
                                },
                                {
                                    label: "Añadir Palabras",
                                    value: "add",
                                    emoji: "🟢",
                                    description: "Añade palabras a la lista"
                                },
                                {
                                    label: "Remover Palabras",
                                    value: "remove",
                                    emoji: "🔴",
                                    description: "Remueve palabras a la lista"
                                },
                                {
                                    label: "Reestablecer Configuraciones",
                                    value: "reset configs",
                                    emoji: "🔄",
                                    description: "Reestablece todas las configuraciones del sistema, incluyendo la lista de palabras"
                                }
                            ])
                    )
                ]});
            } else if(inter.values[0] === "back") {
                const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                await inter.update({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA ANTI-WORDS",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Palabras Bloqueadas:** " + haste + "\n\u2007 **Limite:** " + system.list.length + "/5",
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
                            .setCustomId(`antiWords on - ${inter.user.id}`)
                            .setEmoji("✅")
                            .setLabel("ACTIVAR")
                            .setDisabled(system.isActived === true ? true : false)
                            .setStyle("SUCCESS"),
    
                        new MessageButton()
                            .setCustomId(`antiWords off - ${inter.user.id}`)
                            .setEmoji("❎")
                            .setLabel("DESACTIVAR")
                            .setDisabled(system.isActived === false ? true : false)
                            .setStyle("DANGER"),
    
                        new MessageButton()
                            .setCustomId(`antiWords configs - ${inter.user.id}`)
                            .setEmoji("⚙")
                            .setLabel("CONFIGURACIONES")
                            .setDisabled(false)
                            .setStyle("SECONDARY")
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            } else if(inter.values[0] === "add") {
                if(system.list.length < 5) {
                    const collector = inter.channel.createMessageCollector({filter: (m) => m.author.id === inter.user.id, time: 60000});
                    await inter.update({content: "`⌛` | Para añadir palabras separalas con `,`.\n\n\u2007 **Para Cancelar:** `cancel`\n\u2007 **Ejemplo:** `hola, mundo`", embeds: [], files: [], components: []});
    
                    collector.on("collect", async (msg) => {
                        if(msg.content.toLowerCase() !== "cancel") {
                            const newWords = msg.content.toLowerCase().split(",");
                            const addWords = newWords.map((word) => { if(!system.list.find((i) => i.toLowerCase().trim() === word.toLowerCase().trim())) return word.toLowerCase().trim() }).filter((i) => i);
                        
                            if(addWords.length > 0) {
                                if(system.list.length < 5) {
                                    collector.stop();
    
                                    if(addWords.length > 5) addWords.splice(5);
                                    system.list = system.list.concat(addWords);
                                    const removed = system.list.splice(5);
    
                                    const msgData = await msg.reply({content: "`✅` | Las palabras " + addWords.map((w) => `**${w}**`).filter((i) => !removed.includes(i.replaceAll("*", ""))).join(", ") + " han sido agregadas a la lista.", fetchReply: true});
                                    await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                                        systems: guildData.systems
                                    });
            
                                    const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                                    await wait(2200);
                                    await msgData.edit({content: null, embeds: [
                                        {
                                            author: {
                                                name: "SISTEMA ANTI-WORDS",
                                                icon_url: client.user.displayAvatarURL()
                                            },
                                            color: "#5A9EC9",
                                            description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Palabras Bloqueadas:** " + haste + "",
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
                                                .setCustomId(`antiWords listConfigs - ${msg.author.id}`)
                                                .setPlaceholder("Lista de configuraciones")
                                                .setOptions([
                                                    {
                                                        label: "Regresar",
                                                        value: "back",
                                                        emoji: "⏪"
                                                    },
                                                    {
                                                        label: "Añadir Palabras",
                                                        value: "add",
                                                        emoji: "🟢",
                                                        description: "Añade palabras a la lista"
                                                    },
                                                    {
                                                        label: "Remover Palabras",
                                                        value: "remove",
                                                        emoji: "🔴",
                                                        description: "Remueve palabras a la lista"
                                                    },
                                                    {
                                                        label: "Reestablecer Configuraciones",
                                                        value: "reset configs",
                                                        emoji: "🔄",
                                                        description: "Reestablece todas las configuraciones del sistema, incluyendo la lista de palabras"
                                                    }
                                                ])
                                        )
                                    ], files: ["./images/dbConfig-icon.png"]});
                                } else {
                                    collector.stop();
                                    const msgData = await msg.reply({content: "`❌` | La lista de palabras ya esta al limite. `(5/5)`", embeds: [], components: [], files: []});
            
                                    const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                                    await wait(2200);
                                    await msgData.edit({content: null, embeds: [
                                        {
                                            author: {
                                                name: "SISTEMA ANTI-WORDS",
                                                icon_url: client.user.displayAvatarURL()
                                            },
                                            color: "#5A9EC9",
                                            description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Palabras Bloqueadas:** " + haste + "\n\u2007 **Limite:** " + system.list.length + "/5",
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
                                                .setCustomId(`antiWords listConfigs - ${msg.author.id}`)
                                                .setPlaceholder("Lista de configuraciones")
                                                .setOptions([
                                                    {
                                                        label: "Regresar",
                                                        value: "back",
                                                        emoji: "⏪"
                                                    },
                                                    {
                                                        label: "Añadir Palabras",
                                                        value: "add",
                                                        emoji: "🟢",
                                                        description: "Añade palabras a la lista"
                                                    },
                                                    {
                                                        label: "Remover Palabras",
                                                        value: "remove",
                                                        emoji: "🔴",
                                                        description: "Remueve palabras a la lista"
                                                    },
                                                    {
                                                        label: "Reestablecer Configuraciones",
                                                        value: "reset configs",
                                                        emoji: "🔄",
                                                        description: "Reestablece todas las configuraciones del sistema, incluyendo la lista de palabras"
                                                    }
                                                ])
                                        )
                                    ], files: ["./images/dbConfig-icon.png"]});
                                }
                            } else await msg.reply("`❌` | Las palabras seleccionadas ya estan en la lista.");
                        } else {
                            collector.stop();
                            const msgData = await msg.reply({content: "`✅` | La configuración ha sido cancelada.", embeds: [], components: [], files: []});
    
                            const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                            await wait(2200);
                            await msgData.edit({content: null, embeds: [
                                {
                                    author: {
                                        name: "SISTEMA ANTI-WORDS",
                                        icon_url: client.user.displayAvatarURL()
                                    },
                                    color: "#5A9EC9",
                                    description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007<:arrow_right:964247865943801887> **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007<:arrow_right:964247865943801887> **Palabras Bloqueadas:** " + haste + "",
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
                                        .setCustomId(`antiWords listConfigs - ${msg.author.id}`)
                                        .setPlaceholder("Lista de configuraciones")
                                        .setOptions([
                                            {
                                                label: "Regresar",
                                                value: "back",
                                                emoji: "⏪"
                                            },
                                            {
                                                label: "Añadir Palabras",
                                                value: "add",
                                                emoji: "🟢",
                                                description: "Añade palabras a la lista"
                                            },
                                            {
                                                label: "Remover Palabras",
                                                value: "remove",
                                                emoji: "🔴",
                                                description: "Remueve palabras a la lista"
                                            },
                                            {
                                                label: "Reestablecer Configuraciones",
                                                value: "reset configs",
                                                emoji: "🔄",
                                                description: "Reestablece todas las configuraciones del sistema, incluyendo la lista de palabras"
                                            }
                                        ])
                                )
                            ], files: ["./images/dbConfig-icon.png"]});
                        }
                    });
                } else return await inter.reply({content: "`❌` | La lista de palabras ya esta al limite. `(5/5)`", ephemeral: true});
            } else if(inter.values[0] === "remove") {
                const collector = inter.channel.createMessageCollector({filter: (m) => m.author.id === inter.user.id, time: 60000});
                await inter.update({content: "`⌛` | Para eliminar palabras, seleccionalas tal cual y separalas con `,`.\n\n\u2007 **Para Cancelar:** `cancel`\n\u2007 **Ejemplo:** `hola, mundo`", embeds: [], files: [], components: []}).catch(() => null);
    
                collector.on("collect", async (msg) => {
                    if(msg.content.toLowerCase() !== "cancel") {
                        const removeWords = msg.content.split(",");
                        const words = removeWords.map((word) => { if(system.list.find((i) => i.toLowerCase().trim() === word.toLowerCase().trim())) return word.toLowerCase().trim() }).filter((i) => i);
                    
                        if(words.length > 0) {
                            collector.stop();
                            for(i of words) { system.list.splice(system.list.indexOf(i), 1); }
    
                            const msgData = await msg.reply({content: "`✅` | Las palabras " + words.map((i) => `**${i}**`).join(", ") + " han sido eliminadas de la lista.", fetchReply: true});
                            await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                                systems: guildData.systems
                            });
    
                            const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                            await wait(2200);
                            await msgData.edit({content: null, embeds: [
                                {
                                    author: {
                                        name: "SISTEMA ANTI-WORDS",
                                        icon_url: client.user.displayAvatarURL()
                                    },
                                    color: "#5A9EC9",
                                    description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Palabras Bloqueadas:** " + haste + "\n\u2007 **Limite:** " + system.list.length + "/5",
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
                                        .setCustomId(`antiWords listConfigs - ${msg.author.id}`)
                                        .setPlaceholder("Lista de configuraciones")
                                        .setOptions([
                                            {
                                                label: "Regresar",
                                                value: "back",
                                                emoji: "⏪"
                                            },
                                            {
                                                label: "Añadir Palabras",
                                                value: "add",
                                                emoji: "🟢",
                                                description: "Añade palabras a la lista"
                                            },
                                            {
                                                label: "Remover Palabras",
                                                value: "remove",
                                                emoji: "🔴",
                                                description: "Remueve palabras a la lista"
                                            },
                                            {
                                                label: "Reestablecer Configuraciones",
                                                value: "reset configs",
                                                emoji: "🔄",
                                                description: "Reestablece todas las configuraciones del sistema, incluyendo la lista de palabras"
                                            }
                                        ])
                                )
                            ], files: ["./images/dbConfig-icon.png"]});
                        } else await msg.reply("`❌` | Las palabras seleccionadas no estan en la lista.");
                    } else {
                        collector.stop();
                        const msgData = await msg.reply({content: "`✅` | La configuración ha sido cancelada."});

                        const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                        await wait(2200);
                        await msgData.edit({content: null, embeds: [
                            {
                                author: {
                                    name: "SISTEMA ANTI-WORDS",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                color: "#5A9EC9",
                                description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Palabras Bloqueadas:** " + haste + "\n **Limite:** " + system.list.length + "/5",
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
                                    .setCustomId(`antiWords listConfigs - ${msg.author.id}`)
                                    .setPlaceholder("Lista de configuraciones")
                                    .setOptions([
                                        {
                                            label: "Regresar",
                                            value: "back",
                                            emoji: "⏪"
                                        },
                                        {
                                            label: "Añadir Palabras",
                                            value: "add",
                                            emoji: "🟢",
                                            description: "Añade palabras a la lista"
                                        },
                                        {
                                            label: "Remover Palabras",
                                            value: "remove",
                                            emoji: "🔴",
                                            description: "Remueve palabras a la lista"
                                        },
                                        {
                                            label: "Reestablecer Configuraciones",
                                            value: "reset configs",
                                            emoji: "🔄",
                                            description: "Reestablece todas las configuraciones del sistema, incluyendo la lista de palabras"
                                        }
                                    ])
                            )
                        ], files: ["./images/dbConfig-icon.png"]});
                    } 
                });
            } else if(inter.values[0] === "reset configs") {
                const msg = await inter.update({content: "`✅` | Todas las configuraciones del sistema han sido eliminadas.", embeds: [], components: [], files: [], fetchReply: true}).catch(() => null);

                system.isActived = false;
                system.list = [];
                await Guilds.updateOne({guildId: String(inter.guild.id)}, {
                    systems: guildData.systems
                });

                await wait(2200);
                const haste = await hastebin(`# ======================== #\n   PALABRAS BLOQUEADAS: ${system.list.length}\n# ======================== #\n${system.list.map((i, index) => `${index + 1}. ${i}`).join("\n")}`, { url: "https://paste.md-5.net", extension: "md" });
                await msg.edit({content: null, embeds: [
                    {
                        author: {
                            name: "SISTEMA ANTI-WORDS",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "Permite establecer palabras que seran bloquedas en los mensajes.\n\n\u2007 **Estado:** " + `${system.isActived === true ? "Activado" : "Desactivado"}` + "\n\u2007 **Palabras Bloqueadas:** " + haste + "\n\u2007 **Limite:** " + system.list.length + "/5",
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
                            .setCustomId(`antiWords listConfigs - ${inter.user.id}`)
                            .setPlaceholder("Lista de configuraciones")
                            .setOptions([
                                {
                                    label: "Regresar",
                                    value: "back",
                                    emoji: "⏪"
                                },
                                {
                                    label: "Añadir Palabras",
                                    value: "add",
                                    emoji: "🟢",
                                    description: "Añade palabras a la lista"
                                },
                                {
                                    label: "Remover Palabras",
                                    value: "remove",
                                    emoji: "🔴",
                                    description: "Remueve palabras a la lista"
                                },
                                {
                                    label: "Reestablecer Configuraciones",
                                    value: "reset configs",
                                    emoji: "🔄",
                                    description: "Reestablece todas las configuraciones del sistema, incluyendo la lista de palabras"
                                }
                            ])
                    )
                ], files: ["./images/dbConfig-icon.png"]});
            }
        }
    }
};