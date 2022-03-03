

const nav_keyboard = require("../../keyboard/nav_keyboard");
const findUser = require("../../requestApi/findUser");
const removeMessage = require("../../tools/removeMessage");

module.exports=async (state,bot,id,idApp,messageId,text)=>{
   
    
    const choseApp = state.app.activeApp.find(el => el._id==idApp)
    
    let user = await findUser({ userTelegram_nik: text });
    console.log(user);
    if (user.length>0) {
        state.control.mode=""
        bot.sendMessage(id, `Користувач знайдений ${user[0].userName}:\n передати апку користувачу?`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: `Так`, callback_data: `share_yes|${user[0].userIdTelegram}|${choseApp.bundle}`
                        },
                        {
                            text: `Ні`, callback_data: `act_app|${choseApp.bundle}`
                        }
                    ]]
            }
        }).then(async ()=>{
            
            await removeMessage(id,bot,messageId)
            await removeMessage(id,bot,messageId-1)
          
        })
    } else {
        bot.sendMessage(id, "Користувач не знайдений", {
            reply_markup: {
                inline_keyboard: [[
                    { text: `⬅️  Назад`, callback_data: `act_app|${choseApp.bundle}` }
                ]]
            }
        }).then(async ()=>{
            await removeMessage(id,bot,messageId-1)
          
        })
    }
        
}








