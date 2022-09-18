const Guilds = require("../database/Models/guilds.js");
const langs = { "es": "spanish", "en": "english" };
const BlackList = require("../database/Models/blacklist.js");

module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        try {
            if(message.author.id !== client.user.id) {
                if(message.guild) {
                    const guildData = await Guilds.findOne({guildId: String(message.guild.id)});
    
                    if(guildData) {
                        if(!message.member?.permissions.has("ADMINISTRATOR")) require("./systems/antiWords.js")(client, message, guildData);
            
                        if(message.content.toLowerCase().startsWith(guildData.prefix.toLowerCase()) && !message.author.bot) {
                            const args = message.content.slice(guildData.prefix.length).trim().split(/ +/g);
                            const cmd = args.shift().toLowerCase();
                            const command = client.commands.get(cmd + `-${langs[guildData.lang]}`);
                            const userData = await BlackList.findOne({userId: String(message.author.id)});

                            if(cmd?.length !== 0) {
                                if(command) {
                                    if(cmd === "me" && userData) {
                                        await message.channel.sendTyping();
                                        return command.run(client, message, args, command, guildData);
                                    }

                                    if(!userData) {
                                        if(message.guild.me.permissions.has(command.requeriments.botPerms)) {
                                            if(message.member.permissions.has(command.requeriments.userPerms)) {
                                                await message.channel.sendTyping();
                                                return command.run(client, message, args, command, guildData);
                                            } else return await message.reply("`❌` | No tienes los permisos necesarios para ejecutar el comando.");
                                        } else return await message.reply("`❌` | No tengo los permisos necesarios para ejecutar el comando.");
                                    } else return await message.reply("`❌` | Estas bloqueado del bot. Para mas información ejecuta `" + guildData.prefix + "!me`");
                                } else return await message.reply("`❌` | El comando seleccionado no existe.");
                            } else {
                                const command = client.commands.get(`help-${langs[guildData.lang]}`);
                                await message.channel.sendTyping();
                                return command.run(client, message, args, command, guildData);
                            }
                        } else if(message.mentions.users.first()?.id === client.user.id && message.content.startsWith("<@") && message.content.endsWith(">")) {
                            const command = client.commands.get(`help-${langs[guildData.lang]}`);
                            await message.channel.sendTyping();
                            return command.run(client, message, args, command, guildData);
                        }
                    } else return await message.reply("`❌` | El servidor no esta registrado en la base de datos para su funcionamiento.\n\n\u2007**Solución:** `Contacta con algun administrador del bot.`");
                
                }
            }
        } catch (error) {
            console.log("[ERROR] ".cyan + `${error.stack}`.red);
        }
    }
}