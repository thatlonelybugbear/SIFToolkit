export async function loadUtils(){
    
    
    Hooks.once("init", async () => {

        let itemSheetUtils, systemUtils, sharedUtils, combinedUtils;    
        
        sharedUtils = await import('./shared/Utils.js');
        

        switch (game.system.id){
            case "dnd5e":
                systemUtils = await import('./dnd5e/Utils.js');
                itemSheetUtils = await import('./dnd5e/itemSheet.js');
                break;
            case "pf2e":
                systemUtils = await import('./pf2e/Utils.js');
                itemSheetUtils = await import('./pf2e/itemSheet.js');
                break;
        }

        combinedUtils = {
            ...sharedUtils.loadUtils(),
            ...systemUtils.loadUtils(),
            ...itemSheetUtils.loadUtils()
        }

        SIFT.utils = combinedUtils;
    });
}