const categories = {
    "utility": "Utilidad",
    "moderation": "Moderación",
    "configuration": "Configuración",
    "premium": "Premium",
    "private": "Privado"
}

module.exports = {
    name: "command",
    description: "Muestra la información del comando seleccionado.",
    usage: "command <COMANDO>",
    category: "utility",
    lang: "es",
    requeriments: {
        userPerms: [],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const command = client.commands.get(`${args[0]?.toLowerCase()}-spanish`);

            if(command) {
                await message.reply({embeds: [
                    {
                        author: {
                            name: "COMANDO: \u2007" + command.name.toUpperCase(),
                            icon_url: client.user.displayAvatarURL()
                        },
                        color: "#5A9EC9",
                        description: "" + command.description + "\n\n\u2007<:arrow_right:964247865943801887> **Uso:** `" + guildData.prefix + "" + command.usage + "`\n\u2007<:arrow_right:964247865943801887> **Categoria:** `" + command.category.replaceAll(/moderation|configuration|utility|private|premium/gi, (m) => categories[m]) + "`",
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
            } else return await message.reply("`❌` | Debes seleccionar algun comando disponible.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};