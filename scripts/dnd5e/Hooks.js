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

    let MessageArray, mostRecentMessage;
    try{MessageArray = Array.from(game.messages.values());}catch{MessageArray = [];}
    let parseAttempts = 0, messageParseIntervalId = setInterval( () => {
        if(game.user && parseAttempts < 30){
            clearInterval(messageParseIntervalId);
            game.user.setFlag("siftoolkit","chatData",[]).then( ()=>{
                for(let i = 1, j = 0; j < (SIFT.Settings.messageHistory) && i <= MessageArray.length; i++){
                    if(SIFT.utils.getSIFObjFromChat(MessageArray[MessageArray.length - i])!=undefined){
                        mostRecentMessage = mostRecentMessage??MessageArray[MessageArray.length - i];
                    }
                    if(MessageArray[MessageArray.length - i].isAuthor || game.user?.isGM){
                        let identified = false;
                        if(MessageArray[MessageArray.length - i].data.content.includes('button data-action="placeTemplate"')){
                            SIFT.utils.hijackTemplateButton(MessageArray[MessageArray.length - i]);                
                            identified = true;
                        }
                        if(MessageArray[MessageArray.length - i].data.content.includes('button data-action="damage"')){
                            SIFT.utils.hijackDamageButton(MessageArray[MessageArray.length - i]);                
                            identified = true;
                        }
                        if(MessageArray[MessageArray.length - i].data.content.includes('button data-action="save"')){
                            SIFT.utils.hijackSaveButton(MessageArray[MessageArray.length - i]);                
                            identified = true;
                        }
                        if(SIFT.Settings.parseUnknownMessages && !identified){
                            SIFT.utils.parseUnknownMessage(MessageArray[MessageArray.length-i]);
                        }
                        j++;
                    }
                }
                let SIFObj = SIFT.utils.getSIFObjFromChat(mostRecentMessage);
                let SIFData = SIFObj?.data?.flags?.siftoolkit?.SIFData;
                SIFT.mostRecentSIFData = SIFData;
                clearInterval(messageParseIntervalId);
            }).then(()=>{SIFT.utils.clearTemplateData();});
        }else{parseAttempts++;}
    },100);
    
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
        let SIFData, identified;
        if(!SIFObj) {
            if(args[0].data.flags.dnd5e?.roll?.type == 'save'){
                SIFData = SIFT.mostRecentSIFData;
                if(!SIFT.soundHold && SIFData?.audioData?.playSaveAudio && (SIFData?.clip != "" || SIFData?.audioData?.clip != "")){
                    SIFT.soundHold = true;
                    AudioHelper.play({
                        src: SIFData.audioData.clip,
                        volume: ((SIFData.volume??100)/100)
                    }, false);
                    setTimeout(()=>{SIFT.soundHold = false;5},500); 
                }
                identified = true;
            }else if(args[0].data.flags.dnd5e?.roll?.type == 'damage'){
                SIFData = SIFT.mostRecentSIFData;
                if(!SIFT.soundHold && (SIFData?.playDamageAudio??SIFData?.audioData?.playDamageAudio) && (SIFData?.clip != "" || SIFData?.audioData?.clip != "")){
                    SIFT.soundHold = true;
                    AudioHelper.play({
                        src: SIFData.clip??SIFData.audioData.clip,
                        volume: ((SIFData.volume??100)/100)
                    }, false);
                    setTimeout(()=>{SIFT.soundHold = false;5},500); 
                }
                identified = true;
            }else{
                return undefined;
            }
        }else{
            SIFData = SIFObj?.data?.flags?.siftoolkit?.SIFData;
            SIFT.SIFData = SIFData;
            SIFT.mostRecentSIFData = SIFData;
            //let hijackFlag = args[0].getFlag("siftoolkit","Hijacked");
            identified = false;
            if(args[0].data.content.includes('button data-action="placeTemplate"')){
                if((SIFData?.playSaveAudio || SIFData?.playDamageAudio || SIFData?.playSaveAudio) && (SIFData?.clip != "")){
                    AudioHelper.preloadSound(SIFData.clip);
                }
                SIFT.utils.hijackTemplateButton(args[0]);
                identified = true;
            }
            if(args[0].data.content.includes('button data-action="damage"')){
                if((SIFData?.playSaveAudio || SIFData?.playDamageAudio || SIFData?.playSaveAudio) && (SIFData?.clip != "")){
                    AudioHelper.preloadSound(SIFData.clip);
                }
                SIFT.utils.hijackDamageButton(args[0]);
                identified = true;
            }

            if(args[0].data.content.includes('button data-action="save"')){
                if((SIFData?.playSaveAudio || SIFData?.playDamageAudio || SIFData?.playSaveAudio) && (SIFData?.clip != "")){
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
            if(args[0].data.flavor.includes("Saving Throw")){
                if(!SIFT.soundHold && SIFData?.playSaveAudio && (SIFData?.clip != "")){
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
        }
    });       

    Hooks.on("preUpdateCombat",(...args) => {
       let advanceTime = args[2].advanceTime;
        if(advanceTime != 0 && !(SIFT.Settings.timeProcessor=="SimpleCalendar")) SIFT.utils.ageTemplates(advanceTime);
        SIFT.utils.cleanupTemplates(args[0].combatant.actor.id);
	SIFT.utils.manageUnmanaged();
    });   
        
}
