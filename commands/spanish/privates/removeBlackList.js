const BlackList = require("../../../database/Models/blacklist.js");
const Owners = require("../../../configs.js").owners;
const Staffs = require("../../../database/Models/staffs.js");

module.exports = {
    name: "removeBlackList",
    description: "Permite remover usuarios de la blacklist.",
    usage: "removeBlackList <USUARIO>",
    category: "private",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const authorData = await Staffs.findOne({userId: String(message.author.id)});

            if(Owners.includes(message.author.id) || authorData) {
                const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);

                if(user) {
                    if(await BlackList.exists({userId: String(user.id)})) {
                        await message.reply("`✅` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido removido de la blacklist.");
                        await BlackList.deleteOne({userId: String(user.id)});
                    } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " no esta bloqueado de los sistemas.");
                } else return await message.reply("`❌` | Debes mencionar algun usuario para removerlo.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "removeBlackList <USUARIO>`");
            } else return await message.reply("`❌` | Este comando solo puede ser ejecutado por un administrador o staff del bot.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};