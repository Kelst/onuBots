const bot_const_menu=require("../keyboard/nav_keyboard")
module.exports=async(id,state,bot,keyboard,messageId)=>{
   
    
    await bot.sendMessage(id, `Введи початкову інфу по апці в форматі:\n- Application Name*application type*package name
 \napplication type може бути: gambling/betting/finances/crypto/dating/subscriptions/nutra
 \nПриклад: Bit Vegas*gambling*com.bit.vegas`, {
         reply_markup: {
             inline_keyboard: [keyboard[1]] 
         }
     }) 
}