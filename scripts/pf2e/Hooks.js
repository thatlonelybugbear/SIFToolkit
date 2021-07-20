export function setHooks(){
    //////////////////////////////////////////
    //      Init Hooks start here           //
    //////////////////////////////////////////

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
    //Load in message history
    
        try{var MessageArray = Array.from(game.messages.values());}catch{console.debug("SIFT | Could not clear chat-action history.");}
        console.debug("SIFT | Processing Chat Messages");
        for(let i = 1,j=0; j < (SIFT.Settings.messageHistory+1) && i <= MessageArray.length; i++){
            let rollType = SIFT.utils.getFlavorTypeFromChat(MessageArray[i]);
            if(!(rollType && ['healing','damage'].includes(rollType.toLowerCase()))){
                SIFT.utils.hijackTemplateButton(MessageArray[MessageArray.length - i]);
                j++;
            }
        }
        SIFT.utils.clearTemplateData();

    Hooks.on("renderChatMessage",(...args) =>{
        let hijackFlag = args[0].getFlag("siftoolkit","Hijacked");
            let rollType = SIFT.utils.getFlavorTypeFromChat(args[0]);
        if(args[0].data.content.includes('button data-action="template"')){
            let SIFObj = SIFT.utils.getSIFObjFromChat(args[0]);  
            let actor = args[0].data.speaker.actor;
            let token = args[0].data.speaker.token;
            SIFT.utils.extractSIFData(SIFObj,actor,token);  
            let SIFData = (SIFObj.data.flags)?SIFObj.data.flags.siftoolkit?.SIFData:SIFObj.flags?.siftoolkit?.SIFData;
            
            if((SIFData?.playTemplateAudio || SIFData?.playDamageAudio) && (SIFData?.clip != "")){
                AudioHelper.preloadSound(SIFData.clip);
            }
            if(!(hijackFlag==game.settings.get("siftoolkit","startupId"))){
                SIFT.utils.hijackTemplateButton(args[0]);
            }
        }else if(args[0].data.content.includes('button data-action="damage"')){
            let SIFObj = SIFT.utils.getSIFObjFromChat(args[0]);    
            let SIFData = SIFObj.data.flags.siftoolkit.SIFData
            
            if((SIFData.playTemplateAudio || SIFData.playDamageAudio) && (SIFData.clip != "")){
                AudioHelper.preloadSound(SIFData.clip);
            }
            if(!(hijackFlag==game.settings.get("siftoolkit","startupId"))){
                SIFT.utils.hijackDamageButton(args[0]);
            }            
        }else if(rollType && ['healing','damage'].includes(rollType.toLowerCase())){
            let SIFObj = SIFT.utils.getSIFObjFromChat(args[0]);    
            let SIFData = SIFObj.data.flags.siftoolkit?.SIFData
            
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