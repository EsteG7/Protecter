const stringSimilarity = require("string-similarity");
const wait = require("util").promisify(setTimeout);

module.exports = async (client, message, guildData) => {
    try {
        const system = guildData?.systems.find((i) => i.name === "antiWords");
    
        if(system?.isActived === true && system?.list.length > 0) {
            const finded = message.content.toLowerCase().split(" ").find((i) => {
                for(word of system.list) {
                    const similarity = stringSimilarity.compareTwoStrings(i.toLowerCase().trim(), word.toLowerCase().trim())
        
                    if(similarity >= 0.7) return true;
                }
            });
            
            if(finded) {
                await wait(200);
                if(guildData.premium.actived === true) {
                    await message.delete().catch(() => null);

                    if(system.configsPremium.notifyUserInChannel === true) {
                        const msg = await message.channel.send({embeds: [
                            {
                                author: {
                                    name: "ADVERTENCIA",
                                    icon_url: "attachment://exclamation-icon.png"
                                },
                                color: "#5A9EC9",
                                description: "Oye " + message.author.toString() + ", se añadio una advertencia a tu perfil.\n\n\u2007<:arrow_right:964247865943801887> **Razón:** Tu mensaje contiene una palabra bloqueada.",
                                thumbnail: {
                                    url: message.author.displayAvatarURL({dynamic: true}),
                                },
                                footer: {
                                    text: client.user.username + " Premium",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        ], files: ["./images/exclamation-icon.png"]});

                        await wait(5000);
                        await msg.delete().catch(() => null);
                    };

                    if(system.configsPremium.notifyUserInMD === true) {
                        await message.member.send({embeds: [
                            {
                                author: {
                                    name: "HAS SIDO ADVERTIDO",
                                    icon_url: "attachment://exclamation-icon.png"
                                },
                                color: "#5A9EC9",
                                description: "Se añadio una advertencia a tu perfil en el servidor **" + message.guild.name + "**.\n\n\u2007<:arrow_right:964247865943801887> **Razón:** Tu mensaje contiene una palabra bloqueada.\n\u2007<:arrow_right:964247865943801887> **Palabra Bloqueada:** " + finded + "",
                                thumbnail: {
                                    url: message.author.displayAvatarURL({dynamic: true}),
                                },
                                footer: {
                                    text: client.user.username + " Premium",
                                    icon_url: client.user.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        ], files: ["./images/exclamation-icon.png"]}).catch(() => null);
                    }
                } else await message.delete().catch(() => null);
            }
        }
    } catch (error) {
        console.log('[ERROR] '.cyan + `${error.stack}`.red);
    };
};