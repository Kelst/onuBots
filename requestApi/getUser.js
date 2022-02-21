const axios = require('axios').default;
const User=require("../models/User")
module.exports = async function (req) {
    
    let userN= await User.findOne({userIdTelegram:req})
    return userN;
}