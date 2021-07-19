export function migrate(){
    let currentVersion = game.settings.get("siftoolkit","SIFTVersion");

    switch (currentVersion){
        case "0":
            //migrate from STM
            ui.notifications.info("SIFToolkit is attempting to migrate data from Spell Template Manager.  Please wait.");
            //migrate all existing templates
            game.scenes.forEach( i => {
                let templates = i.templates;
                templates.forEach( j =>{
                    if(j.data.flags.spellTemplateManager != undefined){
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
                            "volume": 100
                        });
                    }

                });
            });

            //migrate all existing items
            game.actors.forEach( i => {
                i.items.forEach( j => {
                    if(j.data.flags.spellTemplateManager != undefined){
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

        default:
            game.settings.set("siftoolkit","SIFTVersion","0.1.0");            
            ui.notifications.info("SIFToolkit upgrade complete.");
    }
}