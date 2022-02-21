const nav_keyboard = require("../../keyboard/nav_keyboard")
const setImageUrl = require("../../requestApi/setImageUrl")
const setPrice = require("../../requestApi/setPrice")
const showApp = require("../../requestApi/showApp")

const bot_const_menu=require("../../tools/modeApp")
const removeMessage = require("../../tools/removeMessage")

module.exports=async (state,id,bot,text,messageId)=>{
   

   
    if (text.length === 2) {
      
        await setPrice({ id: state.control.idApp, price: text[0] })
        await setImageUrl({ id: state.control.idApp, url: text[1] })
        await showApp({ app_id: state.control.idApp })
           
            const choseApp = state.app.hideApp.find(el => { return el._id === state.control.idApp });
            
            choseApp.price=text[0];
            choseApp.image_link=text[1];
            choseApp.visibility_public=true;
            choseApp.status="active"
            state.app.hideApp=state.app.hideApp.filter(el => { return el._id!=state.control.idApp })||[];
            state.app.activeApp.push(choseApp)
            state.control.mode = "";
            state.control.idApp = ""
            bot.sendMessage(id, "Апку відправлено в продаж", {
                reply_markup: {
                    inline_keyboard: [nav_keyboard[1]]
                }
            }).then(async ()=>{
                await removeMessage(id,bot,messageId-1)
              
            }).then(async ()=>{
                await removeMessage(id,bot,messageId)
              
            })
       
    } else {
        const choseApp = state.app.hideApp.find(el => { return el._id==state.control.idApp });
        
        bot.sendMessage(id, "Неправильний формат вводу, введіть ще раз.", {
            reply_markup: {
                inline_keyboard: [[
                    { text: `⬅️  Назад`, callback_data: `hide_app|${choseApp.bundle}` }
                ], nav_keyboard[1]]
            }
        }).then(async ()=>{
            await removeMessage(id,bot,messageId-1)
          
        })
    }
     

        
}