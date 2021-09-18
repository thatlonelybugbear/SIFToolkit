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
        if (game.settings.get("siftoolkit","displaySplash") && game.user.isGM) {
            let d = new Dialog({
                title: "SIFToolkit",
                content: `<div style="text-align: justify;"><h2>Welcome to SIFToolkit</h2><p>
                        <p>Your support helps make this project possible.  Check out my patreon page <a href="https://www.patreon.com/SIFToolkit">here</a>.</p>
                        <p>SIFToolkit is compatible with most animation and sound files.  You can pickup animations using the free JB2A module through Foundry OR grab the JB2A Patreon package <a href="https://www.patreon.com/JB2A">here</a>.  You can also use animations from the free Animated Spell Effects module, or bring your own.</p>
                        <p>Please see SIFToolkit usage instructions on <a href="https://github.com/bitkiller0/SIFToolkit/blob/main/Usage.md">GitHub</a> to see how this module works, or check out my introduction YouTube video <a href="https://youtu.be/r9GwqaGCQo8">here</a>.</p>
                        <p>The SIFToolkit <a href="https://github.com/bitkiller0/SIFToolkit/blob/main/changelog.md">changelog</a> is available on GitHub.</p>
                        <p>If you have any questions, please reach out to bitkiller0#0515 on discord or log an issue on the GitHub page.</p>`,
                buttons: {
                    one: {
                        icon: '<i class="fas fa-clipboard-list"></i>',
                        label: "OK",                    
                    },
                    two: {
                        icon: '<i class="fas fa-clipboard-check"></i>',
                        label: "Hide until next version",
                        callback: () => game.settings.set("siftoolkit", "displaySplash", false)                     
                    },               
                },
                      
            });
            d.render(true);
        }
    });
}