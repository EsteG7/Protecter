const Guilds = require("../database/Models/guilds.js");
const Users = require("../database/Models/users.js");
const Tickets = require("../database/Models/tickets.js");
const Panels = require("../database/Models/panels.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const wait = require("util").promisify(setTimeout);

module.exports = {
    name: "interactionCreate",
    run: async (client, inter) => {
        try {
            if(inter.guild && !inter.user.bot) {
                const guildData = await Guilds.findOne({guildId: String(inter.guild.id)});
                const customId = inter.customId.split(" - ")[0];

                if(guildData?.lang === "es") {
                    if(inter.isButton() && inter.customId === "verify") {
                        const system = guildData.systems.find((i) => i.name === "verification");

                        if(system?.isActived === true && guildData.premium.actived === true && system?.configsPremium.captchaInDM === true) {
                            const userData = await Users.findOne({guildId: String(inter.guild.id), userId: String(inter.user.id)});

                            if(userData?.captchaCompleted === true) {
                                await inter.member.roles.add(system.roles.add).catch(() => null);
                                await inter.member.roles.remove(system.roles.remove).catch(() => null);

                                await inter.reply({content: "`✅` | Gracias por verificarte!", ephemeral: true});
                            } else return await inter.reply({content: "`❌` | Primero debes completar el captcha enviado por mensaje privado. `(Si no se te envio nada, activa tus mensajes privados y vuelve a ingresar al servidor)`", ephemeral: true});
                        } else if(system?.isActived === true) {
                            await inter.member.roles.add(system.roles.add).catch(() => null);
                            await inter.member.roles.remove(system.roles.remove).catch(() => null);

                            await inter.reply({content: "`✅` | Gracias por verificarte!", ephemeral: true});
                        }
                    } else if(inter.isButton() && inter.customId === "create ticket") {
                        const panelData = await Panels.findOne({guildId: String(inter.message.guild.id), channelId: String(inter.message.channel.id), messageId: String(inter.message.id)});

                        if(panelData) {
                            if(!await Tickets.exists({guildId: String(inter.message.guild.id), userId: String(inter.user.id)})) {
                                const channel = await inter.guild.channels.create("📩┃ticket-" + inter.user.username.replace(/^[a-zA-Z0-9]+$/, "") + "", {
                                    type: "GUILD_TEXT",
                                    permissionOverwrites: [
                                        {
                                            id: String(inter.guild.roles.everyone.id),
                                            deny: ["VIEW_CHANNEL"]
                                        },
                                        {
                                            id: String(inter.user.id),
                                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                                        },
                                        {
                                            id: String(client.user.id),
                                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                                        }
                                    ].concat(panelData.accessRoles.map((i) => {
                                        return {
                                            id: i,
                                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                                        }
                                    }))
                                });

                                if(channel) {
                                    await inter.reply({content: "`✅` | Tu ticket " + channel.toString() + " ha sido creado.", ephemeral: true});
                                    await channel.send({content: "<:arrow_right:964247865943801887> **Usuario:**" + inter.user.toString() + "\n<:arrow_right:964247865943801887> **Soportes:** " + panelData.accessRoles.map((i) => `<@&${i}>`).join(", ") + "", embeds: [
                                        {
                                            author: {
                                                name: "TICKET DE SOPORTE",
                                                icon_url: "attachment://user-icon.png"
                                            },
                                            color: "#5A9EC9",
                                            description: "**Bienvenid@ a tu ticket de soporte.** Porfavor espera a que uno de nuestros soportes te responda.",
                                            thumbnail: {
                                                url: inter.user.displayAvatarURL({dynamic: true})
                                            },
                                            footer: {
                                                text: client.user.username,
                                                icon_url: client.user.displayAvatarURL()
                                            },
                                            timestamp: new Date()
                                        }
                                    ], files: ["./images/user-icon.png"], components: [
                                        new MessageActionRow()
                                            .setComponents(
                                                new MessageButton()
                                                    .setCustomId("ticket options")
                                                    .setEmoji("📘")
                                                    .setLabel("OPCIONES")
                                                    .setStyle("SECONDARY"),

                                                new MessageButton()
                                                    .setCustomId("ticket delete")
                                                    .setEmoji("⛔")
                                                    .setLabel("CERRAR TICKET")
                                                    .setStyle("DANGER")
                                            )
                                    ]});

                                    await Tickets.create({
                                        guildId: String(inter.guild.id),
                                        userId: String(inter.user.id),
                                        panelId: String(panelData.id),
                                        channelId: String(channel.id)
                                    });
                                } else return await inter.reply({content: "`❌` | No ha sido posible crear tu ticket.", ephemeral: true});
                            } else return await inter.reply({content: "`❌` | Ya tienes un ticket abierto.", ephemeral: true});
                        } else return await inter.reply({content: "`❌` | Este panel no es funcional.", ephemeral: true});
                    } else if(inter.isButton() && inter.customId === "ticket delete") {
                        const ticketData = await Tickets.findOne({guildId: String(inter.message.guild.id), channelId: String(inter.message.channel.id)})
                        const panelData = await Panels.findOne({guildId: String(inter.message.guild.id), id: String(ticketData?.id)});
                        const supportRoles = panelData.accessRoles?.map((i) => {
                            const rol = inter.guild.roles.cache.get(i);
                            if(rol) return i;
                        });

                        if(HasRol(inter.member, supportRoles) === true) {
                            await inter.reply("`✅` | El ticket se cerrará en **10 segundos**.");
                            await wait(10000);
                            await inter.channel.delete();

                            await Tickets.deleteOne({guildId: String(inter.guild.id), channelId: String(inter.channel.id)});
                        } else return await inter.reply({content: "`❌` | Tienes que tener algun rol de soporte para cerrar el ticket.", ephemeral: true});
                    } else if(inter.customId.split(" - ")[1] === inter.user.id) {
                        if(inter.isSelectMenu() && customId === `filter infractions`) {
                            require("./interactions/filterInfractions.js")(client, inter, customId, "es");
                        } else if(inter.isButton() && ["antiBots on", "antiBots off"].includes(customId)) {
                            require("./interactions/antiBots.js")(client, inter, customId, "es");
                        } else if(["antiWords on", "antiWords off", "antiWords configs", "antiWords listConfigs"].includes(customId)) {
                            require("./interactions/antiWords.js")(client, inter, customId, "es");
                        } else if(inter.isSelectMenu() && [`help menu`].includes(customId)) {
                            require("./interactions/helpMenu.js")(client, inter, customId, "es");
                        } else if(["verify on", "verify off", "verify configsList", "verify configs"].includes(customId)) {
                            require("./interactions/configVerify.js")(client, inter, customId, "es");
                        }
                    } else return await inter.reply({content: "`❌` | Este menu no lo puedes utilizar.", ephemeral: true});
                }
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};

const HasRol = (member, roles) => {
    try {
        let has = false;

        for(rol of roles) {
            if(member.roles.cache.has(rol)) has = true;
        }
        return has;
    } catch (error) {
        console.log('[ERROR] '.cyan + `${error.stack}`.red);
    };
};