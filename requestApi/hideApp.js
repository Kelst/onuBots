const axios = require('axios').default;
const App=require("../models/App")
module.exports = async function (req) {
    let flag=false
    App.findOne({_id:req.app_id},async function (err, doc){
        doc.visibility_public=false;
        doc.status="active"
         try{
          await doc.save();
          flag=true
          }
          catch(err){
              console.log(err);
              flag=false
          }
        });

return flag;

}