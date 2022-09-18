const { connect } = require("mongoose");

module.exports = async (client) => {
    try {
        if(client.configs.dbLink !== null) {
            await connect(`${client.configs.dbLink}`);
            console.log("[DATABASE] ".cyan + "Base De Datos Conectada.");
        }
        } catch (error) {
        console.log("[ERROR] ".cyan + `${error.stack}`.red);
    }
};