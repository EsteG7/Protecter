const Owners = require("../../../configs.js").owners;
const Staffs = require("../../../database/Models/staffs.js");

module.exports = {
    name: "audit-logs",
    description: "Permite obtener los registros de auditoria de algun servidor.",
    usage: "audit-logs <SERVIDOR> [LIMITE] [FILTRO]",
    category: "private",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const authorData = await Staffs.findOne({userId: String(message.author.id)});

            if(Owners.includes(message.author.id) || authorData) {
                const guild = await client.guilds.fetch(args[0]).catch(() => null);

                if(guild && !guild.size) {
                    if(guild.me.permissions.has("VIEW_AUDIT_LOG")) {
                        const limit = args[1];

                        const auditLogs = await guild.fetchAuditLogs({
                            limit: limit && !isNaN(limit) && limit % 1 === 0 ? limit : 10
                        });

                        if(auditLogs.entries.size > 0) {
                            await message.reply({embeds: [
                                {
                                    author: {
                                        name: "REGISTROS DE: \u2007" + guild.name.toUpperCase(),
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "Mostrando " + `${auditLogs.entries.size === 1 ? "**1** registro." : "**" + auditLogs.entries.size + "** registros."}` + "",
                                    fields: [
                                        {
                                            name: "ACCIÓN\u2007\u2007\u2007\u2007\u2007\u2007\u2007",
                                            value: auditLogs.entries.map((i) => "\u2007`" + i.action + "`").join("\n"),
                                            inline: true
                                        },
                                        {
                                            name: "USUARIO",
                                            value: auditLogs.entries.map((i) => `\u2007<@${i.executor.id}>`).join("\n"),
                                            inline: true
                                        }
                                    ],
                                    thumbnail: {
                                        url: guild.iconURL({dynamic: true})
                                    },
                                    footer: {
                                        text: client.user.username,
                                        icon_url: client.user.displayAvatarURL()
                                    },
                                    timestamp: new Date()
                                }
                            ]});
                        } else return message.reply("`❌` | No pude obtener los registros.");
                    } else return await message.reply("`❌` | No tengo permisos de ver los registros en el servidor seleccionado.");
                } else return await message.reply("`❌` | Debes seleccionar algun servidor para ver sus registros.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "audit-logs <SERVIDOR> [LIMITE] [FILTRO]`");
            } else return await message.reply("`❌` | Este comando solo puede ser ejecutado por un administrador o staff del bot.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};