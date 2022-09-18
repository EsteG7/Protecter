const flags = {
    "DISCORD_EMPLOYEE": "<:DISCORD_STAFF:957776671367385162>",
    "PARTNERED_SERVER_OWNER": "<:DISCORD_PARTNER:957776671606452225>",
    "HYPESQUAD_EVENTS": "<:HYPESQUAD_EVENT:957776671627431986>",
    "BUGHUNTER_LEVEL_1": "<:BUG_HUNTER:957776670981500929>",
    "HOUSE_BRAVERY": "<:HYPESQUAD_BRAVERY:957776671644196885>",
    "HOUSE_BRILLIANCE": "<:HYPESQUAD_BRILLIANCE:957776671589695589>",
    "HOUSE_BALANCE": "<:HYPESQUAD_BALANCE:957776671275102269>",
    "EARLY_SUPPORTER": "<:EARLY_SUPPORTER:957776671476428820>",
    "TEAM_USER": "<:DISCORD_STAFF:957776671367385162>",
    "BUGHUNTER_LEVEL_2": "<:BUG_HUNTER_LEVEL_2:957776671300288522>",
    "VERIFIED_BOT": "<:BOT_VERIFIED:957776671681941594>",
    "EARLY_VERIFIED_BOT_DEVELOPER": "<:VERIFIED_BOT_DEVELOPER:957776671627431956>",
    "DISCORD_CERTIFIED_MODERATOR": "<:DISCORD_CERTIFIED_MODERATOR:957776671585501234>",
    "BOT_HTTP_INTERACTIONS": "<:VERIFIED_BOT_DEVELOPER:957776671627431956>",
    "SERVER_OWNER": "<:SERVER_OWNER:957776671614828584>",
    "NITRO": "<:NITRO:957776671493210183>"
};

module.exports = {
    name: "userInfo",
    description: "Muestra la información de un usuario.",
    usage: "userInfo <USUARIO>",
    category: "utility",
    lang: "es",
    requeriments: {
        userPerms: [],
        botPerms: []
    },
    run: async (client, message, args, command, guildData) => {
        try {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
            const member = await message.guild.members.fetch(user.id).catch(() => null);
            const flagsList = user.flags.toArray();

            if(member && !member.size && message.guild.ownerId === user.id) flagsList.push("SERVER_OWNER");

            if(user) {
                await message.reply({content: "`✅` | Esta es la información del " + `${user.bot ? "bot" : "usuario"}` + " " + user.toString() + ".", embeds: [
                    {
                        author: {
                            name: user.username.toUpperCase(),
                            icon_url: user.displayAvatarURL({dynamic: true})
                        },
                        color: "#5A9EC9",
                        description: `**Nombre:** ${user.tag}\n**Cuenta Creada:** <t:${Math.floor(user.createdTimestamp / 1000)}:R>${`${member && !member.size ? `\n**Ingreso Al Servidor:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : ""}`}\n**Insignias:** ${flagsList.map((i) => flags[i]).join(", ")}`,
                        thumbnail: {
                            url: user.displayAvatarURL({dynamic: true})
                        },
                        footer: {
                            text: client.user.username,
                            icon_url: client.user.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                ]});
            } else return await message.reply("`❌` | Debes mencionar o seleccionar por su ID a un usuario.\n\n\u2007**Uso:** `" + guildData.prefix + "userInfo <USUARIO>`");
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};