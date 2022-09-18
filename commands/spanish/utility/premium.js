const Guilds = require("../../../database/Models/guilds.js");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const Codes = require("../../../database/Models/codes.js");
const wait = require("util").promisify(setTimeout);

module.exports = {
    name: "premium",
    description: "Permite activar el modo premium del bot en el servidor.",
    usage: "premium <CODIGO>",
    category: "utility",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            if(message.guild.ownerId === message.author.id) {
                if(guildData.premium.actived === false) {
                    const code = args.slice(0).join(" ");
                    const codeData = await Codes.findOne({code: code});

                    if(codeData) {
                        const msg = await message.reply("`✅` | Tu servidor ahora es parte del grupo premium!");
                        await Guilds.updateOne({guildId: String(message.guild.id)}, {
                            premium: {
                                actived: true,
                                endAt: codeData.time !== null ? String(Date.now() + Number(codeData.time)) : null
                            }
                        });
                        await Codes.updateOne({code: code}, { uses: codeData.uses++, endAt: codeData.time !== null ? String(Date.now() + Number(codeData.time)) : null });

                        await wait(1500);
                        await msg.edit({content: null, embeds: [
                            {
                                author: {
                                    name: "PREMIUM ACTIVADO",
                                    icon_url: "attachment://star-icon.png"
                                },
                                color: "#5A9EC9",
                                description: "¡Muchas gracias por tu aporte!\n\n<:arrow_right:964247865943801887> **Termina:** " + `${codeData.time !== null ? `<t:${Math.floor((Date.now() + Number(codeData.time)) / 1000)}:R>` : "Nunca"}` + "",
                                thumbnail: {
                                    url: "attachment://star-icon.png"
                                },
                                footer: {
                                    text: client.user.username,
                                    icon_url: client.user.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        ], files: ["./images/star-icon.png"]});
                    } else return await message.reply("`❌` | El codigo es incorrecto.");
                } else return await message.reply("`❌` | El servidor ya tiene el modo premium activado.");
            } else return await message.reply("`❌` | Solo el dueño del servidor puede ejecutar este comando.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};