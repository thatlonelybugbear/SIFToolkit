export function loadTextures(){
    let textures = {



applyTexture: async function (args,mysi){
    if(args[0].flags.siftoolkit != undefined){
        let placeable = SIFT.utils.getPlaceableTemplate(args[0].id);
        if(placeable != undefined){
            try{
                clearInterval(mysi);
            }catch{}
            
            let originalActor,originalItem,originalDisplayData;
            
            if(placeable.document.flags.siftoolkit?.displayData == undefined){
                originalActor = game.actors.get(args[0].flags.siftoolkit?.actor);
                originalItem = args[0].flags.siftoolkit.item;
                originalDisplayData = SIFT.utils.generateDisplayData(originalActor,originalItem);
            }else{
                originalDisplayData = placeable.document.flags.siftoolkit.displayData;
            }
            SIFT.textures.writeTexture(placeable,originalDisplayData);        

        }
    }
},


writeTexture: async function (placeable,animationData){
    if(("" != (animationData.useTexture??"")) && "" != (animationData.texture??"")){
        let SIFtexture = undefined;	
        let textureSize = undefined;
        let sprite = undefined;
        let masker = undefined;
        let mask = undefined;
        let icon = undefined;
        let source = undefined;
        let workingWidth = undefined;
        let container = undefined;
        let scale = 1;
        switch(placeable.document.t){
            case "circle":
                if(SIFtexture == undefined){
                    SIFtexture = await loadTexture(animationData.texture+"?id="+placeable.id);
                    textureSize = placeable.height;
                    SIFtexture.orig = { height: (textureSize * scale), width: textureSize * scale, x: -textureSize, y: -textureSize };
                }
                sprite = new PIXI.Sprite(SIFtexture);
                sprite.name = "texture";
                sprite.anchor.set(0.5);
                sprite.alpha = animationData.alpha/100
                icon = await placeable.addChild(sprite);
                source = getProperty(icon._texture, "baseTexture.resource.source");
                if (source && (source.tagName === "VIDEO")) {
                    source.loop = animationData.loopAnimations;
                    game.video.play(source);
                }
                icon.zIndex = -1000;
                masker = new PIXI.Graphics();
                masker.name = "textureMask";
                masker.beginFill(0xFF0000, 1);
                masker.lineStyle(0);
                masker.drawCircle(0, 0, placeable.ray.distance);
                masker.endFill();
                masker.zIndex = -1000;
                mask = await placeable.addChild(masker);
                sprite.mask=masker;
                break;
            case "cone":
                {
                    switch(animationData.coneOrigin){
                        case 0:
                        default:
                            if(SIFtexture == undefined){
                                SIFtexture = await loadTexture(animationData.texture+"?id="+placeable.id);
                                workingWidth =  placeable.ray._distance;
                                textureSize = workingWidth * 2;
                                SIFtexture.orig = { height: (textureSize * scale), width: textureSize * scale, x: -textureSize, y: -textureSize };
                            }
                            sprite = new PIXI.Sprite(SIFtexture);
                            sprite.anchor.set(0.5);
                            sprite.alpha = animationData.alpha/100
                            sprite.angle = placeable.document.direction;
                            icon = await placeable.addChild(sprite);
                            source = getProperty(icon._texture, "baseTexture.resource.source");
                            if (source && (source.tagName === "VIDEO")) {
                                source.loop = animationData.loopAnimations;
                                game.video.play(source);
                            }
                            icon.zIndex = -1000;
                            masker = new PIXI.Graphics();
                            masker.beginFill(0x00FF00);
                            masker.lineStyle(1, 0xFFFF00);
                            masker.moveTo(0, 0);
                            masker.arc(0, 0, workingWidth, (Math.PI/180*placeable.document.direction) - Math.PI/180/2*placeable.document.angle, (Math.PI/180*placeable.document.direction) + Math.PI/180/2*placeable.document.angle, false);
                            masker.lineTo(0, 0);
                            masker.endFill();
                            masker.zIndex = -1000;
                            placeable.addChild(masker);
                            sprite.mask=masker;
                            break;
                        case 1:											
                            if(SIFtexture == undefined){
                                SIFtexture = await loadTexture(animationData.texture+"?id="+placeable.id);
                            }
                            workingWidth =  placeable.ray._distance;
                            textureSize = placeable.height * canvas.grid.size;
                            sprite = new PIXI.Sprite(SIFtexture)
                            sprite.anchor.set(0,0.5)
                            sprite.width=workingWidth;
                            sprite.height=Math.sqrt((workingWidth**2)+(workingWidth**2));
                            sprite.alpha = animationData.alpha/100;
                            sprite.angle = placeable.document.direction;
                            icon = await placeable.addChild(sprite)
                            source = getProperty(icon._texture, "baseTexture.resource.source");
                            if (source && (source.tagName === "VIDEO")) {
                                source.loop = animationData.loopAnimations;
                                game.video.play(source);
                            }
                            icon.zIndex = -1000;
                            masker = new PIXI.Graphics();
                            masker.beginFill(0x00FF00);
                            masker.lineStyle(1, 0xFFFF00);
                            masker.moveTo(0, 0);
                            masker.arc(0, 0, workingWidth, (Math.PI/180*placeable.document.direction) - Math.PI/180/2*placeable.document.angle, (Math.PI/180*placeable.document.direction) + Math.PI/180/2*placeable.document.angle, false);
                            masker.lineTo(0, 0);
                            masker.endFill();
                            masker.zIndex = -1000;
                            placeable.addChild(masker);
                            sprite.mask=masker;
                            break;
                        case 2:														
                            if(SIFtexture == undefined){
                                SIFtexture = await loadTexture(animationData.texture+"?id="+placeable.id);
                            }
                            workingWidth =  placeable.ray._distance;
                            textureSize = placeable.height * canvas.grid.size;
                            sprite = new PIXI.Sprite(SIFtexture)
                            sprite.anchor.set(1,0.5)
                            sprite.width=workingWidth*-1;
                            sprite.height=Math.sqrt((workingWidth**2)+(workingWidth**2));
                            sprite.alpha = animationData.alpha/100;
                            sprite.angle = placeable.document.direction;
                            icon = await placeable.addChild(sprite)
                            source = getProperty(icon._texture, "baseTexture.resource.source");
                            if (source && (source.tagName === "VIDEO")) {
                                source.loop = animationData.loopAnimations;
                                game.video.play(source);
                            }
                            icon.zIndex = -1000;
                            masker = new PIXI.Graphics();
                                masker.beginFill(0x00FF00);
                                masker.lineStyle(1, 0xFFFF00);
                                masker.moveTo(0, 0);
                                masker.arc(0, 0, workingWidth, (Math.PI/180*placeable.document.direction) - Math.PI/180/2*placeable.document.angle, (Math.PI/180*placeable.document.direction) + Math.PI/180/2*placeable.document.angle, false);
                                masker.lineTo(0, 0);
                                masker.endFill();
                                masker.zIndex = -1000;
                                placeable.addChild(masker);
                                sprite.mask=masker;									
                                break;
                        case 3:								
                            if(SIFtexture == undefined){
                                SIFtexture = await loadTexture(animationData.texture+"?id="+placeable.id);
                            }
                            workingWidth =  placeable.ray._distance;
                            textureSize = placeable.height * canvas.grid.size;
                            container = new PIXI.Container;
                            container.zIndex = -1000;
                            sprite = new PIXI.Sprite(SIFtexture)
                            container.pivot.x = 0.5;
                            container.pivot.y = 0.5;
                            sprite.width=Math.sqrt((workingWidth**2)+(workingWidth**2));
                            sprite.anchor.set(0.5,0.5);
                            sprite.angle=-90;
                            sprite.height=workingWidth;
                            sprite.alpha = animationData.alpha/100;
                            sprite.x=sprite.height/2;
                            container.angle = placeable.document.direction;
                            icon = await container.addChild(sprite)
                            await placeable.addChild(container);
                            
                            source = getProperty(icon._texture, "baseTexture.resource.source");
                            if (source && (source.tagName === "VIDEO")) {
                                source.loop = animationData.loopAnimations;
                                game.video.play(source);
                            }
                            icon.zIndex = -1000;
                            masker = new PIXI.Graphics();
                            masker.beginFill(0x00FF00);
                            masker.lineStyle(1, 0xFFFF00);
                            masker.moveTo(0, 0);
                            masker.arc(0, 0, workingWidth, 0 - Math.PI/180/2*placeable.document.angle, 0 + Math.PI/180/2*placeable.document.angle, false);
                            masker.lineTo(0, 0);
                            masker.endFill();
                            masker.zIndex = -1000;
                            container.addChild(masker);
                            sprite.mask=masker;
                            break;
                        case 4:					
                                if(SIFtexture == undefined){
                                    SIFtexture = await loadTexture(animationData.texture+"?id="+placeable.id);
                                }
                                workingWidth =  placeable.ray._distance;
                                textureSize = placeable.height * canvas.grid.size;
                                container = new PIXI.Container;
                                container.zIndex = -1000;
                                sprite = new PIXI.Sprite(SIFtexture)
                                container.pivot.x = 0.5;
                                container.pivot.y = 0.5;
                                sprite.width=Math.sqrt((workingWidth**2)+(workingWidth**2));
                                sprite.anchor.set(0.5,0.5);
                                sprite.angle=90;
                                sprite.height=workingWidth;
                                sprite.alpha = animationData.alpha/100;
                                sprite.x=sprite.height/2;
                                container.angle = placeable.document.direction;
                                icon = await container.addChild(sprite)
                                await placeable.addChild(container);
                                
                                source = getProperty(icon._texture, "baseTexture.resource.source");
                                if (source && (source.tagName === "VIDEO")) {
                                    source.loop = animationData.loopAnimations;
                                    game.video.play(source);
                                }
                                icon.zIndex = -1000;
                                masker = new PIXI.Graphics();
                                masker.beginFill(0x00FF00);
                                masker.lineStyle(1, 0xFFFF00);
                                masker.moveTo(0, 0);
                                masker.arc(0, 0, workingWidth, 0 - Math.PI/180/2*placeable.document.angle, 0 + Math.PI/180/2*placeable.document.angle, false);
                                masker.lineTo(0, 0);
                                masker.endFill();
                                masker.zIndex = -1000;
                                container.addChild(masker);
                                sprite.mask=masker;
                                break;
                    }
                }
                break;


            case "rect":
                if(SIFtexture == undefined){
                    SIFtexture = await loadTexture(animationData.texture+"?id="+placeable.id);
                }
                workingWidth =  placeable.ray._distance;
                sprite = new PIXI.Sprite(SIFtexture)
                sprite.anchor.set(0,0)
                sprite.width=Math.floor((placeable.shape.width)/(game.canvas.grid.size/2))*(game.canvas.grid.size/2);
                sprite.height=Math.floor((placeable.shape.height)/(game.canvas.grid.size/2))*(game.canvas.grid.size/2);
                sprite.alpha = animationData.alpha/100;
                icon = await placeable.addChild(sprite)
                await icon.position.set(
                    (placeable.shape.left == 0)?0:(-sprite.width),
                    (placeable.shape.top == 0)?0:(-sprite.height)
                )
                source = getProperty(icon._texture, "baseTexture.resource.source");
                if (source && (source.tagName === "VIDEO")) {
                    source.loop = animationData.loopAnimations;
                    game.video.play(source);
                }
                icon.zIndex = -1000;
                break;
            default:
                if(SIFtexture == undefined){
                    SIFtexture = await loadTexture(animationData.texture+"?id="+placeable.id);
                }
                sprite = new PIXI.Sprite(SIFtexture)
                sprite.height=placeable.width*game.canvas.grid.size/placeable.scene.dimensions.distance;
                sprite.width=placeable.document.distance*game.canvas.grid.size/placeable.scene.dimensions.distance;
                sprite.y=0;
                sprite.anchor.set(0,0.5);
                sprite.rotation=placeable.ray.normAngle;
                sprite.alpha = animationData.alpha/100;
                icon = await placeable.addChild(sprite);
                source = getProperty(icon._texture, "baseTexture.resource.source");
                if (source && (source.tagName === "VIDEO")) {
                    source.loop = animationData.loopAnimations;
                    game.video.play(source);
                }
                icon.zIndex = -1000;
                break;

        }
    }

    
},

reapplyTexture: async function (placeable){
    console.log(placeable)
    placeable.sortDirty=true;
    placeable.sortChildren();
    let child = placeable.children[0];
    while(child.zIndex == -1000){
        placeable.removeChild(child);
        child = placeable.children[0];
    }
    let originalDisplayData = placeable.document.flags.siftoolkit?.displayData;
    if(("" != (originalDisplayData?.useTexture??"")) && "" != (originalDisplayData?.texture??"")){
        SIFT.textures.writeTexture(placeable,originalDisplayData);
    }        
}





















        
    };

    
        
    return textures;
}
