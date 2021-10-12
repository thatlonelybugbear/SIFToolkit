export function setHooks(){
    //////////////////////////////////////////
    //      Init Hooks start here           //
    //////////////////////////////////////////


    //Load in message history
    game.settings.register(
		"siftoolkit", "startupId", {
  			name: "startupId",
			scope: "client",
			config: false,
			type: String,
			default: "",
			onChange: (value) => {console.debug("SIFT | StartupId: ",value)}
		}
	);

    game.settings.set("siftoolkit","startupId",randomID());

    let MessageArray;
    try{MessageArray = Array.from(game.messages.values());}catch{MessageArray = [];}
    for(let i = 1; i < (SIFT.Settings.messageHistory+1) && i <= MessageArray.length; i++){
        if(MessageArray[MessageArray.length - i].data.content.includes('button data-action="placeTemplate"')){
            SIFT.utils.hijackTemplateButton(MessageArray[MessageArray.length - i]);                
        }else if(MessageArray[MessageArray.length - i].data.content.includes('button data-action="damage"')){
            SIFT.utils.hijackDamageButton(MessageArray[MessageArray.length - i]);                
        } else if(SIFT.Settings.parseUnknownMessages){
            SIFT.utils.parseUnknownMessage(MessageArray[MessageArray.length-i]);
        }
    }
    
    let attempts = 0, intervalId = setInterval(()=>{if(game.user&&attempts < 30){SIFT.utils.clearTemplateData();clearInterval(intervalId);}else{attempts++}},100);

    
    async function newRoll(item){
        SIFT.utils.extractSIFData(item);
    }
    libWrapper.register('siftoolkit', 'CONFIG.Item.documentClass.prototype.roll', async function (wrapped, ...args) {
        let result = wrapped(...args);
        let newResult = await result.then(newRoll(this));
        return result;
    }, 'MIXED' ); // optional, since this is the default type    

    Hooks.on("renderChatMessage",(...args) =>{
        let SIFObj = SIFT.utils.getSIFObjFromChat(args[0]);    
        if(!SIFObj) return undefined;
        let SIFData = SIFObj?.data?.flags?.siftoolkit?.SIFData
        SIFT.SIFData = SIFData;
        //let hijackFlag = args[0].getFlag("siftoolkit","Hijacked");
        let identified = false;
        if(args[0].data.content.includes('button data-action="placeTemplate"')){
            if((SIFData?.playTemplateAudio || SIFData?.playDamageAudio) && (SIFData?.clip != "")){
                AudioHelper.preloadSound(SIFData.clip);
            }
            SIFT.utils.hijackTemplateButton(args[0]);
            identified = true;
        }
        if(args[0].data.content.includes('button data-action="damage"')){
            if((SIFData?.playTemplateAudio || SIFData?.playDamageAudio) && (SIFData?.clip != "")){
                AudioHelper.preloadSound(SIFData.clip);
            }
            SIFT.utils.hijackDamageButton(args[0]);
            identified = true;
        }
        if(args[0]._roll?.constructor.name == "DamageRoll"){
            if(!SIFT.soundHold && SIFData?.playDamageAudio && (SIFData?.clip != "")){
                SIFT.soundHold = true;
                AudioHelper.play({
                    src: SIFData.clip,
                    volume: ((SIFData.volume??100)/100)
                }, false);
                setTimeout(()=>{SIFT.soundHold = false;5},500); 
            } 
            identified = true;  
        } 
        if(SIFT.Settings.parseUnknownMessages && !identified){
            SIFT.utils.parseUnknownMessage(args[0]);            
        }
    });       

    Hooks.on("preUpdateCombat",(...args) => {
       let advanceTime = args[2].advanceTime;
        if(advanceTime != 0 && !(SIFT.Settings.timeProcessor=="SimpleCalendar")) SIFT.utils.ageTemplates(advanceTime);
        SIFT.utils.cleanupTemplates(args[0].combatant.actor.id);
	SIFT.utils.manageUnmanaged();
    });   
        
}
