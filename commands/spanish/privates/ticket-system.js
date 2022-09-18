const Staffs = require("../../../database/Models/staffs.js");
const Owners = require("../../../configs.js").owners;
const Panels = require("../../../database/Models/panels.js");
const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    name: "ticket-system",
    description: "Configura el sistema de tickets.",
    usage: "ticket-system <CANAL> <ROLES-STAFF>",
    category: "private",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            if(Owners.includes(message.author.id) || await Staffs.exists({userId: String(message.author.id)})) {
                const channel = message.mentions.channels.first() || await message.guild.channels.fetch(args[0]).catch(() => null);

                if(channel && !channel.size) {
                    const roles = message.mentions.roles;

                    const sended = await channel.send({embeds: [
                        {
                            author: {
                                name: "SISTEMA DE TICKETS",
                                icon_url: "attachment://ticket-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "Para crear un ticket, presiona el boton de este mensaje.",
                            thumbnail: {
                                url: "attachment://user-icon.png"
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
                                    .setCustomId("create ticket")
                                    .setEmoji("📩")
                                    .setLabel("CREAR TICKET")
                                    .setStyle("SUCCESS")
                            )
                    ], files: ["./images/ticket-icon.png", "./images/user-icon.png"]}).catch(() => null);

                    if(sended) {
                        await message.reply("`✅` | El sistema de tickets a sido establecido.\n\n\u2007<:arrow_right:964247865943801887> **Canal Establecido:** " + channel.toString() + "\n\u2007<:arrow_right:964247865943801887> **Roles De Soporte:** " + `${roles.size > 0 ? roles.map((i) => i.toString()).join(", ") : "Sin establecer"}` + "");

                        await Panels.create({
                            guildId: String(message.guild.id),
                            id: String(await Panels.count({guildId: String(message.guild.id)}) + 1),
                            messageId: String(sended.id),
                            channelId: String(channel.id),
                            accessRoles: roles.size > 0 ? roles.map((i) => String(i.id)) : []
                        });
                    } else return await message.reply("`❌` | No ha sido posible enviar el panel al canal mencionado.");
                } else return await message.reply("`❌` | Debes seleccionar algun canal donde se enviara el panel.\n\n\u2007<:arrow_right:964247865943801887> **Uso Correcto:** `" + guildData.prefix + "ticket-system <CANAL> <ROLES DE SOPORTE>`");
            } else return await message.reply("`❌` | Solo el personal del bot puede ejecutar este comando.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};