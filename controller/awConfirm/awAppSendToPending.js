const nav_keyboard = require("../../keyboard/nav_keyboard");
const changeAppStatus = require("../../requestApi/changeAppStatus");
const removeMessage = require("../../tools/removeMessage");

module.exports=async (state,id,bot,data,query)=>{
   

    const choseApp=state.app.moderateApp.find(el=>el._id==data.split("|")[1]);

        await changeAppStatus({ app_id: data.split("|")[1], status: "pending" })
        choseApp.status="pending";
        state.app.penndingApp.push(choseApp);
       
        state.app.moderateApp= state.app.moderateApp.filter(el=>el._id!=data.split("|")[1]);
        

            bot.sendMessage(id, "Апку повернено  в розробку", {
                reply_markup: {
                    inline_keyboard: [[{
                        text: `⬅️  Назад`, callback_data: `aw_confirm`
                    }], nav_keyboard[1]]
                }
            }).then(async () => {
                await removeMessage(query.message.chat.id, bot, query.message.message_id);
            }); 
        
}