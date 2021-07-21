export function loadUtils(){
    let utils = {

        getSIFObjFromChat: function (chatMessage){
            if(SIFT.Status.running){
                let content = chatMessage.data.content;
                let itemID = ""
                let itemIndex = 0;
                let token = game.scenes.active.tokens.get(chatMessage.data.speaker.token);
                let actor = game.actors.get(chatMessage.data.speaker.actor);
                    
                if(chatMessage._roll){
                    
                    itemIndex = chatMessage.data.flags.pf2e.origin.uuid.indexOf('Item.');
                    itemID = chatMessage.data.flags.pf2e.origin.uuid.substring(itemIndex+5);

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

                    
                    itemIndex = content.indexOf('data-item-id=');
                    itemID = content.substring(itemIndex+14,itemIndex+14+16);

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
                }
            }
        },

        getDuration: function (SIF){
            let duration = 0;
            let value,units;
            let SIFData = SIF.data.data?SIF.data.data:SIF.data;
            if(SIFData.duration == undefined) return 0;
            let durationArray = SIFData.duration.value.toLowerCase().split(" ");
            if(durationArray.length > 1){
                value = durationArray[durationArray.length-2];
                units = durationArray[durationArray.length-1];
            }else{
                value = 1;
                units = durationArray[0];
            }
            if(value == "next") value = 1;	
            if(value == "current") value = 0;
            if(String(value).indexOf("d")>-1) value = value.substring(value.indexOf("d")+1,value.length);					
            switch(units) {
                case "year":
                case "years":
                    duration = value * 10 * 60 * 24 * 365 * SIFT.Settings.roundSeconds;
                    break;
                case "week":
                case "weeks":
                    duration = value * 10 * 60 * 24 * 7 * SIFT.Settings.roundSeconds;
                    break;
                case "day":
                case "days":
                    duration = value * 10 * 60 * 24 * SIFT.Settings.roundSeconds;
                    break;
                case "hour":
                case "hours":
                    duration  = value * 10 * 60 * SIFT.Settings.roundSeconds;
                    break;
                case "inst":
                case "":
                    duration  = SIFT.Settings.instantaneousSpellFade * SIFT.Settings.roundSeconds;
                    break;
                case "minute":
                case "minutes":
                case "minue":
                    duration  = value * 10 * SIFT.Settings.roundSeconds;
                    break;
                case "round":
                case "rounds":
                case "turn":
                case "turns":
                    duration  = value * SIFT.Settings.roundSeconds;
                    break;
                case "spec":
                case "unti":
                case "until":
                case "varies":
                case "sustained":
                case "unlimited":
                case "preparations":
                case "text":
                case "below)":
                case "longer)":
                case "stance":
                case "dismissed":
                    duration  = -1;
                    break;
                default:
                    duration = 0;
            }

            return duration;
        },

        pushButtonHandlerTemplate(event){
            let chatId = event.currentTarget.parentElement.parentElement.parentElement.getAttribute('data-message-id');
            SIFT.utils.pushChatData(chatId);
        },

        pushButtonHandlerDamage(event){
            let chatId = event.currentTarget.parentElement.parentElement.parentElement.getAttribute('data-message-id');
            SIFT.utils.pushChatData(chatId);
        }, 
        

        
        hijackTemplateButton: function (...args){
            let chatId = args[0].id;
            if(game.messages.get(chatId).getFlag("siftoolkit","Hijacked")!=game.settings.get("siftoolkit","startupId")){
                console.debug("SIFT | Hijacking button: ",chatId);
                let ancestor = $('ol[id="chat-log"]');
                ancestor.on('click', "li[data-message-id='"+chatId+"'] button[data-action$='emplate']", function(event){
                    SIFT.utils.pushButtonHandlerTemplate(event);
                });
                game.messages.get(chatId).setFlag("siftoolkit","Hijacked",game.settings.get("siftoolkit","startupId"));
            }
            SIFT.utils.pushChatData(args[0].id);
        },

        hijackDamageButton: function (...args){
            let chatId = args[0].id;
            if(game.messages.get(chatId).getFlag("siftoolkit","Hijacked")!=game.settings.get("siftoolkit","startupId")){
                console.debug("SIFT | Hijacking button: ",chatId);
                let ancestor = $('ol[id="chat-log"]');
                ancestor.on('click', "li[data-message-id='"+chatId+"'] button[data-action$='damage']", function(event){
                    SIFT.utils.pushButtonHandlerDamage(event);
                });
                game.messages.get(chatId).setFlag("siftoolkit","Hijacked",game.settings.get("siftoolkit","startupId"));
            }
            SIFT.utils.pushChatData(args[0].id);
        },
        
        extractSIFData: function (itemObj,actor=undefined,token=undefined){
            let isConcentration = false;
            let duration = SIFT.utils.getDuration(itemObj);
            let isSpecial = (duration==-1);
            let SIFData = {
                item : itemObj.id??itemObj._id,
                actor : actor??itemObj.actor.id,
                token : token??itemObj.actor.token?.id,
                scene : game.scenes.viewed.id,
                player : game.userId,
                sif : itemObj.name,
                type : itemObj.type,
                ignoreDuration : itemObj.flags?.siftoolkit?.SIFData?.ignoreDuration??itemObj.data.flags?.siftoolkit?.SIFData?.ignoreDuration??false,
                duration: (itemObj !== undefined)?SIFT.utils.getDuration(itemObj):0,
                isConcentration : isConcentration,
                isSpecial : isSpecial,
                displayData : SIFT.utils.generateDisplayData(actor??itemObj.actor.id, token??itemObj.actor.token?.id, itemObj.id??itemObj._id),
                audioData : SIFT.utils.generateAudioData(actor??itemObj.actor.id, token??itemObj.actor.token?.id, itemObj.id??itemObj._id)
            };
            SIFT.SIFData = SIFData;
        },

        getFlavorTypeFromChat: function (chatMessage){
            if(SIFT.Status.running){
                let type;
                if(!chatMessage?.data.flavor) return undefined;
                let flavor = chatMessage.data.flavor;
                let typeIndex = flavor.indexOf(' - ');
                if(typeIndex > -1){
                    let endIndex = flavor.indexOf(' ',typeIndex+3);
                    if(endIndex > 1){
                        type = flavor.substring(typeIndex+3,endIndex);
                    }else{
                        type = flavor.substring(typeIndex+3);
                    }
                    return type;
                }else{
                    return undefined;
                }
            }
        }

    }

    


    return utils;
}

