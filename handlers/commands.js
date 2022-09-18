const fs = require("fs");
const path = require("path");

module.exports = async (client) => {
    try {
        const langs = await fs.readdirSync(path.resolve(__dirname + "/../commands/")).filter((files) => !files.endsWith(".js"));

        for(lang of langs) {
            const folders = await fs.readdirSync(path.resolve(__dirname + "/../commands/" + lang + "/")).filter((files) => !files.endsWith(".js"));
    
            for(folder of folders) {
                const files = await fs.readdirSync(path.resolve(__dirname + `/../commands/${lang}/${folder}`)).filter((files) => files.endsWith(".js"));
                
                for(file of files) {
                    const command = require(path.resolve(__dirname + `/../commands/${lang}/${folder}/${file}`));
                    client.commands.set(command.name?.toLowerCase() + `-${lang}`, command);
                }
            }
        }
    } catch (error) {
        console.log("[ERROR] ".cyan + `${error.stack}`.red);
    }
}