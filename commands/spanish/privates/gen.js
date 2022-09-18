const Codes = require("../../../database/Models/codes.js");
const Owners = require("../../../configs.js").owners;
const listWords = "abcdefghijqlmnñopqrstuvwxyz0123456789@#?+ABCDEFGHIJKLMNÑOPQRSTUVWYZ";
const ms = require("ms");
const Staffs = require("../../../database/Models/staffs.js");

module.exports = {
    name: "gen",
    description: "Permite generar un codigo premium temporal o indefinidamente..",
    usage: "gen [TIEMPO]",
    category: "private",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const authorData = await Staffs.findOne({userId: String(message.author.id)});

            if(Owners.includes(message.author.id) || authorData) {
                const time = ms(args[0]?.toLowerCase() || 0);
                const code = await GenCoder(client, time);

                await message.reply({embeds: [
                    {
                        author: {
                            name: "CODIGO GENERADO",
                            icon_url: "attachment://diamond-icon.png"
                        },
                        color: "#5A9EC9",
                        description: "Se a generado un nuevo codigo premium.\n\n<:arrow_right:964247865943801887> **Codigo:** `" + code + "`\n<:arrow_right:964247865943801887> **Termina:** " + `${time && time !== "0ms" ? `<t:${Math.floor((Date.now() + time) / 1000)}:R>` : "Permanente"}` + "",
                        thumbnail: {
                            url: "attachment://diamond-icon.png"
                        },
                        footer: {
                            text: client.user.username,
                            icon_url: client.user.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                ], files: ["./images/diamond-icon.png"]});
            } else return await message.reply("`❌` | Este comando solo puede ser ejecutado por un administrador o staff del bot.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};

const GenCoder = async (client, time) => {
    let code = "";
    const coderString = listWords.split("");

    for(let i = 0; i <= 30; i++) {
        code += coderString[Math.floor(Math.random() * coderString.length)];
    }
    
    if(await Codes.exists({code: code})) {
        GenCoder(client, time);
    } else {
        await Codes.create({
            code: code,
            uses: 0,
            endAt: null,
            time: time && time !== "0ms" ? time : null
        });
        return code;
    }
};