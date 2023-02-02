module.exports=async(id,bot,home_keyboard)=>{
    
    await bot.sendMessage(id, `Привіт!!!\n скинь конфіги 1 сфп `, {
        reply_markup: JSON.stringify({ inline_keyboard: home_keyboard(),hide_keyboard: true })
    })
}