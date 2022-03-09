const nav_keyboard = require("../../keyboard/nav_keyboard");
const removeMessage = require("../../tools/removeMessage");

module.exports=async (state,bot,id,data,query)=>{
   
        const choseApp = await state.app.penndingApp.find(el => { return el.bundle === data.split("|")[1] });
        const penddingApp = [
            [
                {
                    text: `${choseApp.url == "" ?"Переключити на лінк"  : "Переключити на заглушку"}`, callback_data: `switch_link|${choseApp._id}`
                }
            ],
            [
                {
                    text: `Відправити в модерацію`, callback_data: `send_to_moderate|${choseApp._id}`
                }
            ],
            [
                {
                    text: `Видалити`, callback_data: `delete_app|${choseApp._id}`
                }
            ]
    
        ]
    
        bot.sendMessage(id, `${choseApp.name}  (${choseApp.type})\n${choseApp.bundle}\nЛінк чи заглушка: ${choseApp.url===""?"заглушка":"лінк"}\nУніків: ${choseApp.installs}`, {

            reply_markup: {
                inline_keyboard: [...penddingApp, [{
                    text: `⬅️  Назад`, callback_data: `pendding_app`
                }], nav_keyboard[1]]
            }
        }).then(async () => {
            await removeMessage(query.message.chat.id, bot, query.message.message_id);
        });
    
        
}