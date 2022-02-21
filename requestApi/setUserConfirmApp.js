const axios = require('axios').default;
const App=require("../models/App")
const User=require("../models/User");
const getDate = require('../tools/getDate');
module.exports = async function (req) {
let flag=false;

    App.findOne({bundle:req.bundle},async function (err, doc){
        doc.user_confirm=req.confirmId;
        let userN= await User.findOne({userIdTelegram:req.confirmId})
        userN.apps=[...userN.apps,doc._id];
        doc.dateConfirm=getDate()
        doc.sold=true;
        doc.visibility_public=false;
        doc.confirm_app=false;
         try{
          await doc.save();
          await userN.save();
          flag=true
          }
          catch(err){
              console.log(err);
              flag=false;
          }
        });
return flag;
}
