const axios = require('axios').default;
const nav_keyboard=require("../keyboard/nav_keyboard")
const App=require("../models/App")
module.exports = async function (req) {
    const newApp=new App({
        bundle:req.bundle||"",
        name:req.name||"",
        url:req.url||"https://www.google.com.ua/",
        price:req.price||400,
        image_link:req.image_link||"",
        type:req.type||"application",
        redirect_traff_url:req.redirect_traff_url||"",
        redirect_traff_percent:req.redirect_traff_percent||0,
        google_play_url:`https://play.google.com/store/apps/details?id=${req.bundle}`
    
        
    });
    try{
    await newApp.save()
    return newApp
    }
    catch(er){
        return({
            message:"Error AdApp"
        })
    }




}