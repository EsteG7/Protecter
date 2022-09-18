const Staffs = require("../../../database/Models/staffs.js");
const Owners = require("../../../configs.js").owners;

module.exports = {
    name: "embed",
    description: "Crea un mensaje embed.",
    usage: "embed <json>",
    category: "private",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            if(Owners.includes(message.author.id) || await Staffs.exists({userId: String(message.author.id)})) {
                const object = args.slice(0).join(" ");

                if(object) {
                    if(isJsonString(object) === true) {
                        const json = JSON.parse(object);

                        await message.delete();
                        await message.channel.send({content: json.content, embeds: json.embeds, files: json.attachments}).catch((error) => {
                            console.log('[ERROR] '.cyan + `${error.stack}`.red);
                        });
                    } else return await message.reply("`❌` | El Json no es valido.");
                } else return await message.reply("`❌` | Tienes que enviar un objeto json.\n\n\u2007<:arrow_right:964247865943801887> **Crear Embed:** `https://discohook.org/`");
            } else return await message.reply("`❌` | Este comando solo lo puede usar el personal del bot.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};

const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};