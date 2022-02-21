module.exports=async(id,state,bot,home_keyboard,messageId)=>{
 
    await bot.sendMessage(id, `Здоров був друже\nКонтроль всіх апок тут`, {
        reply_markup: JSON.stringify({ inline_keyboard: home_keyboard(state),hide_keyboard: true })
    })
}