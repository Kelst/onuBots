module.exports = async (chat_id, bot, msg) => {  

    for(let i=msg;i>msg-50;i--){
        try{
    await bot.deleteMessage(chat_id, i).catch(e=>{
           
    })
}
catch(e){

}
}
} 