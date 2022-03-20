const nav_keyboard = require("../../keyboard/nav_keyboard");
const setUrl = require("../../requestApi/setUrl");

module.exports=async (state,bot,query,data,choseApp,appID)=>{
   const { chat, message_id, text } = query.message
   
  
  
   console.log(choseApp);
   if (choseApp.url == "") {
   

       await setUrl({ url: "https://www.google.com.ua/", id: appID});
       state.app.penndingApp.forEach(e => {
        if (e._id == choseApp._id) {
            e.url = "https://www.google.com.ua/"
        }
    })
    bot.answerCallbackQuery({
        callback_query_id: query.id,
        text: "Заглушка встановлена"
    })

    choseApp.url="https://www.google.com.ua/";
    const penddingApp = [
        [
            {
                text: `${choseApp.url == "" ? "Переключити на лінк" : "Переключити на заглушку"}`, callback_data: `switch_link|${choseApp.id}`
            }
        ],
        [
            {
                text: `Відправити в модерацію`, callback_data: `send_to_moderate|${choseApp._id}`
            }
        ],
        [
            {
                text: `Видалити.`, callback_data: `delete_app|${choseApp._id}`
            }
        ]
 
    ]
   bot.editMessageText(`${choseApp.name}, (${choseApp.type})\n${choseApp.bundle}\nЛінк чи заглушка: ${choseApp.url===""?"заглушка":"лінк"}\nУніків: ${choseApp.installs}`, {
                chat_id: chat.id,
                message_id: message_id,
                reply_markup: {
                    inline_keyboard: [...penddingApp, [{
                        text: `⬅️  Назад`, callback_data: `pendding_app`
                    }], nav_keyboard[1]]
                }
            })

}else{
    await setUrl({ url: "", id: appID});
    state.app.penndingApp.forEach(e => {
     if (e._id == choseApp._id) {
         e.url = ""
     }
 })
 bot.answerCallbackQuery({
     callback_query_id: query.id,
     text: "Лінк встановлено"
 })

 choseApp.url="";
 const penddingApp = [
    [
        {
            text: `${choseApp.url == "" ? "Переключити на лінк" : "Переключити на заглушку"}`, callback_data: `switch_link|${choseApp.id}`
        }
    ],
    [
        {
            text: `Відправити в модерацію`, callback_data: `send_to_moderate|${choseApp._id}`
        }
    ],
    [
        {
            text: `Видалити.`, callback_data: `delete_app|${choseApp._id}`
        }
    ]

]
bot.editMessageText(`${choseApp.name} , (${choseApp.type})\n${choseApp.bundle}\nЛінк чи заглушка: ${choseApp.url===""?"заглушка":"лінк"}\nУніків: ${choseApp.installs}`, {
             chat_id: chat.id,
             message_id: message_id,
             reply_markup: {
                 inline_keyboard: [...penddingApp, [{
                     text: `⬅️  Назад`, callback_data: `pendding_app`
                 }], nav_keyboard[1]] 
             }
         })
}

}