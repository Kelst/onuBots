const axios = require('axios').default;
const App=require("../models/App")
module.exports = async function (appState) {
    const app= await App.find({});
    const state={
        confirmApp:[],
        activeApp:[],
        inuseApp:[],
        hideApp:[],
        banApp:[],
        pendingApp:[],
        moderateApp:[]
    }
    try{
    state.confirmApp=app.filter(el=>el.confirm_app===true)||[];
    state.activeApp=app.filter(el=>el.sold===false&&el.status==="active"&&el.confirm_app===false&&el.visibility_public===true)||[];
    state.inuseApp=app.filter(el=>el.sold===true&&el.status==="active"&&el.visibility_public===false)||[];
    state.hideApp=app.filter(el=>el.sold===false&&el.status==="active"&&el.visibility_public===false)||[];
    state.banApp=app.filter(el=>el.status==="ban")||[];
    state.penndingApp=app.filter(el=>el.status==="pending")||[];
    state.moderateApp=app.filter(el=>el.status==="moderating")||[];
    }
    catch(e){
        return false;
        console.log(e);
    }
   return state;




}
