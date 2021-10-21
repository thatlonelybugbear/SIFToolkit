export function loadUtils(){
    let utils = {
        patchItemSheet: async function (args){
            let app = args[0];
            let html = args[1];

            let itemData = app.object.getFlag("siftoolkit","SIFData");
            
            let ignoreDuration = itemData?.ignoreDuration??false;
            let texture = itemData?.texture??"";
            let useTexture = itemData?.useTexture??false;
            let alpha = itemData?.alpha??50;
            let coneOrigin = itemData?.coneOrigin??1;
            let loopAnimations = itemData?.loopAnimations??true;

            let playTemplateAudio = itemData?.playTemplateAudio??false;
            let playDamageAudio = itemData?.playDamageAudio??false;
            let playSaveAudio = itemData?.playSaveAudio??false;
            let clip = itemData?.clip??"";
            let volume = itemData?.volume??100;

            let isArea = app.object.hasAreaTarget;
            let isCone = app.object.data.data?.target?.type == "cone";
        
            if(!["spell","feat","consumable","weapon"].includes(app.object.type)) return;

            let tabs = $("div[id$='" + app.object.id + "'] nav[class^='sheet-navigation']");

            for(let i = 0; i < tabs.children().length; i++){
                if(!tabs.children()[i].innerText.includes("Special Effects")){
                    tabs.children()[i].addEventListener("click",function(){delete SIFT.openItems[app.object.id];});
                }
            }

            let closeButton = $("div[id$='" + app.object.id + "'] a[class^='header-button']");
            closeButton.on("click",function(){delete SIFT.openItems[app.object.id];});


            let element = document.createElement("a");
            element.innerText = "Special Effects";
            element.className = "item";
            element.setAttribute("data-tab","specialeffects");
            
            tabs.append(element);

            Handlebars.registerHelper({eq: (v1, v2) => v1 === v2});
            let renderedTemplate = await renderTemplate("./modules/siftoolkit/templates/itemSheet.handlebars",
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
                    playSaveAudio:playSaveAudio,
                    clip:clip,
                    volume:volume,
                    isEditable:app.isEditable??false
                }
            );

            html.find("section.sheet-body").append(renderedTemplate);

                          
            let dataTab = $("div[id$='" + app.object.id + "'] div[data-tab^='specialeffects']");

            if(SIFT.openItems[app.object.id] != undefined){
                element.click();
                dataTab.scrollTop(SIFT.openItems[app.object.id]);
            }
            
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
                    playSaveAudio:false,
                    clip:"",
                    volume:100
                }
                if(app.isEditable){
                    app.object.setFlag("siftoolkit","SIFData",tempData);                    
                }
                itemData = tempData;                    
            }

            if(isArea){
                $("div[id$='" + app.object.id + "'] input[name='siftoolkit.template.removal']")[0].onchange = (event) => {
                    ignoreDuration = event.target.checked ? true : false;
                    app.object.setFlag("siftoolkit", "SIFData", {...app.object.getFlag("siftoolkit","SIFData"),...{ignoreDuration:ignoreDuration}});
                    SIFT.openItems[app.object.id] = dataTab.scrollTop();                    
                }
                
                $("div[id$='" + app.object.id + "'] input[name='siftoolkit.template.useTexture']")[0].onchange = (event) => {
                    useTexture = event.target.checked ? true : false;
                    app.object.setFlag("siftoolkit", "SIFData", {...app.object.getFlag("siftoolkit","SIFData"),...{useTexture:useTexture}});
                    SIFT.openItems[app.object.id] = dataTab.scrollTop();
                }
            
                $("div[id$='" + app.object.id + "'] input[name='siftoolkit.template.alpha']")[0].onchange = (event) => {
                alpha = (0+event.target.valueAsNumber);
                    if(typeof alpha == 'number' && isFinite(alpha)){
                        if(alpha <= 100 && alpha >= 0){
                            app.object.setFlag("siftoolkit", "SIFData", {...app.object.getFlag("siftoolkit","SIFData"),...{alpha:alpha}});
                        }
                        SIFT.openItems[app.object.id] = dataTab.scrollTop();
                    }
                }
            
                $("div[id$='" + app.object.id + "'] input[name='siftoolkit.template.texture.text']")[0].onchange = (event) => {
                    texture = event.target.value;
                    app.object.setFlag("siftoolkit", "SIFData", {...app.object.getFlag("siftoolkit","SIFData"),...{texture:texture}});
                    SIFT.openItems[app.object.id] = dataTab.scrollTop();
                }		
            
                let mfpoptions = {
                    type:"imagevideo",
                    current:texture, 
                    callback: async (...args)=>{
                        app.object.setFlag("siftoolkit", "SIFData", {...app.object.getFlag("siftoolkit","SIFData"),...{texture:args[0]}});
                        $("div[id$='" + app.object.id + "'] input[name='siftoolkit.template.texture.text']")[0].value=args[0];
                        SIFT.openItems[app.object.id] = dataTab.scrollTop();
                    },
                    allowUpload:true
                };
            
                $("div[id$='" + app.object.id + "'] button[name='siftoolkit.template.texture.bttn']")[0].onclick = (event) => {
                    let mfp = new FilePicker(mfpoptions);
                    mfp.render();
                }
            
                if(app.object.data.data?.target?.type == "cone" || app.object.data.spellInfo?.area?.areaType == "cone"){
                    $("div[id$='" + app.object.id + "'] select[name='siftoolkit.template.cone.origin']")[0].onchange = (event) => {
                        coneOrigin = event.target.selectedIndex;
                        app.object.setFlag("siftoolkit", "SIFData", {...app.object.getFlag("siftoolkit","SIFData"),...{coneOrigin:coneOrigin}});
                        SIFT.openItems[app.object.id] = dataTab.scrollTop();
                    }
                }
            
                $("div[id$='" + app.object.id + "'] input[name='siftoolkit.template.loop.animations']")[0].onchange = (event) => {
                    loopAnimations = event.target.checked ? true : false;
                    app.object.setFlag("siftoolkit", "SIFData", {...app.object.getFlag("siftoolkit","SIFData"),...{loopAnimations:loopAnimations}});
                    SIFT.openItems[app.object.id] = dataTab.scrollTop();
                }

            }
            //////////////////audio
            if(isArea){
                $("div[id$='" + app.object.id + "'] input[name='siftoolkit.audio.playTemplateAudio']")[0].onchange = (event) => {
                    playTemplateAudio = event.target.checked ? true : false;
                    app.object.setFlag("siftoolkit", "SIFData", {...app.object.getFlag("siftoolkit","SIFData"),...{playTemplateAudio:playTemplateAudio}});
                    SIFT.openItems[app.object.id] = dataTab.scrollTop();
                }
            }            

            $("div[id$='" + app.object.id + "'] input[name='siftoolkit.audio.playDamageAudio']")[0].onchange = (event) => {
                playDamageAudio = event.target.checked ? true : false;
                app.object.setFlag("siftoolkit", "SIFData", {...app.object.getFlag("siftoolkit","SIFData"),...{playDamageAudio:playDamageAudio}});
                SIFT.openItems[app.object.id] = dataTab.scrollTop();
            }

            $("div[id$='" + app.object.id + "'] input[name='siftoolkit.audio.playSaveAudio']")[0].onchange = (event) => {
                playSaveAudio = event.target.checked ? true : false;
                app.object.setFlag("siftoolkit", "SIFData", {...app.object.getFlag("siftoolkit","SIFData"),...{playSaveAudio:playSaveAudio}});
                SIFT.openItems[app.object.id] = dataTab.scrollTop();
            }
        
            $("div[id$='" + app.object.id + "'] input[name='siftoolkit.audio.volume']")[0].onchange = (event) => {
                volume = (0+event.target.valueAsNumber);
                if(typeof volume == 'number' && isFinite(volume)){
                    if(volume <= 100 && volume >= 0){
                        app.object.setFlag("siftoolkit", "SIFData", {...app.object.getFlag("siftoolkit","SIFData"),...{volume:volume}});
                    }                    
                }
                SIFT.openItems[app.object.id] = dataTab.scrollTop();
            }
        
            $("div[id$='" + app.object.id + "'] input[name='siftoolkit.audio.clip.text']")[0].onchange = (event) => {
                clip = event.target.value;
                app.object.setFlag("siftoolkit", "SIFData", {...app.object.getFlag("siftoolkit","SIFData"),...{clip:clip}});
                SIFT.openItems[app.object.id] = dataTab.scrollTop();
            }		
        
            let mfpAudioOptions = {
                type:"audio",
                current:clip, 
                callback: async (...args)=>{
                    app.object.setFlag("siftoolkit", "SIFData", {...app.object.getFlag("siftoolkit","SIFData"),...{clip:args[0]}});
                    $("div[id$='" + app.object.id + "'] input[name='siftoolkit.audio.clip.text']")[0].value=args[0];
                    SIFT.openItems[app.object.id] = dataTab.scrollTop();
                },
                allowUpload:true
            };
        
            $("div[id$='" + app.object.id + "'] button[name='siftoolkit.audio.clip.bttn']")[0].onclick = (event) => {
                let mfpAudio = new FilePicker(mfpAudioOptions);
                mfpAudio.render();
            }
        }
    }
    return utils;}
