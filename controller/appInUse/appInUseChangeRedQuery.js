
const nav_keyboard = require("../../keyboard/nav_keyboard");
const findUser = require("../../requestApi/findUser");
const setRedirectUPG = require("../../requestApi/setRedirectUPG");
const removeMessage = require("../../tools/removeMessage");

module.exports=async (state,bot,id,messageId,text,choseApp)=>{
    const reqArr = text.split("*");
    if (reqArr.length < 2) {
      
        bot.sendMessage(id, "Неправильний формат вводу, введіть ще раз.", {
            reply_markup: {
                inline_keyboard: [[{
                    text: `⬅️  Назад`, callback_data: `in_use|${choseApp.bundle}`
                }], nav_keyboard[1]]
            }
        }).then(async ()=>{
            
            await removeMessage(id,bot,messageId)
            await removeMessage(id,bot,messageId-1)
          
        })
    } else if ((reqArr.length === 2) || (reqArr.length === 3)) {
        
    
        const link = reqArr[0];
        const procent = reqArr[1];

        let geo = reqArr.length === 2 ? "" : reqArr[2];
        if(reqArr.length===3&&reqArr[2]=="all"){
            geo="";
        }

        await setRedirectUPG({ id: state.control.idApp, url: link,percent: procent,geo: geo})
        state.app.inuseApp.forEach(el => {
            if (el._id === state.control.idApp) {
                el.redirect_traff_urls = geo != "" ? geo.split(",") : []
                el.redirect_traff_url = link;
                el.redirect_traff_percent = procent || 0;
            }
        })
        bot.sendMessage(id, "Дані редіректу змінені.", {
            reply_markup: {
                inline_keyboard: [[{
                    text: `⬅️  Назад`, callback_data: `in_use|${choseApp.bundle}`
                }], nav_keyboard[1]]
            }
        }).then(async ()=>{
            
            await removeMessage(id,bot,messageId)
            await removeMessage(id,bot,messageId-1)
          
        })
    }
   
}







