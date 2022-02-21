const nav_keyboard = require("../../keyboard/nav_keyboard");
const setApproveApp = require("../../requestApi/setApproveApp");
const setUserConfirmApp = require("../../requestApi/setUserConfirmApp");
const getDate = require("../../tools/getDate");
const removeMessage = require("../../tools/removeMessage");

module.exports=async (state,bot,id,data,query)=>{
   

const usetId = data.split("|")[1];
const bundleApp = data.split("|")[2];


    await setUserConfirmApp({
        bundle: bundleApp,
        confirmId: usetId
    })

    
        state.control.mode = "";
        state.control.idApp = "";
        const choseApp=state.app.activeApp.find(el=>el.bundle==bundleApp)
          
        choseApp.user_confirm=usetId;
         choseApp.dateConfirm=getDate()
         choseApp.sold=true;
         choseApp.visibility_public=false;
         choseApp.confirm_app=false;
        
        state.app.inuseApp.push(choseApp)
        state.app.activeApp=state.app.activeApp.filter(el=>el.bundle!=bundleApp)
        bot.sendMessage(id, "Апку передано користувачу", {
            reply_markup: {
                inline_keyboard: [nav_keyboard[1]]
            }
        }).then(async () => {
            await removeMessage(query.message.chat.id, bot, query.message.message_id);
        });
    
    //  else {
    //     bot.sendMessage(id, "Сервер не відповідає", {
    //         reply_markup: {
    //             inline_keyboard: [nav_keyboard[1]]
    //         }
    //     }).then(async () => {
    //         await removeMessage(query.message.chat.id, bot, query.message.message_id);
    //     });
    // }



        
}
