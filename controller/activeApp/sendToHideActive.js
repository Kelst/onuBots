const nav_keyboard = require("../../keyboard/nav_keyboard")
const hideApp = require("../../requestApi/hideApp")

const removeMessage = require("../../tools/removeMessage")

module.exports=async (state,id,bot,choseApp,query,appID)=>{
    await hideApp({ app_id:appID})
    console.log("HideApp");
    choseApp.visibility_public=false;
    choseApp.status="active"
    state.app.hideApp.push(choseApp);
    state.app.activeApp=state.app.activeApp.filter(el=>el._id!=appID)
        bot.sendMessage(id, "Апку сховано!", {
            reply_markup: {
                inline_keyboard: [nav_keyboard[1]]
            }
        }).then(async () => {
            await removeMessage(query.message.chat.id, bot, query.message.message_id);
        
    })
       
        
}