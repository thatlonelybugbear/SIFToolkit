export async function loadTextures(){
    
    
    Hooks.once("init", async () => {

        let systemTextures, sharedTextures, combinedTextures;    
        
        sharedTextures = await import('./shared/textures.js');
        
        switch (game.system.id){
            case "dnd5e":
                //systemTextures = await import('./dnd5e/textures.js');
                break;
        }

        combinedTextures = {
            ...sharedTextures.loadTextures(),
            //...systemTextures.loadTextures()
        }

        SIFT.textures = combinedTextures;
    });
}