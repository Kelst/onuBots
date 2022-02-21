const nav_keyboard = require("../../keyboard/nav_keyboard");
const removeMessage = require("../../tools/removeMessage");

module.exports=async (state,bot,id,data,query)=>{
   
    const choseApp = state.app.hideApp.find(el => { return el.bundle === data.split("|")[1] });
        const activeApp = [
            [
                {
                    text: `Розшарити`, callback_data: `share_app_to_user|${choseApp._id}`
                }
            ],
            [
                {
                    text: `Штовхнути в “В продаж”`, callback_data: `show_app|${choseApp._id}`
                }
            ], [
                {
                    text: `Штовхнути в “Заблоковані”`, callback_data: `send_to_ban|${choseApp._id}`
                }
            ], [
                {
                    text: `Видалити`, callback_data: `delete_app|${choseApp._id}`
                }
            ],]


        bot.sendMessage(id, `${choseApp.name} (${choseApp.type}) \n*Google Play*:${choseApp.google_play_url}`, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [...activeApp, [{
                    text: `⬅️  Назад`, callback_data: `hide_app`
                }], nav_keyboard[1]]
            }
        }).then(async () => {
            await removeMessage(query.message.chat.id, bot, query.message.message_id);
        });
    
        
}