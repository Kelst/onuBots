const gplay = require('google-play-scraper');
const hideApp=require("../requestApi/hideApp")
module.exports =  function (state) {
   
  

   state.app.moderateApp.forEach(async element=>{
      await gplay.app({ appId: `${element.bundle}` })
      .then(async () => {
         await hideApp({ app_id: element._id })
        
         state.app.hideApp.push(state.find(e=>e._id==element._id))
         state.app.moderateApp=state.app.moderateApp.filter(e=>e._id!=element._id)
         
      }, console.log).catch(er => console.log(er))
   })


}
