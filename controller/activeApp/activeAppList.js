const nav_keyboard = require("../../keyboard/nav_keyboard")
const removeMessage = require("../../tools/removeMessage")

module.exports=async (state,bot,id,query)=>{
 
    if (state.app.activeApp.length > 0) {
        state.keyboard_active_app = state.app.activeApp.map(el => {
            return [
                {
                    text: `${el.name} (${el.type})`, callback_data: `act_app|${el.bundle}`
                }
            ]
        })


        bot.sendMessage(id, "В продажу", {
            reply_markup: {
                inline_keyboard: [...state.keyboard_active_app, nav_keyboard[1]]
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