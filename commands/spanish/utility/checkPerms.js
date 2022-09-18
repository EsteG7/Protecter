const Guilds = require("../../../database/Models/guilds.js");

module.exports = {
    name: "checkPerms",
    description: "Muestra los permisos que tiene el bot en el servidor.",
    usage: "checkPerms [PERMISO]",
    category: "utility",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message) => {
        try {
            const list = message.guild.me.permissions.toArray();

            await message.reply({embeds: [
                {
                    author: {
                        name: "LISTA DE PERMISOS",
                        icon_url: client.user.displayAvatarURL()
                    },
                    color: "#5A9EC9",
                    description: "Estos son todos los permisos que tengo actualmente en **" + message.guild.name + "**.\n\n" + list.map((i, index) => "\u2007`" + (index + 1) + ".` " + i + "").join("\n") + "",
                    thumbnail: {
                        url: client.user.displayAvatarURL()
                    },
                    footer: {
                        text: client.user.username,
                        icon_url: client.user.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            ]});
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};