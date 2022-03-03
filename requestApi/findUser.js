const axios = require('axios').default;
const User=require("../models/User")
module.exports = async function (req) {
    const userTelegram_nik=req.userTelegram_nik;
    let userN= await User.find({userTelegram_nik:userTelegram_nik})
    return userN;
}