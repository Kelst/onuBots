const nav_keyboard = require("../../keyboard/nav_keyboard")
const changeAppStatus = require("../../requestApi/changeAppStatus")
const bot_const_menu=require("../../tools/modeApp")
const removeMessage = require("../../tools/removeMessage")

module.exports=async (state,id,bot,data,query)=>{
   

    const choseApp=state.app.activeApp.find(el=>el._id==data.split("|")[1]);

        await changeAppStatus({ app_id: data.split("|")[1], status: "ban" })
        choseApp.status="ban";
        state.app.banApp.push(choseApp);
       
        state.app.activeApp= state.app.activeApp.filter(el=>el._id!=data.split("|")[1]);
        

            bot.sendMessage(id, "Апка успішно заблокована", {
                reply_markup: {
                    inline_keyboard: [[{
                        text: `⬅️  Назад`, callback_data: `act_app`
                    }], nav_keyboard[1]]
                }
            }).then(async () => {
                await removeMessage(query.message.chat.id, bot, query.message.message_id);
            }); 
        
}