const Tickets = require("../database/Models/tickets.js");

module.exports = {
    name: "channelDelete",
    run: async (client, channel) => {
        try {
            if(await Tickets.exists({guildId: String(channel.guild.id), channelId: String(channel.id)})) await Tickets.deleteOne({guildId: String(channel.guild.id), channelId: String(channel.id)});
        } catch (error) {
            console.log('[ERROR] '.cyan + `${error.stack}`.red);
        };
    }
};