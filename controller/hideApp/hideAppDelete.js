const nav_keyboard = require("../../keyboard/nav_keyboard");
const deleteApp = require("../../requestApi/deleteApp");
const removeMessage = require("../../tools/removeMessage");


module.exports=async(state,data,bot,id,query)=>{
    const appID= data.split("|")[1];
    
    state.app.hideApp= state.app.hideApp.filter(el => el._id!=appID);
    await  deleteApp({ id: appID}) 
        
        bot.sendMessage(id, "Апка успішно видалена", {
            reply_markup: {
                inline_keyboard: [nav_keyboard[1]]
            }
        }).then(async () => {
        
            await removeMessage(query.message.chat.id, bot, query.message.message_id);
        });
        
    
}