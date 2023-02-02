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
      let configs = prepareConfig(state.config1, state.config2);
      let res = compareConfigs(configs.onuList1, configs.onuList2);
      try {
        fs.writeFileSync(
          "test.txt",
          res.noBindOnu.join("\n") + "\n" + res.template1.join("\n")
        );
        bot
          .sendDocument(id, "test.txt", {
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
      let configs1 = prepareConfig(state.config1, state.config2);
      let res1 = compareConfigs(configs1.onuList1, configs1.onuList2);
      try {
        fs.writeFileSync(
          "test1.txt",
          res1.noVlanMode.join("\n") +
            "\n" +
            res1.template2.join("\n") +
            "\n\n Не іпое влани \n" +
            res1.noIpoeVlans.join("\n")
        ); 
        bot
          .sendDocument(id, "test1.txt", {
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
