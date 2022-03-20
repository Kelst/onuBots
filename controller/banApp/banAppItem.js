const nav_keyboard = require("../../keyboard/nav_keyboard");
const getUser = require("../../requestApi/getUser");
const removeMessage = require("../../tools/removeMessage");

module.exports=async (state,bot,id,data,query)=>{
   
    const choseApp = await state.app.banApp.find(el => { return el.bundle==data.split("|")[1] });
    const banApp = [[
        {
            text: `Видалити`, callback_data: `delete_app|${choseApp._id}`
        }
    ],


    ]
    state.keyboard_inUse_app_local = banApp;
    
    let user = { 
        userName: "-",
        userTelegram_nik: "-"
    };
    
    if (choseApp.user_confirm != "") { user = await getUser(choseApp.user_confirm) }
  
    
    const redirect = choseApp.redirect_traff_urls.length > 0 ? choseApp.redirect_traff_urls : "all";
    bot.sendMessage(id, `${choseApp.name} (${choseApp.type}) - ${choseApp.price}$\nGoogle Play: ${choseApp.google_play_url}\n\nПокупець: @${user?.userTelegram_nik}\nДата покупки: ${choseApp.dateConfirm}\n\nУніків всього: ${choseApp.installs}\n\nНеймінги: ${choseApp.naming.length>0?"+":"-"}\n\nГлобальний лінк: ${choseApp.url==""?"-":choseApp.url}\n\n${choseApp.naming.length>0?"Неймінги: "+choseApp.naming.map(el=>{return "\n"+el.name+": "+el.name_ref})+"\n":"\n"}Пуші:\n- ${choseApp.notification_text}\n- ${choseApp.notification_start} ${choseApp.notification_interval} ${choseApp.max_count}\n\nРедірект: ${choseApp.redirect_traff_url!=""?"+":"-"}\n${choseApp.redirect_traff_url!=""?"("+choseApp.redirect_traff_url+" "+redirect+" "+choseApp.redirect_traff_percent+"%"+")":""}`, {
      
        reply_markup: {
            inline_keyboard: [[
                {
                    text: `Видалити`, callback_data: `delete_app|${choseApp._id}`
                }
            ],[{ 
                text: `⬅️  Назад`, callback_data: `ban_app`
            }],nav_keyboard[1]]
        }
    }).then(async () => {
        await removeMessage(query.message.chat.id, bot, query.message.message_id);  
    });
         
}
// `${choseApp.name} (${choseApp.type}) - ${choseApp.price}$\nGoogle Play:${choseApp.google_play_url}\n\n *Покупець*: ${user?.userName}  @${user?.userTelegram_nik}\n*Дата покупки*${choseApp.dateConfirm}\n\n*Уніків всього:* ${choseApp.installs}\n*Неймінги:${choseApp.naming.length>0?"+":"-"}*\n\n*Глобальний лінк:*${choseApp.url==""?"-":choseApp.url}\n\n${choseApp.naming.length>0?"*Неймінги:*"+choseApp.naming.map(el=>{return "\n- "+el.name+": "+el.name_ref})+"\n\n":"\n\n"}*Пуші:*\n- ${choseApp.notification_text}\n*- ${choseApp.notification_start} ${choseApp.notification_interval} ${choseApp.max_count}\n\n*Редірект:* ${choseApp.redirect_traff_url!=""?"+":"-"}\n(${choseApp.redirect_traff_url!=""?redirect:""})`, {
