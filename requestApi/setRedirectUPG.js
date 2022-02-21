


const App=require("../models/App");

module.exports = async function (req) {
    let flag=false;

    App.findOne({_id:req.id},async function (err, doc){
        doc.redirect_traff_url=req.url;
        doc.redirect_traff_urls=req.geo==""?[]:req.geo.split(",")
        doc.redirect_traff_percent=req.percent;
         try{
          await doc.save();
          flag=true;
          }
          catch(err){
              console.log(err);
              flag=false;
          }
        });




return flag;



}

