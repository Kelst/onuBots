const nav_keyboard = require("../../keyboard/nav_keyboard")
const removeMessage = require("../../tools/removeMessage")

module.exports=async (state,bot,id,query)=>{
    if (state.app.penndingApp.length >0) {
        state.keyboard_pendingApp = state.app.penndingApp.map(el => {
            return [
                {
                    text: `${el.name} (${el.type})`, callback_data: `pendding_app|${el.bundle}`
                }
            ]
        })

 bot.sendMessage(id, "В розробці", {
            reply_markup: {
                inline_keyboard: [...state.keyboard_pendingApp, nav_keyboard[1]]
            }
        }).then(async () => {
            await removeMessage(query.message.chat.id, bot, query.message.message_id);
        });  
    } else {
        bot.sendMessage(id, "ПУСТО!", {
            reply_markup: {
                inline_keyboard: [nav_keyboard[1]]
            }
        }).then(async () => {
            await removeMessage(query.message.chat.id, bot, query.message.message_id);
        });  
    } 
}