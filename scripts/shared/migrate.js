export function migrate(){
    //migrate from STM
    ui.notifications.info("SIFToolkit is attempting to migrate data.  Please wait.");
    let STM = false;
    try{
        let stmsetting = game.settings.get("spellTemplateManager", "unmanagedTemplateAction");
        if (stmsetting != undefined){
            STM = true;
        }
    }catch{}
    if(STM){
        //migrate all existing templates
        game.scenes.forEach( i => {
            let templates = i.templates;
            templates.forEach( j =>{
                if(j.data.flags.spellTemplateManager != undefined && !j.data.flags.siftoolkit && game.user.isGM){
                    j.setFlag("siftoolkit","concentration", j.data.flags.spellTemplateManager.concentration??false);

                    j.setFlag("siftoolkit","player", j.data.flags.spellTemplateManager.player??undefined);
                    j.setFlag("siftoolkit","actor", j.data.flags.spellTemplateManager.actor??undefined);
                    j.setFlag("siftoolkit","duration", j.data.flags.spellTemplateManager.duration??0);
                    j.setFlag("siftoolkit","scene", j.data.flags.spellTemplateManager.scene??j.id);
                    j.setFlag("siftoolkit","birthday", j.data.flags.spellTemplateManager.birthday??undefined);
                    j.setFlag("siftoolkit","sif", j.data.flags.spellTemplateManager.spell??"Unknown");
                    j.setFlag("siftoolkit","item", j.data.flags.spellTemplateManager.item??undefined);
                
                    j.setFlag("siftoolkit","displayData", {
                        "texture": j.data.flags.spellTemplateManager.stmData?.spellTexture??"",
                        "useTexture": j.data.flags.spellTemplateManager.stmData?.useTexture??false,
                        "alpha": j.data.flags.spellTemplateManager.stmData?.alpha??50,
                        "coneOrigin": j.data.flags.spellTemplateManager.stmData?.coneOrigin??0,
                        "loopAnimations": j.data.flags.spellTemplateManager.stmData?.loopAnimations??true,
                        "ignoreDuration": j.data.flags.spellTemplateManager.stmData?.ignoreDuration??false,
                    });
                    j.setFlag("siftoolkit","audioData", {
                        "clip": "",
                        "playTemplateAudio": false,
                        "playDamageAudio": false,
                        "playSaveAudio": false,
                        "volume": 100
                    });
                }

            });
        });

        //migrate all existing items
        game.actors.forEach( i => {
            i.items.forEach( j => {
                if(j.data.flags.spellTemplateManager != undefined && !j.data.flags.siftoolkit && game.user.isGM){
                    j.setFlag("siftoolkit","SIFData",{
                        alpha: j.data.flags.spellTemplateManager.stmData?.alpha??50,
                        coneOrigin: j.data.flags.spellTemplateManager.stmData?.coneOrigin??1,
                        ignoreDuration: j.data.flags.spellTemplateManager.stmData?.ignoreDuration??false,
                        loopAnimations: j.data.flags.spellTemplateManager.stmData?.loopAnimations??true,
                        texture: j.data.flags.spellTemplateManager.stmData?.spellTexture??"",
                        useTexture: j.data.flags.spellTemplateManager.stmData?.useTexture??false
                    });
                }
            });
        });
        game.settings.set("siftoolkit","SIFTVersion","0.1.43");
    }

    let SIFTVersion = "0";
    try{
        SIFTVersion = game.settings.get("siftoolkit","SIFTVersion");
    }catch{}

    if(SIFTVersion.substring(0, 4).includes("0.1.")){
        //migrate from 0.1.x
        
        //update templates to use tokens
        game.scenes.forEach( i => {
            let templates = i.templates;
            templates.forEach( j =>{
                if(j.data.flags.siftoolkit?.token == undefined && game.user.isGM){
                    j.setFlag("siftoolkit","token", i.tokens.filter(k=>k.actor.id == (j.data.flags.siftoolkit?.actor))[0].id??undefined);
                }
            });
        });
    }

    
    game.settings.set("siftoolkit","SIFTVersion",SIFT.version);            
    ui.notifications.info("SIFToolkit upgrade complete.");
    
}
