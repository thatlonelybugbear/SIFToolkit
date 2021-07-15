export async function loadUI(){
    
    
    Hooks.once("init", async () => {

        let sharedUI, systemUI, combinedUI;    
        
        sharedUI = await import('./shared/UI.js');
        
        switch (game.system.id){
            case "dnd5e":
                systemUI = await import('./dnd5e/UI.js');
                break;
            case "pf2e":
                systemUI = await import('./pf2e/UI.js');
                break;
        }

        combinedUI = {
            ...sharedUI.loadUI(),
            ...systemUI.loadUI()
        }

        SIFT.UI = combinedUI;
    });
}