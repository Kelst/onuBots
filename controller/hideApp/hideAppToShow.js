const nav_keyboard = require("../../keyboard/nav_keyboard")
const bot_const_menu=require("../../tools/modeApp")
const removeMessage = require("../../tools/removeMessage")

module.exports=async (state,id,bot,data,query)=>{
   
 console.log("ShowAPP");
    const choseApp = state.app.hideApp.find(el => { return el._id==data.split("|")[1] });
  
    state.control.mode = bot_const_menu.setPriceAndBaner;
    state.control.idApp = choseApp._id;
    bot.sendMessage(id, `Введіть дані апки в такому форматі:\n ціна*лінк на баннер\nПриклад: 400*https://imgur.com/444`, {
        reply_markup: {
            inline_keyboard: [[
                { text: `⬅️  Назад`, callback_data: `hide_app|${choseApp.bundle}` }
            ], nav_keyboard[1]]
        }
    }).then(async () => {
        await removeMessage(query.message.chat.id, bot, query.message.message_id);
    })
        
}