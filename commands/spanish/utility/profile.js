const Users = require("../../../database/Models/users.js");

module.exports = {
    name: "profile",
    description: "Muestra tu perfil.",
    usage: "profile [usuario]",
    category: "utility",
    lang: "es",
    requeriments: {
        userPerms: [],
        botPerms: []
    },
    run: async (client, message) => {
        try {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);

            if(user) {

            } else {
                const userData = await Users.findOne({userId: String(message.author.id)});
                
                await message.reply({embeds: [
                    {
                        author: {
                            name: message.author.username.toUpperCase(),
                            icon_url: message.author.displayAvatarURL({dynamic: true})
                        },
                        color: "#5A9EC9",
                        description: "",
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
            }
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};