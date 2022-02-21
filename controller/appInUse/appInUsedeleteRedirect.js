const nav_keyboard = require("../../keyboard/nav_keyboard");
const removeMessage = require("../../tools/removeMessage");
const getUser = require("../../requestApi/getUser");
const deleteRedirect = require("../../requestApi/deleteRedirect");

module.exports=async (id,state,bot,choseApp,query,appID)=>{
    const in_useApp = [
        [
            {
                text: `Змінити дані редіректу`, callback_data: `change_date_redirect|${choseApp._id}`
            }
        ],
        [ 
            {
                text: `Видалити редірект`, callback_data: `delete_redirect|${choseApp._id}`
            }
        ],]

        await deleteRedirect({ id: appID });
        state.app.inuseApp.forEach(el => {
            if (el._id == appID) {
                el.redirect_traff_urls = []
                el.redirect_traff_url = "";
            }
        })
        bot.answerCallbackQuery({
            callback_query_id: query.id,
            text: "Редірект видалено"
        })
      
       
        const { chat, message_id, text } = query.message;
        let user = { 
            userName: "-",
            userTelegram_nik: "-"
        };
        
        if (choseApp.user_confirm != "") { user = await getUser(choseApp.user_confirm) }
     
          
        const redirect = choseApp.redirect_traff_urls.length > 0 ? choseApp.redirect_traff_urls : "all";
        bot.editMessageText(`${choseApp.name} (${choseApp.type}) - ${choseApp.price}$\nGoogle Play:${choseApp.google_play_url}\n\n*Покупець*: ${user?.userName}  @${user?.userTelegram_nik}\n*Дата покупки*${choseApp.dateConfirm}\n\n*Уніків всього:* ${choseApp.installs}\n\n*Неймінги:${choseApp.naming.length>0?"+":"-"}*\n\n*Глобальний лінк:*${choseApp.url==""?"-":choseApp.url}\n\n${choseApp.naming.length>0?"*Неймінги:*"+choseApp.naming.map(el=>{return "\n"+el.name+": "+el.name_ref})+"\n":"\n"}*Пуші:*\n- ${choseApp.notification_text}\n- ${choseApp.notification_start} ${choseApp.notification_interval} ${choseApp.max_count}\n\n*Редірект:* ${choseApp.redirect_traff_url!=""?"+":"-"}\n${choseApp.redirect_traff_url!=""?"("+choseApp.redirect_traff_url+" "+redirect+" "+choseApp.redirect_traff_percent+"%"+")":""}`, {
            chat_id: chat.id,
            message_id: message_id,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [...in_useApp,[{  
                    text: `⬅️  Назад`, callback_data: `in_use`
                }],nav_keyboard[1]]
            }
        })
        
}
