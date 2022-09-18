const Owners = require("../../../configs.js").owners;
const Staffs = require("../../../database/Models/staffs.js");

module.exports = {
    name: "eval",
    description: "Permite hacer una operación.",
    usage: "eval <OPERACIÓN>",
    category: "private",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            if(Owners.includes(message.author.id) || await Staffs.exists({userId: String(message.author.id)})) {
                const evaled = await eval(args.slice(0).join(" "));
                const cleaned = await clean(evaled);

                await message.reply({embeds: [
                    {
                        author: {
                            name: "EVALUADOR",
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "<:arrow_right:964247865943801887> **Resultado:**\n```js\n" + cleaned + "\n```",
                        footer: {
                            text: client.user.username,
                            icon_url: client.user.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                ]});
            } else return await message.reply("`❌` | Este comando solo es para el personal del bot.");
        } catch (error) {
            await message.reply({embeds: [
                {
                    author: {
                        name: "EVALUADOR",
                        icon_url: client.user.displayAvatarURL()
                    },
                    color: "#5A9EC9",
                    description: "<:arrow_right:964247865943801887> **Error:**\n```js\n" + error + "\n```",
                    footer: {
                        text: client.user.username,
                        icon_url: client.user.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            ]});
        };
    }
};

const clean = async (text) => {
    if(text && text.constructor.name == "Promise") text = await text;

    if(typeof text !== "string") text = require("util").inspect(text, { depth: 1 });
    
    text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    
    return text;
}