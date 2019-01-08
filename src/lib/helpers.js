const helpers = {}
const bcrpt = require('bcryptjs');

helpers.encrypPassword = async (password) => {
    const salt = await bcrpt.genSalt(10);
    const hash = await bcrpt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async (password , savePassword) => {
    try {
        return await bcrpt.compare(password , savePassword);
    } catch (e) {
        console.log(e)
    }   
};

module.exports = helpers;