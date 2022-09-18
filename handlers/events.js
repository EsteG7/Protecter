const fs = require("fs");
const path = require("path");

module.exports = async (client) => {
    try {
        const eventsDir = await fs.readdirSync(path.resolve(__dirname + "/../events/")).filter((files) => files.endsWith('.js'));
            
        for(eventFile of eventsDir) {
            const event = require(path.resolve(__dirname + "/../events/" + eventFile + ""));
            client.on(event.name, event.run.bind(event, client));
        }
    } catch (error) {
        console.log("[ERROR] ".cyan + `${error.stack}`.red);
    }
}