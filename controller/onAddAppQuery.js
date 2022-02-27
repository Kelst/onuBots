const bot_const_menu=require("../keyboard/nav_keyboard");
const checkBundle = require("../requestApi/checkBundle");
const removeMessage = require("../tools/removeMessage");
const addApp =require("../requestApi/addApp")
const nav_keyboard=require("../keyboard/nav_keyboard")

module.exports=async(id,msg,state,bot,keyboard,messageId)=>{
    const text = msg.text.split("*");
    if(text.length==0||text.length==1||text.length==undefined){
        bot.sendMessage(id, `Невірний формат вводу!\n Попробуйте ще раз \n- Application Name*application type*package name
        \napplication type може бути: gambling/betting/finances/crypto/dating/subscriptions/nutra
        \nПриклад: Bit Vegas*gambling*com.bit.vegas`, {
            reply_markup: {
                inline_keyboard: [keyboard[1]]
            }
        }).then(async ()=>{
            await removeMessage(id,bot,messageId-1)
          
        }).then(async()=>{
            await removeMessage(id,bot,messageId)
        })
        return
    }
   
    const app = {
        name: text[0] || "empty name",
        type: text[1] || "",
        bundle: text[2] || "test.bundle",
        url: "",
        redirect_traff_url: "",
        redirect_traff_percent: 0
    }
    const checkB=await checkBundle(app.bundle)
    if(checkB.length){
        bot.sendMessage(id, "Вже є апка з таким бандлом!\n Попробуйте ще раз", {
            reply_markup: {
                inline_keyboard: [keyboard[1]]
            }
        }).then(async ()=>{
            await removeMessage(id,bot,messageId-1)
          
        }).then(async()=>{
            await removeMessage(id,bot,messageId)
        })
        return
    }else{
 
    }
    const adedApp=await addApp(app)
    if ("bundle" in adedApp) {
        state.app.penndingApp.push(adedApp)
        state.mode=""
        state.control.mode=""
        bot.sendMessage(id, "Апку додано", { 
            reply_markup: {
                inline_keyboard: [nav_keyboard[1]]
            }
        }).then(async ()=>{
            await removeMessage(id,bot,messageId-1)
          
        }).then(async ()=>{
            await removeMessage(id,bot,messageId)
          
        })
    } else {
        bot.sendMessage(id, "Апку не додано", {
            reply_markup: {
                inline_keyboard: [nav_keyboard[1]]
            }
        }).then(async ()=>{
            await removeMessage(id,bot,messageId-1)
          
        }).then(async ()=>{
            await removeMessage(id,bot,messageId)
          
        })
    }
}