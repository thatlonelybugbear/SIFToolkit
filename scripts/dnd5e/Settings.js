export function registerSettings(){
    let SIFSettings = {};

    new window.Ardittristan.ColorSetting("siftoolkit", "concentrationTemplateColor", {
        name: game.i18n.localize("siftoolkit.concentrationTemplateColor.name"),
        hint: game.i18n.localize("siftoolkit.concentrationTemplateColor.hint"),
        label: "Click to select color",
        restricted: true,
        defaultColor: "#ffff00ff",
        scope: "world",
        onChange: () => { SIFT.Settings.concentrationTemplateColor = value; }
    });
    SIFSettings.concentrationTemplateColor = ("#"+(game.settings.get('siftoolkit', 'concentrationTemplateColor')).substring(1,7));

	return SIFSettings;	
}