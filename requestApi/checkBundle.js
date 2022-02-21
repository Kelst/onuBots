const axios = require('axios').default;
const App=require("../models/App")
module.exports = async function (bundle) {
    const app= await App.find({bundle:bundle});
    return (app);




}