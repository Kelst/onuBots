const TelegramApi = require("node-telegram-bot-api");
require("dotenv").config();
const bot_const_menu = require("./tools/modeApp");
const deleteAllMessage = require("./tools/deleteAllMessage");
const fs = require("fs");
const Transmission = require("transmission");
const {
  getMacOnu,
  getIdOnu,
  getSfp,
  getConfigOnu,
  prepareConfig,
  compareConfigs,
  filterVlans,
} = require("./tools/settings.js");
let messageId = "";
// перший крок витягнути маки і номери інтерфейсу
function parseInterfaces(text) {
  const lines = text.split('\n');
  const interfaceMap = {};
  let currentInterface = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('interface ')) {
      currentInterface = line.substring(10);
    } else if (line.startsWith('epon bind-onu mac ')) {
      const parts = line.split(' ');
      const mac = parts[3];
      const onu = parts[4];
      interfaceMap[mac] = `interface ${currentInterface}:${onu}`;
     
    }
  }

  const result = [];
  for (const mac in interfaceMap) {
    result.push({ mac, int: interfaceMap[mac],id:interfaceMap[mac].match(/:(\d+)/)[1],sfp:interfaceMap[mac].match(/(?<=\/)\d+(?=:)/)[0] });
  }

  return result;
}
let firstStep,secondStep,firstStep1,secondStep1,onuSfp,onuSfp1;
let clearSfp=''//чистка 
let clearVlans=''//видалення вланів
// виведення інформації додаткової : влани ону якщо є, інтерфейси багатопортових ону
let info=''



function getVlans(text, intfArr) {
  const result = [];

  for (const intf of intfArr) {
    const pattern = new RegExp(`^${intf.int}$([\\s\\S]*?)!`, 'gm');
    const matches = text.matchAll(pattern);

    const vlans = [];
    for (const match of matches) {
      const vlanPattern = /vlan mode tag (\d+)/g;
      const vlanMatches = match[1].matchAll(vlanPattern);

      for (const vlanMatch of vlanMatches) {
        vlans.push(parseInt(vlanMatch[1]));
      }
    }

    result.push({
      vlan: vlans.length > 0 ? vlans : 'no vlan'
    });
  }

  return result;
}
const bot = new TelegramApi(process.env.TOKKEN, { polling: true });
const state = {
  mode: "",
  config1: "",
  config2: "",
};
//клавіатура
const home_keyboard = require("./keyboard/keyboard_home");
const nav_keyboard = require("./keyboard/nav_keyboard");
//api
const onStart = require("./controller/onStart");
const getConfig = require("./controller/getConfig");
const gooHome = require("./controller/gooHome");
const removeMessage = require("./tools/removeMessage");
const checkSFP = require("./controller/checkSFP");
const keyboard_config = require("./keyboard/keyboard_config");
const readableToString2 = require("./tools/readableToString2");
let count = 0;
//старт бота
bot.onText(/\/start/, async (msg) => {
 
    const { id } = msg.chat;
    onStart(id, bot, home_keyboard).then(async (e) => {
      await deleteAllMessage(id, bot, msg.message_id);
    });
 
});
bot.on("document", async function (msg) {
  let id = msg.chat.id; 
  let image = await bot.getFileStream(msg.document.file_id);

  if (state.mode === bot_const_menu.get_config && state.config1 == "") {
    state.config1 = await readableToString2(image);
    getConfig(id, bot, nav_keyboard, 2).then(async (e) => {
      await deleteAllMessage(id, bot, msg.message_id);
    });
  } else if (state.mode === bot_const_menu.get_config && state.config2 == "") {
    state.config2 = await readableToString2(image);
    state.mode = "";
   
     firstStep=parseInterfaces(state.config1)//1
     secondStep=getVlans(state.config1,parseInterfaces(state.config1))//2
    firstStep.map((e,i)=>{return e["vlans"]=secondStep[i].vlan})//3
    //2
     firstStep1=parseInterfaces(state.config2)//1
     secondStep1=getVlans(state.config2,parseInterfaces(state.config2))//2
    firstStep1.map((e,i)=>{return e["vlans"]=secondStep1[i].vlan})//3
     onuSfp=firstStep.filter(e=>firstStep1.find(a=>a.mac===e.mac))
     onuSfp1=firstStep1.filter(e=>firstStep.find(a=>a.mac===e.mac)) 

     onuSfp.forEach(e=>clearSfp+=`\nepon pre-config-template T1 binded-onu-llid ${e.id} param ${e.id<10?e.sfp+"0"+e.id:e.sfp+""+e.id}`)
onuSfp.forEach(e=>clearSfp+=`\nno epon bind-onu sequence ${e.id} `)
//видалення вланів для ппое абонів
onuSfp1.forEach(e=>!Array.isArray (firstStep.find(a=>e.mac===a.mac).vlans)?clearVlans+=`\n no epon pre-config-template T1 binded-onu-llid ${e.id} `:``)
onuSfp1.forEach(e=>!Array.isArray (firstStep.find(a=>e.mac===a.mac).vlans)?clearVlans+=`\n interface epon0/${e.sfp}:${e.id} \n no epon onu port 1 ctc vlan mode `:``)
// виведення інформації додаткової : влани ону якщо є, інтерфейси багатопортових ону
onuSfp1.forEach(e=>(Array.isArray(e.vlans)&&e.vlans.length>1)?info+=`Багатопортові ону\n ${"мак:"+e.mac + " влани " + e.vlans + " інтерфейс: "+ e.int + " старі влани: "+ onuSfp.find(a=>a.mac===e.mac).vlans } `:``)
info+=`\n\n\n Мак адреси і влани ону до переходу: `
onuSfp.forEach(e=>(Array.isArray(e.vlans))? info+=`\n мак : ${e.mac} влани: ${e.vlans} `:info+=`\n мак : ${e.mac} влани: ${e.vlans} `)
info+=`\n\n\n Конфіг сфп старої: `
function findSwitchports(text) {
    const lines = text.split('\n');
    const switchportLines = lines.filter(line => line.includes('switchport'));
    return switchportLines.join('\n');
  }

  info+=findSwitchports(state.config1)
  if(onuSfp.length===0){
    info+="\n\n Нічого не перейшло"
  }

    checkSFP(id, bot, keyboard_config).then(async () => {

      await deleteAllMessage(id, bot, msg.message_id);
    });
  }
});

bot.on("callback_query", async (query) => {
  const id = query.message.chat.id;
  const data = query.data;

  switch (data) {
    case bot_const_menu.get_config:
      state.mode = bot_const_menu.get_config;
      getConfig(id, bot, nav_keyboard, 1).then(async () => {
        removeMessage(query.message.chat.id, bot, query.message.message_id);
      });
      break;

    case bot_const_menu.get_config_first_sfp:
      state.mode = bot_const_menu.get_config_first_sfp;

      

      try {
        fs.writeFileSync(
          "firstSFP.txt",
          clearSfp
        );
        bot
          .sendDocument(id, "firstSFP.txt", {
            caption: "Заповнення темплейтів, очищення ону із сфп",
            reply_markup: JSON.stringify({
              inline_keyboard: keyboard_config(),
              hide_keyboard: true,
            }),
          })
          .then(async () => {
            removeMessage(query.message.chat.id, bot, query.message.message_id);
          });
      } catch (err) {
        console.error(err);
      }
      break;

    case bot_const_menu.delete_vlans:
      state.mode = bot_const_menu.get_config_first_sfp;

      try {
        fs.writeFileSync(
          "secondSFP.txt",
          clearVlans +"\n\n\n"+info
        ); 
        bot
          .sendDocument(id, "secondSFP.txt", {
            caption:
              "Видалення вланів пппое + якщо є конфіги на ону де немає ipoe вланів\n багатопортові onu",
            reply_markup: JSON.stringify({
              inline_keyboard: keyboard_config(),
              hide_keyboard: true,
            }),
          })
          .then(async () => {
            removeMessage(query.message.chat.id, bot, query.message.message_id);
          });
      } catch (err) {
        console.error(err);
      }
      break;
    case bot_const_menu.home:
      state.mode = "";
      state.config1 = "";
      state.config2 = "";
      count = 0;
      gooHome(id, bot, home_keyboard).then(async () => {
        await removeMessage(
          query.message.chat.id,
          bot,
          query.message.message_id
        );
      });

      break;
  }
});
