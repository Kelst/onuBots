const axios = require('axios').default;
const User=require("../models/User")
module.exports = async function (req) {
    const userName=req.userName;
    let userN= await User.find({userName:userName})
    return userN;
}