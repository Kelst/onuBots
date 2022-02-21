const nav_keyboard = require("../../keyboard/nav_keyboard")
const removeMessage = require("../../tools/removeMessage")

module.exports=async (state,bot,id,query)=>{
 
    console.log("СХОВАНІ");
    
    if (state.app.hideApp.length>0) {
   
       const hideKeyboard=state.app.hideApp.map(el => {
            return [
                {
                    text: `${el.name} (${el.type})`, callback_data: `hide_app|${el.bundle}`
                }
            ]
        })
        console.log(state.app.hideApp);

        bot.sendMessage(id, "Сховані:", {
            reply_markup: {
                inline_keyboard: [...hideKeyboard, nav_keyboard[1]]
            }
        }).then(async () => {
            removeMessage(query.message.chat.id, bot, query.message.message_id);
        });
    } else {
        bot.sendMessage(id, "ПУСТО!", {
            reply_markup: {
                inline_keyboard: [nav_keyboard[1]]
            }
        }).then(async () => {
            removeMessage(query.message.chat.id, bot, query.message.message_id);
        });
    }
}