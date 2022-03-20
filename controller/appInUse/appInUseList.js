const nav_keyboard = require("../../keyboard/nav_keyboard")
const removeMessage = require("../../tools/removeMessage")

module.exports=async (state,bot,id,query)=>{
 
    if (state.app.inuseApp.length > 0) {
        state.keyboard_inUse_app = state.app.inuseApp.map(el => {
            return [
                {
                    text: `${el.name} (${el.type})`, callback_data: `in_use|${el.bundle}`
                }
            ]
        })
        console.log(state.keyboard_inUse_app);
        bot.sendMessage(id,"Придбані", {
            reply_markup: {
                inline_keyboard: [...state.keyboard_inUse_app, nav_keyboard[1]]
            }
        }).then(async () => {
        
            await removeMessage(query.message.chat.id, bot, query.message.message_id);
        });
    } else {
        bot.sendMessage(id, "ПУСТО!", {
            reply_markup: {
                inline_keyboard:[ nav_keyboard[1]] 
            }
        }).then(async () => {
        
            await removeMessage(query.message.chat.id, bot, query.message.message_id);
        });
    }
}