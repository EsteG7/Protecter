const Backups = require("../../../database/Models/backups.js");

module.exports = {
    name: "backup-remove",
    description: "Elimina una de tus backups seleccionada.",
    usage: "backup-remove <backup-list>",
    category: "premium",
    lang: "es",
    requeriments: {
        userPerms: ["ADMINISTRATOR"],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            if(guildData.premium.actived === true) {
                const id = args[0];

                if(id) {
                    if(await Backups.exists({userId: String(message.author.id), id: id})) {
                        await Backups.deleteOne({userId: String(message.author.id), id: id});
                        await message.reply("`✅` | El backup **" + id + "** ha sido eliminado.");
                    } else return await message.reply("`❌` | No se encontraron los datos del backup seleccionado.");
                } else return await message.reply("`❌` | Debes seleccionar la ID de tu backup a eliminar.");
            } else return await message.reply("`❌` | El servidor necesita ser premium para esta función.");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};