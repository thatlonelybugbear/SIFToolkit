export function registerSettings(){
    let SIFSettings = {};

    new window.Ardittristan.ColorSetting("SIFToolkit", "concentrationTemplateColor", {
        name: game.i18n.localize("SIFToolkit.concentrationTemplateColor.name"),
        hint: game.i18n.localize("SIFToolkit.concentrationTemplateColor.hint"),
        label: "Click to select color",
        restricted: true,
        defaultColor: "#ffff00ff",
        scope: "world",
        onChange: () => { SIFT.Settings.concentrationTemplateColor = value; }
    });
    SIFSettings.concentrationTemplateColor = ("#"+(game.settings.get('SIFToolkit', 'concentrationTemplateColor')).substring(1,7));

	return SIFSettings;	
}