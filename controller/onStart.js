module.exports=async(id,bot,home_keyboard,messageId)=>{
 
    await bot.sendMessage(id, `Привіт!!!\n я допоможу тобі у перенесенні конфігів між сфп`, {
        reply_markup: JSON.stringify({ inline_keyboard: home_keyboard(),hide_keyboard: true })
    })
}