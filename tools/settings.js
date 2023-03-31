

    function getMacOnu(text) {
        const entries = [];
        let match;
        let regex=/(.{4}\..{4}\..{4})/gm
        while ((match = regex.exec(text)) !== null) {
          entries.push(match[1]);
        }
        return entries;
      }

    function getIdOnu(config,onus){
        let ids=config.match(/.{4}\..{4}\..{4} (\d*)/gm,'$1')  
        const idss=[]
        for (const iterator of ids) {
            idss.push(iterator.match(/(\d+)$/)[1])
        }
       
        for(let i=0;i<onus.length;i++){
            onus[i].id=idss[i]
        }

       return onus
    }
    function getSfp(str){
    return str.match(/EPON\d+\/(\d+)/)[1]
    }

    
    function getConfigOnu(conf,arrOnu){
        let onuConfig=conf.match(/^!(.*)!$/sgm)[0].split('!');
        onuConfig.shift();
        onuConfig.pop();
        onuConfig=onuConfig.map((el)=>{
            const el1=el.split('\n');

            return el1.slice(2,el1.length-1).join('\n');
        })
        for (let i = 0; i < arrOnu.length; i++) {
          arrOnu[i].conf=onuConfig[i]
            
        }
        return arrOnu
    }

    function getmanyPortsOnu(config,config1){
            let res=[];
            let manyOnu=config.filter((e)=>{
            let flag=e.conf.match(/epon onu port .+ ctc vlan/g);
            if(flag&&flag.length>1){
                return e;
            }  
           
        })
       if(manyOnu.length>0){
        manyOnu.forEach(e=>{
            let onu=config1.find(v=>v.mac==e.mac)
                res.push(`Старий конфіг:${e.mac} \n${e.conf} + Новий конфіг: ${onu.mac} \n${onu.conf}`)
            
        })
       }
       console.log(res);
       

    }
    function getMacIds(str) {
        let re = /epon bind-onu mac (\S+) ([\d]+)/g;
        let arr = [];
        let matches
        while((matches = re.exec(str)) !== null) {
            arr.push({mac: matches[1], id: matches[2]});
        }
        return arr;
      }
      function getTextAfterSlash(text) {
        return text.split('/')[1][0];
      }
      
    function prepareConfig(config1,config2) {
        let onuList1,onuList2=[];
        onuList1=getMacIds(config1)
        onuList1.sfp=getTextAfterSlash(config1)
    
        //..............................................
        onuList2=getMacIds(config1)
        onuList2.sfp=getTextAfterSlash(config1)
        
        return {onuList1,onuList2}
        
    }
    function prepareConfigs(config1,config2) {

        
    }
    function compareConfigs(config1,config2) {
        let res={}
         let config3=[];
         let config4=[];

        for (let i = 0; i < config2.length; i++) {
           let onu=config1.find((el)=>el.mac===config2[i].mac)
           if(!onu){
            continue
           }
           config4.push(config2[i])
           config3.push(onu)
        }
       
        let id=[]
        let id11=[] 
       
        config3.forEach((e)=>id.push(e.id))
        
        let idPPOE=config4.filter((e)=>{
            let confOnu=config3.find(a=>a.mac==e.mac) 
            return !/epon onu port 1 ctc vlan mode tag/gm.test(confOnu.conf)
        })
        // getmanyPortsOnu(config3,config4)#
        console.log(config4);
        
        

        let manyPortsOnu=config4.filter((e)=>{
            if(e.conf.match(/(port \d* ctc vlan)/gm)?.length && e.conf.match(/(port \d* ctc vlan)/gm).length>1)
            {
                return true
            }else false
            
        })

    
        //no epon pre-config-template T1 binded-onu-llid
       
        //no epon bind-onu sequence
        let id1=id.map(e=>`no epon bind-onu sequence ${e}`)
        
        res.noBindOnu=id1;
        let templates=id.map(e=>`epon pre-config-template T1 binded-onu-llid ${e} param ${e<10?config1.sfp+'0'+e:config1.sfp+e}`)
        let templates2=idPPOE.map(e=>{ return `no epon pre-config-template T1 binded-onu-llid ${e.id}`})
        
        res.template1=templates;
        res.template2=templates2;
        //interface ePON 0/1:1
        //no epon onu port 1 ctc vlan mode
        let noVlanMode=[];
        let noVlanMode1='';
        noVlanMode=idPPOE.map(e=>'interface ePON'+ `0/${config2.sfp}:${e.id}`+' no epon onu port 1 ctc vlan mode')
        noVlanMode1=idPPOE.map((e)=>{
    
           return `interface ePON0/${config2.sfp}:${e.id}\n no epon onu port 1 ctc vlan mode\n`
        })
        res.noVlanMode=noVlanMode1;
        res.manyPortsOnu=manyPortsOnu;
        filterVlans(config3)
        let vlansConfig=[]
     
        let onuwithVlans=config3.filter(e=>e.hasOwnProperty('vlans'));

       res.noIpoeVlans=onuwithVlans.map((e)=>{
        let min=Number.parseInt(config2.sfp)*100;
        let max=min+100;
        let onu=config4.find(o=>o.mac==e.mac)
       
        if(Number.parseInt(e.vlans[0])<min||Number.parseInt(e.vlans[0])>max){
            return  `interface epo0/${config2.sfp}:${onu.id}\n epon onu port 1 ctc vlan mode tag ${e.vlans[0]}`
        }
       }).filter(e=>e!=undefined)
       
  
return res
    }

    function filterVlans(par) {
    const sfp='1';

    let vlans=[];
    for (let i = 0; i < par.length; i++) {
       
        const element = par[i].conf.match(/tag (\d+)/gmi);
        if(element){
           
                par[i].vlans=element.map(e=>e.match(/\d+$/)[0])
           
        }
        

        
    }
    }
    function writeToFile(data) {

        fs.writeFile("hello.txt",data, function(error){
            if(error) throw error;
            let data = fs.readFileSync("hello.txt", "utf8");
            
          
        });
        
    }
module.exports=  {writeToFile,getMacOnu,getIdOnu,getSfp,getConfigOnu,prepareConfig,compareConfigs,filterVlans}