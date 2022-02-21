


const App=require("../models/App");

module.exports = async function (req) {
    let flag=false;
    App.findOne({_id:req.id},async function (err, doc){
        doc.price=req.price;
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




 