const nav_keyboard = require("../../keyboard/nav_keyboard");
const removeMessage = require("../../tools/removeMessage");

module.exports=async (state,bot,id,data,query)=>{
   
    const choseApp = state.app.moderateApp.find(el => { return el.bundle === data.split("|")[1] });
            const penddingApp = [
                [
                    {
                        text: `Штовхнути в “сховані”`, callback_data: `hides_app|${choseApp._id}`
                    }
                ],
                [{
                    text: `Видалити`, callback_data: `delete_app|${choseApp._id}`
                }
                ],
        ]
    
        bot.sendMessage(id, `${choseApp.name} , (${choseApp.type})\nGoogle Play: ${choseApp.google_play_url}\nДата відправки в модерацію: ${choseApp.moderate_date}`, {
          
            reply_markup: {
                inline_keyboard: [...penddingApp, [{
                    text: `⬅️  Назад`, callback_data: `aw_confirm`
                }], nav_keyboard[1]]
            }
        }).then(async () => {
        
            await removeMessage(query.message.chat.id, bot, query.message.message_id);
        });
    
        
}