export function loadUtils(){
    let utils = {

        getSIFObjFromChat: function (chatMessage){
            if(SIFT.Status.running && chatMessage){
                let content = chatMessage.data.content;
                let token = game.scenes.active.tokens.get(chatMessage.data.speaker.token);
                let actor = game.actors.get(chatMessage.data.speaker.actor);
                let itemIndex = content.indexOf('data-item-id=');
                let itemID = content.substring(itemIndex+14,itemIndex+14+16);

                let tokenItems = token?.data?.actorData?.items;
                if(tokenItems != undefined){
                    for(let i = 0; i < tokenItems.length; i++){
                        if(tokenItems[i]._id == itemID) return tokenItems[i];
                    }
                }
                
                if(actor != undefined){
                    return actor.data.items.get(itemID);                    
                }else{
                    return undefined;
                }                
            }else{
                return undefined;
            }
        },
        
        getSourceTemplate: function (id){
            let templateI = undefined
            game.scenes.forEach( i => {
                let templateJ = undefined;
                i.templates.forEach(j => {
                    if(id == j.id){
                        templateJ = j;
                    }
                });
                if(templateJ != undefined){
                    templateI = templateJ;
                }
            });
            return templateI;
        },

        deleteAllTemplates: async function (){
            console.log("SIFT | Deleting All Templates");
            let scenes = game.scenes;
            scenes.forEach(scene => {
                let templates = undefined;
                templates = scene.data.templates;
                if(templates !== undefined) {
                    let deletions = templates.map(i => i.id);
                    scene.deleteEmbeddedDocuments("MeasuredTemplate",deletions);					
                }else{
                    console.log("SIFT | Nothing to delete!");
                }
            });
        },

        getPlaceableTemplate: function (templateID){
            let placeable = undefined;
            for(let i = game.canvas.templates.placeables.length -1; i > -1; i--){
                if (game.canvas.templates.placeables[i].data.flags.siftoolkit?.originalTemplateID == templateID || game.canvas.templates.placeables[i].data._id == templateID){
                    placeable = game.canvas.templates.placeables[i];
                    return placeable;
                }
            }		
            return placeable;
        },

        deleteTemplate: async function (templateId){
            console.debug("SIFT | Deleting Template: ", templateId);
            game.scenes.forEach(scene => {
                let templates = scene.data.templates.filter(i => (i.id == templateId && game.userId == i.author.id));
                let deletions = templates.map(i => i.id);
                scene.deleteEmbeddedDocuments("MeasuredTemplate",deletions);                
            });
        },

        resetTemplateBorders: async function (){		
            game.scenes.forEach(i => {i.data.templates.forEach(j => {
                let update = {};
                if(j.data.flags.siftoolkit?.concentration){
                    update = {_id: j.id, borderColor: SIFT.Settings.concentrationTemplateColor};
                }else if(j.data.flags.siftoolkit?.duration > 0){
                    update = {_id: j.id, borderColor: SIFT.Settings.enduringTemplateColor};
                }else if(j.data.flags.siftoolkit?.special){
                    update = {_id: j.id, borderColor: SIFT.Settings.specialTemplateColor};
                }else {
                    update = {_id: j.id, borderColor: SIFT.Settings.standardTemplateColor};
                }				
                i.updateEmbeddedDocuments("MeasuredTemplate", [update]);
        
            })});
        },

        manageUnmanaged: async function (Combat=game.combats.active){
            if(!(Combat==undefined)){
                console.debug("SIFT | Looking for Unmanaged Templates");
                let scene=Combat.scene;
                let turnActor = Combat.combatant?.actor??game.userId;
                let turnToken = Combat.combatant?.token;
                if(!turnActor) return;
            
                let managing = scene.data.templates.filter(i => i.data.flags.siftoolkit === undefined && ((game.user.isGM && !game.users.get(i.data.user).active) || i.isOwner));
                for(let i = 0; i < managing.length; i++){
                    let action = SIFT.Settings.unmanagedTemplateAction;			
                    let response = null;
                    if(action === "prompt"){
                        await canvas.animatePan({x : managing[i].data.x, y : managing[i].data.y, duration : 250});
                        response = await SIFT.UI.promptForAction(turnActor.name);
                    }
                    if(action === "delete" || (action==="prompt" && response?.action === "delete")){
                        await scene.deleteEmbeddedDocuments("MeasuredTemplate",[managing[i].id]);
                    }
                    if(action === "claim"){
                        await canvas.animatePan({x : managing[i].data.x, y : managing[i].data.y, duration : 250});
                        response = await SIFT.UI.promptForUnits();
                    }
                    if(action === "claim" || (action === "prompt" && response?.action === "claim")){
                            let duration = 0;
                            let spellIsSpecial = false;
                            switch(response.units) {
                                case "day":
                                    duration = response.value * 10 * 60 * 24 * SIFT.Settings.roundSeconds;
                                    break;
                                case "hours":
                                    duration = response.value * 10 * 60 * SIFT.Settings.roundSeconds;
                                    break;
                                case "minutes":
                                    duration = response.value * 10 * SIFT.Settings.roundSeconds;
                                    break;
                                case "rounds":
                                    duration = response.value * SIFT.Settings.roundSeconds;
                                    break;
                                case "special":
                                    duration = -1;
                                    spellIsSpecial = true;
                                    break;
                                default:
                                    duration = 0;
                                    break;
                            }
                            let update = {_id: managing[i].id, flags: {
                                "siftoolkit":{
                                    concentration: false, 
                                    actor: turnActor.id, 
                                    token: turnToken.id,
                                    duration: duration,
                                    special: spellIsSpecial,
                                    scene: Combat.scene.id
                                }
                            },borderColor:(spellIsSpecial?SIFT.Settings.specialTemplateColor:SIFT.Settings.enduringTemplateColor)};

                            await scene.updateEmbeddedDocuments("MeasuredTemplate", [update]);	

                    }
                }
            }else{
                console.debug("No active combat or no combat provided");
            }
        },

        generateDisplayData: function (actorId,tokenId,itemId){
            let originalActor = game.actors.get(actorId);
            let originalToken = game.scenes.active.tokens.get(tokenId);
            let itemArray = (originalToken?.data.actorData.items??undefined);
            let foundSIF = undefined;
            if(itemArray != undefined){
                for (let i = 0; i < itemArray.length; i++){
                    if(itemArray[i]._id == itemId){
                        foundSIF = itemArray[i];
                        break;
                    }
                }
            }
            let originalSpellTexture = foundSIF?.flags?.siftoolkit?.SIFData.texture;//check token for non-linked token compatibility
            originalSpellTexture = originalSpellTexture??originalActor.items.get(itemId)?.data.flags.siftoolkit?.SIFData?.texture;//check actor for linked token compatibility
            originalSpellTexture = originalSpellTexture??""//default
           
            let useTexture = foundSIF?.flags?.siftoolkit?.SIFData.useTexture;
            useTexture = useTexture??originalActor.items.get(itemId)?.data.flags.siftoolkit?.SIFData?.useTexture;
            useTexture = useTexture??false;
        
            let alpha = foundSIF?.flags?.siftoolkit?.SIFData.alpha;
            alpha = alpha??originalActor.items.get(itemId)?.data.flags.siftoolkit?.SIFData?.alpha;
            alpha = alpha??50;
        
            let coneOrigin = foundSIF?.flags?.siftoolkit?.SIFData.coneOrigin;
            coneOrigin = coneOrigin??originalActor.items.get(itemId)?.data.flags.siftoolkit?.SIFData?.coneOrigin;
            coneOrigin = coneOrigin??1;
        
            let loopAnimations = foundSIF?.flags?.siftoolkit?.SIFData.loopAnimations;
            loopAnimations = loopAnimations??originalActor.items.get(itemId)?.data.flags.siftoolkit?.SIFData?.loopAnimations;
            loopAnimations = loopAnimations??true;
        
            let ignoreDuration = foundSIF?.flags?.siftoolkit?.SIFData.ignoreDuration;
            ignoreDuration = ignoreDuration??originalActor.items.get(itemId)?.data.flags.siftoolkit?.SIFData?.ignoreDuration;
            ignoreDuration = ignoreDuration??false;
        
            let SIFData = {
                texture:originalSpellTexture,
                useTexture:useTexture,
                alpha:alpha,
                coneOrigin:coneOrigin,
                loopAnimations:loopAnimations,
                ignoreDuration:ignoreDuration                
            }
        
            return SIFData;
        },

        generateAudioData: function (actorId,tokenId,itemId){
            let originalActor = game.actors.get(actorId);
            let originalToken = game.scenes.active.tokens.get(tokenId);
            let itemArray = (originalToken?.data.actorData.items??undefined);
            let foundSIF = undefined;
            if(itemArray != undefined){
                for (let i = 0; i < itemArray.length; i++){
                    if(itemArray[i]._id == itemId){
                        foundSIF = itemArray[i];
                        break;
                    }
                }
            }
            let originalClip = foundSIF?.flags?.siftoolkit?.SIFData.clip;//check token for non-linked token compatibility
            originalClip = originalClip??originalActor.items.get(itemId)?.data.flags.siftoolkit?.SIFData?.clip;//check actor for linked token compatibility
            originalClip = originalClip??""//default
           
            let playTemplateAudio = foundSIF?.flags?.siftoolkit?.SIFData.playTemplateAudio;
            playTemplateAudio = playTemplateAudio??originalActor.items.get(itemId)?.data.flags.siftoolkit?.SIFData?.playTemplateAudio;
            playTemplateAudio = playTemplateAudio??false;

            let playDamageAudio = foundSIF?.flags?.siftoolkit?.SIFData.playDamageAudio;
            playDamageAudio = playDamageAudio??originalActor.items.get(itemId)?.data.flags.siftoolkit?.SIFData?.playDamageAudio;
            playDamageAudio = playDamageAudio??false;

            let playSaveAudio = foundSIF?.flags?.siftoolkit?.SIFData.playSaveAudio;
            playSaveAudio = playSaveAudio??originalActor.items.get(itemId)?.data.flags.siftoolkit?.SIFData?.playSaveAudio;
            playSaveAudio = playSaveAudio??false;
        
            let volume = foundSIF?.flags?.siftoolkit?.SIFData.volume;
            volume = volume??originalActor.items.get(itemId)?.data.flags.siftoolkit?.SIFData?.volume;
            volume = volume??100;
        
            let SIFData = {
                clip:originalClip,
                playTemplateAudio:playTemplateAudio,
                playDamageAudio:playDamageAudio,
                playSaveAudio:playSaveAudio,
                volume:volume
            }
        
            return SIFData;
        },

        getItemFromActorToken: function (actorId,tokenId,itemId){
            let originalActor = game.actors.get(actorId);
            let originalToken = game.scenes.active.tokens.get(tokenId);
            let itemArray = (originalToken?.data.actorData.items??undefined);
            let foundSIF = undefined;
            if(itemArray != undefined){
                for (let i = 0; i < itemArray.length; i++){
                    if(itemArray[i]._id == itemId){
                        foundSIF = itemArray[i];
                        break;
                    }
                }
            }
            foundSIF = foundSIF??originalActor?.items.get(itemId);
            return foundSIF;
        },

        playAudio: function(template=undefined){
            let currentSIFData = undefined;
            if(template != undefined){
                currentSIFData = template.data.flags.siftoolkit;
            }
            currentSIFData = currentSIFData??game.user.getFlag("siftoolkit","chatData")[game.user.getFlag("siftoolkit","chatData").length-1].SIFData;
            let clip = currentSIFData?.audioData?.clip??"";
            let volume = currentSIFData?.audioData?.volume??100;
            if(clip!=""){
                AudioHelper.play({
                    src: clip,
                    volume: (volume/100)
                }, false);
            }
        },

        updateTemplate: function (template,index=0,duration=undefined){
            console.debug("SIFT | Updating Template");
            let currentSIFData = template.data.flags.siftoolkit;
            currentSIFData = currentSIFData??SIFT.SIFData??game.user.getFlag("siftoolkit","chatData")[game.user.getFlag("siftoolkit","chatData").length-1].SIFData;
            if(currentSIFData == undefined){
                currentSIFData ={
                    concentration: false, 
                    player: game.userId,
                    actor: "", 
                    token: "",
                    duration: 0,
                    special: false,
                    scene: game.scenes.active,
                    birthday: game.time.worldTime,
                    sif: "",
                    item: "",
                    displayData: undefined,
                    audioData: undefined
                }
            }
            let scene = game.scenes.get(currentSIFData.scene);  
            if(scene && index < 10){
                
                if(scene.data.templates.filter(i => i.id === template.id).length > 0){

                    let update =  {_id: template.id, flags: {
                        "siftoolkit":{
                            concentration: currentSIFData.isConcentration, 
                            player: currentSIFData.player,
                            actor: currentSIFData.actor,
                            token: currentSIFData.token,
                            duration: duration??currentSIFData.duration,
                            special: currentSIFData.isSpecialSpell,
                            scene: currentSIFData.scene,
                            birthday: game.time.worldTime,
                            sif: currentSIFData.sif,
                            item: currentSIFData.item,
                            displayData: currentSIFData.displayData,
                            audioData: currentSIFData.audioData
                        }
                    }};
        
                    if(currentSIFData.duration>0){
                        update.borderColor = SIFT.Settings.enduringTemplateColor;
                    }else if(currentSIFData.isSpecialSpell){
                        update.borderColor = SIFT.Settings.specialTemplateColor;
                    }else{
                        update.borderColor = SIFT.Settings.standardTemplateColor;
                    }
                    scene.updateEmbeddedDocuments("MeasuredTemplate", [update]);
                    
                }else{
                    console.debug("SIFT | Failed to update template.  Retrying. ", index);
                    setTimeout(utils.updateTemplate(template,index+1), 100);
                }
            }else{
                console.debug("SIFT | Failed to update template.");
            }
            
        },

        pushItemData: function (chatDataObj){
            let chatDataQueue = game.user.getFlag("siftoolkit","chatData");
            let chatId = chatDataObj.chatId;
            if(utils.getChatData(chatId)==undefined){
                if(chatDataQueue == undefined){
                    chatDataQueue = [];                
                }
                chatDataQueue.push(chatDataObj);
                if(chatDataQueue.length > (SIFT.Settings.messageHistory+1)){
                    chatDataQueue.shift();
                }
                game.user.setFlag("siftoolkit","chatData",chatDataQueue);
            }
        },

        pushChatData: function (chatId){
            SIFT.utils.extractSIFDataFromChat(SIFT.utils.getSIFObjFromChat(game.messages.get(chatId)),game.messages.get(chatId));
            let pushData = SIFT.SIFData;                
            
            if(pushData!=undefined && pushData.item != undefined){
                SIFT.utils.pushItemData({chatId:chatId,SIFData:pushData});
            }
        },

        getChatData: function (chatId){
            let chatDataQueue = game.user.getFlag("siftoolkit","chatData");
            let index = undefined;
            let SIFData = undefined;
            if(chatDataQueue == undefined) return undefined;
            for (let i = 0; i < chatDataQueue.length; i++){
                if(chatDataQueue[i].chatId == chatId){
                    SIFData = chatDataQueue[i].SIFData;
                    index = i;
                    break;
                }
            }
            if(index == undefined) return undefined;
            chatDataQueue.splice(index,1);
            chatDataQueue.push({
                chatId: chatId,
                SIFData: SIFData
            });
            game.user.setFlag("siftoolkit","chatData",chatDataQueue);
            return SIFData;
        },

        ageTemplates: async function (delta=SIFT.Settings.roundSeconds,SceneId=undefined){
            console.debug("SIFT | Aging templates.");
            game.scenes.forEach( i => {
                let sceneFilter = i.templates.filter(j => SceneId==undefined?true:i.id==SceneId);
                let managing = sceneFilter.filter(j => j.data.flags.siftoolkit !== undefined);
                let playerOwned = managing.filter(j => {return j.isOwner});
                for(let j = 0; j < playerOwned.length; j++){
                        let update = {_id: playerOwned[j].id, flags: {"siftoolkit":{duration: playerOwned[j].data.flags.siftoolkit.duration-delta}}};
                        i.updateEmbeddedDocuments("MeasuredTemplate",[update]);
                }                
            });
        },

        cleanupTemplates: function (token=undefined, sceneId=undefined){
            console.debug("SIFT | Cleaning Templates.");
            game.scenes.forEach( j => {
                let sceneFilter = j.data.templates.filter(i => sceneId==undefined?true:j.id==sceneId);
                let managed = sceneFilter.filter(i => i.data.flags.siftoolkit !== undefined);
                let turnActorOwned = managed.filter(i => actor==undefined?true:i.data.flags.siftoolkit.actor == actor);
                let turnTokenOwned = managed.filter(i => token==undefined?true:i.data.flags.siftoolkit.token == token);
                let templates = turnTokenOwned.filter(
                    function(i){
                        return (
                            ((i.isOwner || !(game.user.isGM && game.users.get(i.data.flags.siftoolkit.player).active))) && //controlled by user or user is logged out and GM will handle
                            ((i.data.flags.siftoolkit.duration - SIFT.Settings.roundSeconds) < 1 || i.data.flags.siftoolkit?.duration === undefined || //expired or unassigned duration
                            ( i.data.flags.siftoolkit?.displayData?.ignoreDuration && (i.data.flags.siftoolkit?.birthday + SIFT.Settings.roundSeconds * SIFT.Settings.instantaneousSpellFade) < game.time.worldTime) ) && 
                            (!i.data.flags.siftoolkit.special || i.data.flags.siftoolkit.special === undefined)  //not special
                        );
                    }
                );
                let deletions = templates.map(i => i.id);
                if(deletions.length > 0){
                    console.debug("SIFT | cleaning scene: ",j.name);
                    j.deleteEmbeddedDocuments("MeasuredTemplate",deletions);
                }
            });
        },

        clearTemplateData: function (){
            console.debug("SIFT | Clearing Template Data");
            SIFT.templateData = {};
            SIFT.utils.pushItemData({chatId: "", SIFData: {}});
        },

        removeTokenTemplates: function(token,scene){
            let templates = game.scenes.get(scene).templates.filter(i=> i.data.flags.siftoolkit.token == token);
            let deletions = templates.map(i => i.id);
            game.scenes.get(scene).deleteEmbeddedDocuments("MeasuredTemplate",deletions);
        }
    };

    
        
    return utils;
}
