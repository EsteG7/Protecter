const wait = require("util").promisify(setTimeout);

module.exports = {
    name: "invite",
    description: "Genera una invitación para invitarme a tu servidor.",
    usage: "invite",
    category: "utility",
    lang: "es",
    requeriments: {
        userPerms: [],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const msg = await message.reply("`⌛` | Generando invitación...");
            const invite = await client.generateInvite({
                scopes: ["bot"],
                permissions: ["ADMINISTRATOR"]
            });
            await wait(1000);
            await msg.edit({content: null, embeds: [
                {
                    description: "`✅` | **Invitación:** [https://discord.com/invite-bot/protecter](" + invite + ")",
                    color: "DARK_BUT_NOT_BLACK"
                }
            ]});
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};