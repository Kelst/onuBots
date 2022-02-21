const App=require("../models/App");
const getDate = require('../tools/getDate');
module.exports = async function (req) {
    let flag=false;
    App.findOne({_id:req.app_id},async function (err, doc){
        doc.visibility_public=false;
        doc.status="moderating",
        doc.url=""
        doc.installs=0
        doc.notification_start=0;
        doc.notification_title="";
        doc.notification_text=""
        doc.url=""
        doc.redirect_traff_percent=0;
        doc.moderate_date=getDate()
         try{
          await doc.save();
          flag=true
          }
          catch(err){
            flag=false;
          }
        });
return flag;



}