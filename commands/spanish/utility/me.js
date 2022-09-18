const BlackList = require("../../../database/Models/blacklist.js");

module.exports = {
    name: "me",
    description: "Muestra tu información si estas en la lista negra.",
    usage: "me",
    category: "utility",
    lang: "es",
    requeriments: {
        userPerms: [],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const userData = await BlackList.findOne({userId: String(message.author.id)});

            if(userData) {
                if(userData.endAt !== null) {
                    await message.reply({embeds: [
                        {
                            author: {
                                name: "LISTA NEGRA",
                                icon_url: "attachment://log-icon.png"
                            },
                            color: "#5A9EC9",
                            description: "Se te ha bloqueado del bot por **" + userData.reason + "**.\n\n\u2007<:arrow_right:964247865943801887> **Expira:** <t:" + Math.floor(userData.endAt / 1000) + ":R>\n\u2007<:arrow_right:964247865943801887> **Pruebas:** " + `${userData.photos.length > 0 ? userData.photos.map((i, index) => `[Imagen #${index + 1}](${i})`).join(", ") : "Sin pruebas"}` + "",
                            thumbnail: {
                                url: message.author.displayAvatarURL({dynamic: true})
                            },
                            footer: {
                                text: client.user.username,
                                icon_url: client.user.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    ]});
                } else return await message.reply("`❌` | Los usuarios bloqueados indefinidamente no pueden usar comandos.");
            } else return await message.reply("`❌` | No estas en la lista negra.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};