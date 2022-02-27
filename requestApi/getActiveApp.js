const axios = require('axios').default;
const App=require("../models/App")
module.exports = async function (appState) {
    
    try{
        const app= await App.find({status:"active",confirm_app:false,sold:false,visibility_public:true});
        return app;
    }
    catch(e){
        return [];
        console.log(e);
    }



}
