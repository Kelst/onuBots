const nav_keyboard = require("../../keyboard/nav_keyboard");
const removeMessage = require("../../tools/removeMessage");

module.exports=async (state,bot,id,data,query)=>{
   
    const idApp = data.split("|")[1]
    const choseApp = state.app.activeApp.find(el => el._id==idApp)
    state.control.mode = "share_app_to_user";
    state.control.idApp = idApp;
    bot.sendMessage(id, "Введи telegram username користувача, якому потрібно розшарити апку:", {
        reply_markup: {
            inline_keyboard: [[{
                text: `⬅️  Назад`, callback_data: `act_app|${choseApp.bundle}`
            }]]
        }
    }).then(async () => { 
        await removeMessage(query.message.chat.id, bot, query.message.message_id);
    });
    
        
}