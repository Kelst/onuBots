const App=require("../models/App")
module.exports = async function (req) {
    let flag=false;
    App.findOneAndDelete({_id:req.id},async function(err,doc){
        try{
            flag=true
        }
        catch(err){
            flag=false
        }
    });

return flag;


}