export function prepareSIFT(){
    
    
    Hooks.once("init", async () => {
        let systemUIPatches, sharedUIPatches;    
        
        sharedUIPatches = await import('./shared/UIPatches.js');

        switch (game.system.id){
            case "dnd5e":
                systemUIPatches = await import('./dnd5e/UIPatches.js');
                break;
            case "pf2e":
                systemUIPatches = await import('./pf2e/UIPatches.js');
                break;
        }

        sharedUIPatches.setUIPatches();
        systemUIPatches.setUIPatches();        

    });

}

