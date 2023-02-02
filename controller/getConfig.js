module.exports=async(id,bot,home_keyboard,sfp)=>{
    await bot.sendMessage(id, `Привіт!!!\n скинь конфіги ${sfp} сфп `, {
        reply_markup: JSON.stringify({ inline_keyboard: home_keyboard,hide_keyboard: true })
    })
}