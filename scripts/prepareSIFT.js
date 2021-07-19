export function prepareSIFT(){
    
    
    Hooks.once("init", async () => {
        let systemHooks, systemSettings, sharedHooks, sharedUIPatchHooks, systemUIPatchHooks,sharedSettings, combinedSettings;    
        
        sharedHooks = await import('./shared/Hooks.js');
        sharedSettings = await import('./shared/Settings.js');
        sharedUIPatchHooks = await import('./shared/UIPatchHooks.js');

        if(!game.system.id == "dnd5e"){
            ui.notifications.notify('SIFtoolkit is only compatible with the DnD5E game system.', "error");
            return;
        }	

        switch (game.system.id){
            case "dnd5e":
                systemHooks = await import('./dnd5e/Hooks.js');
                systemSettings = await import('./dnd5e/Settings.js');
                systemUIPatchHooks = await import('./dnd5e/UIPatchHooks.js');
                break;
            case "pf2e":
                systemHooks = await import('./pf2e/Hooks.js');
                systemSettings = await import('./pf2e/Settings.js');
                systemUIPatchHooks = await import('./pf2e/UIPatchHooks.js');
                break;
        }

        combinedSettings = {
            ...sharedSettings.registerSettings(),
            ...systemSettings.registerSettings()
        }

        SIFT.Settings = combinedSettings;

        sharedHooks.setHooks();
        systemHooks.setHooks();        
        sharedUIPatchHooks.setHooks();
        systemUIPatchHooks.setHooks();

        let previousVersion = game.settings.get("siftoolkit","SIFTVersion");
        if(previousVersion != SIFT.version){
            game.settings.set("siftoolkit","displaySplash",true);
            let migrate = await import('./shared/migrate.js');
            migrate.migrate();
        }
    });
}