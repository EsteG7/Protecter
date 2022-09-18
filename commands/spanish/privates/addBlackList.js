const BlackList = require("../../../database/Models/blacklist.js");
const Owners = require("../../../configs.js").owners;
const Staffs = require("../../../database/Models/staffs.js");
const ms = require("ms");
const timeTraductor = { second: "segundo", seconds: "segundos", minute: "minuto", minutes: "minutos", hour: "hora", hours: "horas", day: "dia", days: "dias", week: "semana", weeks: "semanas", month: "mes", months: "meses", year: "año", years: "años" };

module.exports = {
    name: "addBlackList",
    description: "Permite bloquear las funciones del bot a un usuario.",
    usage: "addBlackList <USUARIO> [RAZÓN]",
    category: "private",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const authorData = await Staffs.findOne({userId: String(message.author.id)});

            if(Owners.includes(message.author.id) || authorData) {
                const reason = args.slice(2).join(" ") || "Actividad maliciosa";
                const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
                let time = ms(args[1] || 0);
                if(!time || time === "0ms") time = null; 

                if(user) {
                    if(user.id !== message.author.id && !Owners.includes(user.id)) {
                        if(!await BlackList.exists({userId: String(user.id)})) {
                            let index = 0;
    
                            await message.reply({embeds: [
                                {
                                    author: {
                                        name: "USUARIO BLOQUEADO",
                                        icon_url: "attachment://log-icon.png"
                                    },
                                    color: "#5A9EC9",
                                    description: "El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido bloqueado del bot por **" + reason + "**.\n\n\u2007<:arrow_right:964247865943801887> **Tiempo:** " + `${time === null ? "Indefinido" : ms(time, {long: true}).replaceAll(/\b(?:second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\b/gi, i => timeTraductor[i])}` + "\n\u2007<:arrow_right:964247865943801887> **Pruebas:** " + `${message.attachments.size > 0 ? message.attachments.map((i) => {
                                        index++
                                        return `[Imagen #${index}](${i.url})`;
                                    }).join(", ") : "Sin pruebas"}` + "",
                                    thumbnail: {
                                        url: "attachment://block-icon.png"
                                    },
                                    footer: {
                                        text: client.user.username,
                                        icon_url: client.user.displayAvatarURL()
                                    },
                                    timestamp: new Date()
                                }
                            ], files: ["./images/log-icon.png", "./images/block-icon.png"]});
    
                            await BlackList.create({
                                userId: String(user.id),
                                endAt: time === null ? null : String(Date.now() + time),
                                reason: reason,
                                photos: message.attachments.size > 0 ? message.attachments.map((i) => String(i.url)) : []
                            });
                        } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " ya esta bloqueado de los sistemas.");
                    } else return await message.reply("`❌` | No puedes hacer eso.");
                } else return await message.reply("`❌` | Debes mencionar algun usuario para bloquearlo.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "addBlackList <USUARIO> [RAZÓN]`");
            } else return await message.reply("`❌` | Este comando solo puede ser ejecutado por un administrador o staff del bot.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};