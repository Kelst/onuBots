const TelegramApi = require('node-telegram-bot-api');
require('dotenv').config();
const bot_const_menu = require('./tools/modeApp');
const mongoose = require('mongoose');
let messageId = '';

const bot = new TelegramApi(process.env.TOKKEN, { polling: true });
const state = {
    lastMessageId:0,
	app: {
		activeApp: [],
		confirmApp: [],
		inuseApp: [],
		hideApp: [],
		banApp: [],
		penndingApp: [],
		chekGoogle: [],
		moderateApp: []
	},
	mode: '',
	keyboard_confirm_app: [],
	keyboard_active_app: [],
	keyboard_inUse_app: [],
	keyboard_inUse_app_local: [],
	keyboard_hideApp: [],
	keyboard_banApp: [],
	keyboard_pendingApp: [],
	keyboard_checkGoogle: [],
	keyboard_moderate: [],
	control: {
		idApp: '',
		mode: ''
	}
};
//клавіатура
const home_keyboard = require('./keyboard/keyboard_home');
const nav_keyboard = require('./keyboard/nav_keyboard');
//api
const getStateApp = require('./requestApi/getStateApp');
const onStart = require('./controller/onStart');
const removeMessage = require('./tools/removeMessage');
const onAddApp = require('./controller/onAddApp');
const checkBundle = require('./requestApi/checkBundle');
const onAddAppQuery = require('./controller/onAddAppQuery');
const penndingAppList = require('./controller/penddingApp/penndingAppList');
const pendingAppItem = require('./controller/penddingApp/pendingAppItem');
const penndingAppChoseLink = require('./controller/penddingApp/penndingAppChoseLink');
const  sendToModerate  = require('./controller/penddingApp/sendToModerate');
const pendingDeleteApp = require('./controller/penddingApp/pendingDeleteApp');
const awAppList = require('./controller/awConfirm/awAppList');
const awAppItem = require('./controller/awConfirm/awAppItem');
const sendToHide = require('./controller/awConfirm/sendToHide');
const awAppDelete = require('./controller/awConfirm/awAppDelete');
const hideAppList = require('./controller/hideApp/hideAppList');
const hideAppItem = require('./controller/hideApp/hideAppItem');
const hideAppShareToUser = require('./controller/hideApp/hideAppShareToUser');
const hideAppShareAppToUserQuery = require('./controller/hideApp/hideAppShareAppToUserQuery');
const hideAppYesNo = require('./controller/hideApp/hideAppYesNo');
const hideAppToShow = require('./controller/hideApp/hideAppToShow');
const hideAppToActiveRequest = require('./controller/hideApp/hideAppToActiveRequest');
const hideAppSendToBan = require('./controller/hideApp/hideAppSendToBan');
const banAppList = require('./controller/banApp/banAppList');
const banAppItem = require('./controller/banApp/banAppItem');
const activeAppList= require('./controller/activeApp/activeAppList');
const activeAppItem = require('./controller/activeApp/activeAppItem');
const activeAppShareToUser = require('./controller/activeApp/activeAppShareToUser');
const activeAppShareToUserRequest = require('./controller/activeApp/activeAppShareToUserRequest');
const activeAppYesNo = require('./controller/activeApp/activeAppYesNo');
const activeAppSendToBan = require('./controller/activeApp/activeAppSendToBan');
const sendToHideActive = require('./controller/activeApp/sendToHideActive');
const hideAppDelete = require('./controller/hideApp/hideAppDelete');
const activeAppDelete = require('./controller/activeApp/activeAppDelete');
const appInUseList = require('./controller/appInUse/appInUseList');
const appInUseItem = require('./controller/appInUse/appInUseItem');
const appInUsedeleteRedirect = require('./controller/appInUse/appInUsedeleteRedirect');
const appInUseChangeRedirect = require('./controller/appInUse/appInUseChangeRedirect');
const appInUseChangeRedQuery = require('./controller/appInUse/appInUseChangeRedQuery');
const checkGooglePlay = require('./controller/checkGooglePlay');
const deleteAllMessage = require('./tools/deleteAllMessage');
const getPenndingApp=require("./requestApi/getPenndingApp");
const getModerateApp = require('./requestApi/getModerateApp');
const getHideApp = require('./requestApi/getHideApp');
const getBanApp = require('./requestApi/getBanApp');
const getActiveApp = require('./requestApi/getActiveApp');
const getInuseApp = require('./requestApi/getInuseApp');
let count=0;
//перевірка пріл якщо пройшли модерку
async function checkAllPrills() {
	const stateApp = await getStateApp();
	if (stateApp != undefined) {
		state.app = stateApp;
	} else {
		console.log('Не пройшов запит на зчитування початкового стану бота');
	}
}
//підключення монго
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => console.log('Connect DB'));

bot.on("message",async msg=>{
	const { id } = msg.chat;
	if(msg.text!="/start"||state.control.mode!=bot_const_menu.addApp||state.control.mode != bot_const_menu.shareAppToUser||state.control.mode != bot_const_menu.setPriceAndBaner||state.control.mode != bot_const_menu.changeDateRedirect){
		await removeMessage(id, bot,msg.message_id);
		state.lastMessageId=state.lastMessageId+1;
	}
})
//старт бота
bot.onText(/\/start/, async (msg) => {  
    if(msg.chat.id===289598095||msg.chat.id===384042079||msg.chat.id===5042766272) {
	const { id } = msg.chat;
    state.mode=""
    state.control.mode=""
    state.control.idApp=""
	await checkAllPrills();

	    onStart(id, state, bot, home_keyboard).then(async (e) => {
		await deleteAllMessage(id, bot, msg.message_id);
	});
}

    
});                  

bot.on('callback_query', async (query) => {
	const id = query.message.chat.id; 
	const data = query.data;
	switch (data) {
		//додати прілку
		case bot_const_menu.addApp:
            state.mode=bot_const_menu.addApp
            state.control.mode=bot_const_menu.addApp
			await onAddApp(id, state, bot, nav_keyboard).then(async () => {
				removeMessage(query.message.chat.id, bot, query.message.message_id);
			});

			break;
            //пріли в розробці
            case bot_const_menu.penndingApp:
                state.mode = bot_const_menu.penndingApp;
                state.app.penndingApp=await getPenndingApp();
                await penndingAppList(state,bot,id,query)
                break;
                //в модерації
                case bot_const_menu.awaConfirm:
                    state.app.moderateApp=await getModerateApp();
                   state.mode = bot_const_menu.awaConfirm;
                   await   awAppList(state,bot,id,query);
               break;
               //сховані
               case bot_const_menu.hideApp:
                   state.app.hideApp=await getHideApp();
                state.mode = bot_const_menu.hideApp;
                await hideAppList(state,bot,id,query)
            //...................

            break;
            //заблоковані
            case bot_const_menu.banApp:
                state.app.banApp=await getBanApp();
            state.mode = bot_const_menu.banApp;
            await banAppList(state,bot,id,query);
            break;
            //в продажу
            case bot_const_menu.activeApp:
                state.app.activeApp=await getActiveApp();
                state.mode =await bot_const_menu.activeApp;
                activeAppList(state,bot,id,query)
                break;
            ///
            //використовуються
            case bot_const_menu.inUse:
                state.app.inuseApp=await getInuseApp()||[]
                state.mode = bot_const_menu.inUse;
                 await appInUseList(state,bot,id,query)

                break;
            //
		    case bot_const_menu.home:
			state.mode = '';
			state.control.idApp = '';
			state.control.mode = '';
            await checkAllPrills();
			await bot.sendMessage(id, `Здоров був друже \nКонтроль всіх апок тут`, {
					reply_markup: {
						inline_keyboard: home_keyboard(state)
					}
				})
				.then(async () => {
					await removeMessage(query.message.chat.id, bot, query.message.message_id);
				});  
			break;
	}
});


//обробка пріл в розробці 

bot.on("callback_query", async query => {
    const id = query.message.chat.id;
    const data = query.data;
    // messageId = query.message.message_id;
    
    if (data.indexOf("pendding_app|") != -1) {
    
   await pendingAppItem(state,bot,id,data,query)

}
if ((state.mode === bot_const_menu.penndingApp) && (data.split("|")[0] === bot_const_menu.switchLink)) {
    // state,bot,query,data
    const appID = data.split("|")[1];
    
    const choseApp = await state.app.penndingApp.find(el => { return el.id ==data.split("|")[1] });
    await  penndingAppChoseLink(state,bot,query,data,choseApp,appID) 
}
if ((state.mode === bot_const_menu.penndingApp) && (data.split("|")[0] === bot_const_menu.sendToModerate)) {
    const appID = data.split("|")[1];
    const choseApp = state.app.penndingApp.find(el => { return el._id == appID });
     sendToModerate(id,bot,query,state,appID,choseApp);

}
if ((state.mode === bot_const_menu.penndingApp) && (data.split("|")[0] === bot_const_menu.deleteApp)) {//видалити
 pendingDeleteApp(state,data,bot,id,query)
}
    
    
    })
//..............................................................................

//обробка пріл в модерації

bot.on("callback_query", async query => {
    const id = query.message.chat.id;
    const data = query.data;
    if (data.indexOf("aw_confirm|") != -1) {
        awAppItem( state,bot,id,data,query)
    }
    if ((state.mode === bot_const_menu.awaConfirm) && (data.split("|")[0] === bot_const_menu.hidesApp)) {
        const appID=data.split("|")[1]
        const choseApp=state.app.moderateApp.find(el=>el._id==appID)
        sendToHide(state,id,bot,choseApp,query,appID);
    }
    if ((state.mode === bot_const_menu.awaConfirm) && (data.split("|")[0] === bot_const_menu.deleteApp)) {//видалити
         awAppDelete(state,data,bot,id,query)
        }

    
    })

///...............................................................................

//обробка пріл cховані

bot.on("callback_query", async query => {
    const id = query.message.chat.id;
    const data = query.data;
    
    if (data.indexOf("hide_app|") != -1) {
      
       await hideAppItem(state,bot,id,data,query)
    }
    if ((state.mode === bot_const_menu.hideApp) && (data.split("|")[0] === bot_const_menu.shareAppToUser)) {//розшарити
      await hideAppShareToUser(state,bot,id,data,query)
    }
    if ((state.mode == bot_const_menu.hideApp) && (data.split("|")[0] == bot_const_menu.shareYes)) 
    {
        hideAppYesNo(state,bot,id,data,query)
    
    }
    //штовхнути у продаж
    if ((state.mode === bot_const_menu.hideApp) && (data.split("|")[0] === "show_app")) {
      hideAppToShow(state,id,bot,data,query);
    }
    //штовхнути в заблоковані
    if ((state.mode === bot_const_menu.hideApp)  && (data.split("|")[0] === "send_to_ban")) {
       await  hideAppSendToBan(state,id,bot,data,query);
    }
    if ((state.mode === bot_const_menu.hideApp) && (data.split("|")[0] === bot_const_menu.deleteApp)) {//видалити
        hideAppDelete(state,data,bot,id,query)
       }


})
///...............................................................................

//обробка додати прілу.
bot.on("message",async msg => {
    messageId = msg.message_id;
   const { id } = msg.chat;
console.log("Vlad")
    if (msg.text === "/start") return

    if ((state.mode === bot_const_menu.addApp)) {//розшарити користувачу
        console.log("Add App");
       await onAddAppQuery(id,msg,state,bot,nav_keyboard,messageId)
         }
         if ( (state.mode === bot_const_menu.hideApp) && (state.control.mode == bot_const_menu.shareAppToUser))
          {

            messageId = msg.message_id;
            const id = msg.chat.id;
            const text = msg.text.trim();
            const idApp = state.control.idApp;
            await hideAppShareAppToUserQuery(state,bot,id,idApp,messageId,text)
    
          }
          
         
          if ((state.mode == bot_const_menu.hideApp) && (state.control.mode == bot_const_menu.setPriceAndBaner)) {
            const text = msg.text.split("*");
            messageId = msg.message_id;
            const id = msg.chat.id;
          hideAppToActiveRequest(state,id,bot,text,messageId)
          }
          

          if ( (state.mode === bot_const_menu.activeApp) && (state.control.mode == bot_const_menu.shareAppToUser))
          {

            messageId = msg.message_id;
            const id = msg.chat.id;
            const text = msg.text.trim();
            const idApp = state.control.idApp;
            await activeAppShareToUserRequest(state,bot,id,idApp,messageId,text)
    
          }

          if ((state.mode === bot_const_menu.inUse) && (state.control.mode == bot_const_menu.changeDateRedirect)) {
            messageId = msg.message_id;
            const id = msg.chat.id;
            const text = msg.text;
            const choseApp = state.app.inuseApp.find(el => { return el._id == state.control.idApp });
            appInUseChangeRedQuery(state,bot,id,messageId,text,choseApp)
           }
      })
      //...............................................................................

      //обробка пріли заблоковані
      bot.on("callback_query", async query => {
        const id = query.message.chat.id;
        const data = query.data;
        
        if (data.indexOf("ban_app|") != -1) {
          await banAppItem(state,bot,id,data,query);
    
        }
    
    })
      //.................................................................................... 
       //обробка в продажу
       bot.on("callback_query", async query => {
        const id = query.message.chat.id;
        const data = query.data;
       if (data.indexOf("act_app|") != -1) {
        await activeAppItem(state,bot,id,data,query);
        }
        if ((state.mode === bot_const_menu.activeApp) && (data.split("|")[0] === bot_const_menu.shareAppToUser)) {//розшарити
            await activeAppShareToUser(state,bot,id,data,query)
          }
        if ((state.mode == bot_const_menu.activeApp) && (data.split("|")[0] == bot_const_menu.shareYes)) 
      {
       await activeAppYesNo(state,bot,id,data,query);
    
      }
      if ((state.mode === bot_const_menu.activeApp)  && (data.split("|")[0] === "send_to_ban")) {
        await  activeAppSendToBan(state,id,bot,data,query);
     }
     if ((state.mode === bot_const_menu.activeApp) && (data.split("|")[0] === bot_const_menu.hidesApp)) {
        const appID=data.split("|")[1]
        const choseApp=state.app.activeApp.find(el=>el._id==appID)
        sendToHideActive(state,id,bot,choseApp,query,appID);
    }
    if ((state.mode === bot_const_menu.activeApp) && (data.split("|")[0] === bot_const_menu.deleteApp)) {//видалити
        activeAppDelete(state,data,bot,id,query)
       }

    
    })
      //.................................................................................... 
        //обробка використовуються
        bot.on("callback_query", async query => {
            const id = query.message.chat.id;
            const data = query.data;
            const choseApp = await state.app.inuseApp.find(el => { return el.bundle === data.split("|")[1] });
            if (data.indexOf("in_use|") != -1) {
                appInUseItem(state,bot,id,choseApp,query)
            }


            if ((state.mode === bot_const_menu.inUse) && (data.split("|")[0] === bot_const_menu.deleteRedirect)) {
                const appID = data.split("|")[1];
                const choseApp = state.app.inuseApp.find(el => { return el._id == appID });
               
                appInUsedeleteRedirect(id,state,bot,choseApp,query,appID)

            } 
            if ((state.mode === bot_const_menu.inUse) && (data.split("|")[0] === bot_const_menu.changeDateRedirect)) {
                const appID = data.split("|")[1];
                const choseApp = state.app.inuseApp.find(el => { return el._id == appID });
               
           await   appInUseChangeRedirect(id,state,bot,choseApp,query,appID)
        
            }
        
        })
          //....................................................................................