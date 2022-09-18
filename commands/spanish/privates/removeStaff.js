const Staffs = require("../../../database/Models/staffs.js");
const Owners = require("../../../configs.js").owners;

module.exports = {
    name: "removeStaff",
    description: "Permite remover algun usuario del personal del bot.",
    usage: "removeStaff <USUARIO>",
    category: "private",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            if(Owners.includes(message.author.id)) {
                const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);

                if(user) {
                    if(await Staffs.exists({userId: String(user.id)})) {
                        await message.reply("`✅` | El " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + " ha sido removido del personal del bot.");
                        await Staffs.deleteOne({userId: String(user.id)});
                    } else return await message.reply("`❌` | El " + `${user.bot ? "bot" : "usuario"}` + " no es staff.");
                } else return await message.reply("`❌` | Debes mencionar algun usuario para removerlo.\n\n<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "removeStaff <USUARIO>`");
            } else return await message.reply("`❌` | Este comando solo puede ser ejecutado por un administrador del bot.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};