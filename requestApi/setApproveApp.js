const axios = require('axios').default;
const App=require("../models/App")
const User=require("../models/User");
const getDate = require('../tools/getDate');
module.exports = async function (req) {
let flag=false;
const appFind= await App.findOne({bundle:req.bundle});
            
User.findOne({userIdTelegram:appFind.user_confirm},async function (err, doc){
  let flag=false;
    if(appFind.sold===true){
   flag=false;
        return ;
    }
   
    doc.apps=[...doc.apps,appFind._id];
    appFind.dateConfirm=getDate()
    appFind.sold=true;
    appFind.visibility_public=false;
    appFind.confirm_app=false;



    try{
     await doc.save();  
     await appFind.save();
     flag=true;
     }
     catch(err){
        flag=false;
     }
   });
             
         return flag
    }
