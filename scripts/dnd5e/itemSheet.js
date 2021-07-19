export function loadUtils(){
    let utils = {
        patchItemSheet: async function (args){
            let app = args[0];
            let html = args[1];

            let itemData = app.object.getFlag("","SIFData");
            
            let ignoreDuration = itemData?.ignoreDuration??false;
            let texture = itemData?.texture??"";
            let useTexture = itemData?.useTexture??false;
            let alpha = itemData?.alpha??50;
            let coneOrigin = itemData?.coneOrigin??1;
            let loopAnimations = itemData?.loopAnimations??true;

            let playTemplateAudio = itemData?.playTemplateAudio??false;
            let playDamageAudio = itemData?.playDamageAudio??false;
            let clip = itemData?.clip??"";
            let volume = itemData?.volume??100;

            let isArea = app.object.hasAreaTarget;
            let isCone = app.object.data.data?.target?.type == "cone";
        
            const template_types = ["cone", "circle", "rect", "ray"];
            let add = ".tab.details";
            if(!["spell","feat","consumable"].includes(app.object.type)) return;

            let tabs = $('nav[class^="sheet-navigation"]');
            let element = document.createElement("a");
            element.innerText = "Special Effects";
            element.className = "item";
            element.setAttribute("data-tab","specialeffects");
            
            tabs.append(element);

            Handlebars.registerHelper({eq: (v1, v2) => v1 === v2});
            let renderedTemplate = await renderTemplate("./modules/SIFToolkit/templates/ItemSheet.handlebars",
                {
                    isArea:isArea,
                    isCone:isCone,
                    ignoreDuration:ignoreDuration,
                    texture:texture,
                    useTexture:useTexture,
                    alpha:alpha,
                    coneOrigin:coneOrigin,
                    loopAnimations:loopAnimations,
                    playTemplateAudio:playTemplateAudio,
                    playDamageAudio:playDamageAudio,
                    clip:clip,
                    volume:volume,
                    isEditable:app.isEditable??false
                }
            );

            html.find("section.sheet-body").append(renderedTemplate);
            
            if(game.settings.get("siftoolkit","reloadSpecialEffects")){
                element.click();
            }
            
            //end

            if(itemData == undefined || Object.keys(itemData).length === 0){
                let tempData = {
                    ignoreDuration:false,
                    texture:"",
                    useTexture:false,
                    alpha:50,
                    coneOrigin:1,
                    loopAnimations:true,
                    playTemplateAudio:false,
                    playDamageAudio:false,
                    clip:"",
                    volume:100
                }
                if(app.isEditable){
                    app.object.setFlag("","SIFData",tempData);                    
                }
                itemData = tempData;                    
            }

            
            if(isArea){
                $('input[name="siftoolkit.template.removal"]')[0].onchange = (event) => {
                    ignoreDuration = event.target.checked ? true : false;
                    app.object.setFlag("", "SIFData", {...app.object.getFlag("","SIFData"),...{ignoreDuration:ignoreDuration}});
                    game.settings.set("","reloadSpecialEffects",true);
                }
                
                $('input[name="siftoolkit.template.useTexture"]')[0].onchange = (event) => {
                    useTexture = event.target.checked ? true : false;
                    app.object.setFlag("", "SIFData", {...app.object.getFlag("","SIFData"),...{useTexture:useTexture}});
                    game.settings.set("","reloadSpecialEffects",true);
                }
            
                $('input[name="siftoolkit.template.alpha"]')[0].onchange = (event) => {
                    alpha = (0+event.target.valueAsNumber);
                    if(typeof alpha == 'number' && isFinite(alpha)){
                        if(alpha <= 100 && alpha >= 0){
                            app.object.setFlag("", "SIFData", {...app.object.getFlag("","SIFData"),...{alpha:alpha}});
                        }
                        game.settings.set("","reloadSpecialEffects",true);
                    }
                }
            
                $('input[name="siftoolkit.template.texture.text"]')[0].onchange = (event) => {
                    texture = event.target.value;
                    app.object.setFlag("", "SIFData", {...app.object.getFlag("","SIFData"),...{texture:texture}});
                    game.settings.set("","reloadSpecialEffects",true);
                }		
            
                let mfpoptions = {
                    type:"imagevideo",
                    current:texture, 
                    callback: async (...args)=>{
                        app.object.setFlag("", "SIFData", {...app.object.getFlag("","SIFData"),...{texture:args[0]}});
                        $('input[name="siftoolkit.template.texture.text"]')[0].value=args[0];
                        game.settings.set("","reloadSpecialEffects",true);
                    },
                    allowUpload:true
                };
            
                $('input[name="siftoolkit.template.texture.bttn"]')[0].onclick = (event) => {
                    let mfp = new FilePicker(mfpoptions);
                    mfp.render();
                }
            
                if(app.object.data.data?.target?.type == "cone" || app.object.data.spellInfo?.area?.areaType == "cone"){
                    $('select[name="siftoolkit.template.cone.origin"]')[0].onchange = (event) => {
                        coneOrigin = event.target.selectedIndex;
                        app.object.setFlag("", "SIFData", {...app.object.getFlag("","SIFData"),...{coneOrigin:coneOrigin}});
                        game.settings.set("","reloadSpecialEffects",true);
                    }
                }
            
                $('input[name="siftoolkit.template.loop.animations"]')[0].onchange = (event) => {
                    loopAnimations = event.target.checked ? true : false;
                    app.object.setFlag("", "SIFData", {...app.object.getFlag("","SIFData"),...{loopAnimations:loopAnimations}});
                    game.settings.set("","reloadSpecialEffects",true);
                }

            }
            //////////////////audio
            if(isArea){
                $('input[name="siftoolkit.audio.playTemplateAudio"]')[0].onchange = (event) => {
                    playTemplateAudio = event.target.checked ? true : false;
                    app.object.setFlag("", "SIFData", {...app.object.getFlag("","SIFData"),...{playTemplateAudio:playTemplateAudio}});
                    game.settings.set("","reloadSpecialEffects",true);
                }
            }            
            $('input[name="siftoolkit.audio.playDamageAudio"]')[0].onchange = (event) => {
                playDamageAudio = event.target.checked ? true : false;
                app.object.setFlag("", "SIFData", {...app.object.getFlag("","SIFData"),...{playDamageAudio:playDamageAudio}});
                game.settings.set("","reloadSpecialEffects",true);
            }
        
            $('input[name="siftoolkit.audio.volume"]')[0].onchange = (event) => {
                volume = (0+event.target.valueAsNumber);
                if(typeof volume == 'number' && isFinite(volume)){
                    if(volume <= 100 && volume >= 0){
                        app.object.setFlag("", "SIFData", {...app.object.getFlag("","SIFData"),...{volume:volume}});
                    }                    
                }
                game.settings.set("","reloadSpecialEffects",true);
            }
        
            $('input[name="siftoolkit.audio.clip.text"]')[0].onchange = (event) => {
                clip = event.target.value;
                app.object.setFlag("", "SIFData", {...app.object.getFlag("","SIFData"),...{clip:clip}});
                game.settings.set("","reloadSpecialEffects",true);
            }		
        
            let mfpAudioOptions = {
                type:"audio",
                current:clip, 
                callback: async (...args)=>{
                    app.object.setFlag("", "SIFData", {...app.object.getFlag("","SIFData"),...{clip:args[0]}});
                    $('input[name="siftoolkit.audio.clip.text"]')[0].value=args[0];
                    game.settings.set("","reloadSpecialEffects",true);
                },
                allowUpload:true
            };
        
            $('input[name="siftoolkit.audio.clip.bttn"]')[0].onclick = (event) => {
                let mfpAudio = new FilePicker(mfpAudioOptions);
                mfpAudio.render();
            }



        }
    }
    return utils;
}