module.exports=async(id,bot,home_keyboard)=>{
    await bot.sendMessage(id, `Конфіги отримані `, {
        reply_markup: JSON.stringify({ inline_keyboard: home_keyboard(),hide_keyboard: true })
    })
}