export function setHooks(){
    
    Hooks.on("renderMeasuredTemplateConfig", (app, html) =>{
        let addHeight = html.find('button[type="submit"]')[0].offsetHeight;
        let currentHeight = html.height();
        html[0].style.height=`${addHeight+currentHeight}px`;
        let template = app.object;
        let duration = template.getFlag("SIFToolkit","duration")??"";
        html.find('button[type="submit"]')[0].insertAdjacentHTML('beforebegin', `<div class="form-group"><label>Duration (Seconds)</label><input type="number" style="float:right;" name="siftoolkit.template.duration" min="1" value="${duration}"></div>`);
        
        $('input[name="siftoolkit.template.duration"]')[0].onchange = (event) => {
            let duration = (0+event.target.valueAsNumber);
            if(typeof duration == 'number' && isFinite(duration)){
                SIFT.utils.updateTemplate(app.object,0,duration);
            }
        }
    });

}