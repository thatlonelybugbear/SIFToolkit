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

    try{var MessageArray = Array.from(game.messages.values());}catch{}
    console.debug("SIFT | Processing Chat Messages");
    for(let i = 1; i < (SIFT.Settings.messageHistory+1) && i <= MessageArray.length; i++){
        if(MessageArray[MessageArray.length - i].data.content.includes('button data-action="placeTemplate"')){
            SIFT.utils.hijackTemplateButton(MessageArray[MessageArray.length - i]);                
        }else if(MessageArray[MessageArray.length - i].data.content.includes('button data-action="damage"')){
            SIFT.utils.hijackDamageButton(MessageArray[MessageArray.length - i]);                
        }   
    }
    
    SIFT.utils.clearTemplateData();

    
    async function newRoll(item){
        SIFT.utils.extractSIFData(item);
    }
    libWrapper.register('siftoolkit', 'CONFIG.Item.documentClass.prototype.roll', async function (wrapped, ...args) {
        let result = wrapped(...args);
        let newResult = await result.then(newRoll(this));
        return result;
    }, 'MIXED' ); // optional, since this is the default type    

    Hooks.on("renderChatMessage",(...args) =>{
        let hijackFlag = args[0].getFlag("siftoolkit","Hijacked");
        if(args[0].data.content.includes('button data-action="placeTemplate"')){
            let SIFObj = SIFT.utils.getSIFObjFromChat(args[0]);    
            let SIFData = SIFObj?.flags?.siftoolkit?.SIFData
            
            if((SIFData?.playTemplateAudio || SIFData?.playDamageAudio) && (SIFData?.clip != "")){
                AudioHelper.preloadSound(SIFData.clip);
            }
            if(!(hijackFlag==game.settings.get("siftoolkit","startupId"))){
                SIFT.utils.hijackTemplateButton(args[0]);
            }
        }else if(args[0].data.content.includes('button data-action="damage"')){
            let SIFObj = SIFT.utils.getSIFObjFromChat(args[0]);    
            let SIFData = SIFObj?.flags?.siftoolkit?.SIFData
            
            if((SIFData?.playTemplateAudio || SIFData?.playDamageAudio) && (SIFData?.clip != "")){
                AudioHelper.preloadSound(SIFData.clip);
            }
            if(!(hijackFlag==game.settings.get("siftoolkit","startupId"))){
                SIFT.utils.hijackDamageButton(args[0]);
            }            
        }else if(args[0]._roll?.constructor.name == "DamageRoll"){
            let SIFObj = SIFT.utils.getItemFromActorToken(args[0].data.speaker.actor,args[0].data.speaker.token,args[0].data.flags.dnd5e.roll.itemId)
            let SIFData = SIFObj?.flags?.siftoolkit?.SIFData;
            if(!SIFT.soundHold && SIFData?.playDamageAudio && (SIFData?.clip != "")){
                SIFT.soundHold = true;
                AudioHelper.play({
                    src: SIFData.clip,
                    volume: ((SIFData.volume??100)/100)
                }, false);
                setTimeout(()=>{SIFT.soundHold = false;5},500); 
            }   
        }

    });       

    Hooks.on("preUpdateCombat",(...args) => {
       let advanceTime = args[2].advanceTime;
        if(advanceTime != 0 && !(SIFT.Settings.timeProcessor=="SimpleCalendar")) SIFT.utils.ageTemplates(advanceTime);
        SIFT.utils.cleanupTemplates(args[0].combatant.actor.id);
    });   
        
}