const nav_keyboard = require("../../keyboard/nav_keyboard")
const setModerate = require("../../requestApi/setModerate")
const setUrl = require("../../requestApi/setUrl")
const getDate = require("../../tools/getDate")
const removeMessage = require("../../tools/removeMessage")

module.exports=async (id,bot,query,state,appID,choseApp)=>{
   
    await setModerate({ app_id: appID }) 
    const pendingArr=state.app.penndingApp.filter(el => el._id!=appID)
    console.log(pendingArr);
    console.log(appID,"ID");
    state.app.penndingApp=pendingArr;
    choseApp.status="moderating",
    choseApp.url=""
    choseApp.installs=0
    choseApp.notification_start=0;
    choseApp.notification_title="";
    choseApp.notification_text=""
    choseApp.moderate_date=getDate()
    choseApp.redirect_traff_percent=0
    state.app.moderateApp.push(choseApp)

    bot.sendMessage(id, "Прілу відправлено в модерацію", {
        reply_markup: {
            inline_keyboard: [[{
                text: `⬅️  Назад`, callback_data: `pendding_app`
            }], nav_keyboard[1]]
        }
    }).then(async () => {
        
        await removeMessage(query.message.chat.id, bot, query.message.message_id);
    });
        
}