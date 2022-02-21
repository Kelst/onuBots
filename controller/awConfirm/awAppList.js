const nav_keyboard = require("../../keyboard/nav_keyboard")
const removeMessage = require("../../tools/removeMessage")

module.exports=async (state,bot,id,query)=>{
 
    if (state.app.moderateApp.length > 0) {
        state.keyboard_moderate = state.app.moderateApp.map(el => {
            return [
                {
                    text: `${el.name} (${el.type})`, callback_data: `aw_confirm|${el.bundle}`
                }
            ]
        })


        bot.sendMessage(id, "Очікують модерації", {
            reply_markup: {
                inline_keyboard: [...state.keyboard_moderate, nav_keyboard[1]]
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