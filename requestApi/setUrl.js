const axios = require('axios').default;
const App=require("../models/App")
module.exports = async function (req) {
let flag=false;
    App.findOne({_id:req.id},async function (err, doc){
        doc.url=req.url;
         try{
          await doc.save();
          flag=true
          }
          catch(err){
            flag=false
          }
        });
        return flag;



}