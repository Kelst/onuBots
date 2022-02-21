const nav_keyboard = require("../../keyboard/nav_keyboard");
const removeMessage = require("../../tools/removeMessage");

const bot_const_menu=require("../../tools/modeApp")
module.exports=async (id,state,bot,choseApp,query,appID)=>{
    state.control.mode = bot_const_menu.changeDateRedirect
    state.control.idApp = choseApp._id;
    bot.sendMessage(id, "Введіть дані редіректу в такому форматі:\nлінк/процент/гео\nНаприклад: \nhttps://coinlist.co/dashboard/999*10*ua,ru,kz (або all для гео)", {
       reply_markup: {
            inline_keyboard: [[{
                text: `⬅️  Назад`, callback_data: `in_use|${choseApp.bundle}`
            }], nav_keyboard[1]]
        }
    }).then(async () => {
        await removeMessage(query.message.chat.id, bot, query.message.message_id);  
    });
   
}
