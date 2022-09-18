/* =====> REQUERIMENTS & CONSTANTS <===== */
require("colors");
const Discord = require("discord.js");
const client = new Discord.Client({intents: 130767, partials: ["MESSAGE", "CHANNEL", "REACTION"]});
/* =====> COLLECTIONS & CONSTANTS <=====*/
client.configs = require("./configs.js").configs;
client.commands = new Discord.Collection();

const Loader = async () => {    
    /* =====> DATABASE <===== */
    await require("./database/connect.js")(client);
    
    /* =====> HANDLERS <===== */
    require("./handlers/commands.js")(client);
    require("./handlers/events.js")(client);
    
    /* =====> LOGIN <===== */
    client.login(client.configs.token).catch((error) => console.log("[ERROR] ".cyan + `${error.stack}`.red));
};
Loader();