const Guilds = require("../database/Models/guilds.js");
const { CaptchaGenerator } = require("captcha-canvas");
const { writeFileSync } = require('fs');
const path = require("path");
const listWords = "abcdefghijqlmnñopqrstuvwxyz0123456789@#?+ABCDEFGHIJKLMNÑOPQRSTUVWYZ";
const wait = require("util").promisify(setTimeout);
const Users = require("../database/Models/users.js");

module.exports = {
    name: "guildMemberAdd",
    run: async (client, member) => {
        const guildData = await Guilds.findOne({guildId: String(member.guild.id)});
        const userData = await Users.findOne({guildId: String(member.guild.id), userId: String(member.user.id)});

        if(guildData?.lang === "es") {
            if(guildData.premium.actived === true) {
                // SYSTEM • ANTI-BOTS
                const systemAntiBots = guildData.systems.find((i) => i.name === "antiBots");
                if(systemAntiBots?.isActived === true && member.user.bot === true) {
                    const flags = (await member.user.fetchFlags()).toArray();
                    
                    if(!flags.includes("VERIFIED_BOT")) await member.kick("SISTEMA ANTI-BOTS • Bot no verificado");
                }
    
                // SYSTEM • VERIFICATION
                const systemVerify = guildData.systems.find((i) => i.name === "verification");
                const channel = await member.guild.channels.fetch(systemVerify?.channel).catch(() => null);
                if(systemVerify?.isActived === true && channel && !channel.size) {
                    if(systemVerify.configsPremium.captchaInDM === true) {
                        const captcha = new CaptchaGenerator()
                            .setDimension(100, 400) 
                            .setCaptcha({text: (await GenCoder()), size: 50, color: "#5A9EC9"})
                            .setDecoy({opacity: 0.5})
                            .setTrace({color: "#5A9EC9"});
                        const buffer = captcha.generateSync();
                        writeFileSync(path.resolve(__dirname + "/../captcha.png"), buffer);
        
                        const msg = await member.send({embeds: [
                            {
                                author: {
                                    name: "SISTEMA DE VERIFICACIÓN",
                                    icon_url: "attachment://captcha-icon.png"
                                },
                                color: "#5A9EC9",
                                description: "<:arrow_right:964247865943801887> Porfavor, escribe este codigo en el chat para seguir con el siguiente paso.",
                                image: {
                                    url: "attachment://captcha.png"
                                },
                                thumbnail: {
                                    url: member.user.displayAvatarURL({dynamic: true})
                                },
                                timestamp: new Date()
                            }
                        ], files: ["./images/captcha-icon.png", "captcha.png"]});
        
                        const collector = msg.channel.createMessageCollector({filter: (m) => m.author.id === member.user.id, time: 300000});
                        collector.on("collect", async (m) => {
                            if(m.content === captcha.text) {
                                collector.stop();

                                if(userData) {
                                    await Users.updateOne({guildId: String(member.guild.id), userId: String(member.user.id)}, {
                                        captchaCompleted: true
                                    });
                                } else await Users.create({
                                    guildId: String(member.guild.id),
                                    userId: String(member.user.id),
                                    captchaCompleted: true
                                });

                                await m.reply("`✅` | Has completado el captcha!. Ahora presiona el boton del mensaje de verificación en el servidor.");
                            } else await m.reply("`❌` | El codigo es incorrecto, intenta nuevamente.");
                        });

                        collector.on("end", async (collected, reason) => {
                            if(reason === "time") await member.send("`❌` | El tiempo de espera se agotó.. Para volver a completas el captcha sal y entra del servidor.");
                        });
                    }
                }
            } else {

            }
        }
    }
};

const GenCoder = async () => {
    let code = "";
    const coderString = listWords.split("");

    for(let i = 0; i <= 5; i++) {
        code += coderString[Math.floor(Math.random() * coderString.length)];
    }
    
    return code;
};