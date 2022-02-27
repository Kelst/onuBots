const axios = require('axios').default;
const App=require("../models/App")
module.exports = async function (appState) {
  
    try{
        const app= await App.find({status:"active",sold:false,visibility_public:false});
        return app;
    }
    catch(e){
        return [];
        console.log(e);
    }





}
