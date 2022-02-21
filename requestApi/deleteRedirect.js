const App=require("../models/App")
module.exports = async function (req) {
  let flag=false;
  App.findOne({_id:req.id},async function (err, doc){
        
    doc.redirect_traff_urls=[];
    doc.redirect_traff_url="";

     try{
      await doc.save();
    flag=true;
      }
      catch(err){
         
        flag=false;
      }
    });

return flag;


}