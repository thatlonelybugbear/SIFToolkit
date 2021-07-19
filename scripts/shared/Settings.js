export function registerSettings(){
	let SIFSettings = {};

    game.settings.register(
		"SIFToolkit", "SIFTVersion", {
  			name: "SIFTVersion",
			hint: "SIFTVersion",
			scope: "client",
			config: false,
			type: String,
			default: "0",
			onChange: (value) => {}
		}
	);

	game.settings.register(
		"SIFToolkit", "displaySplash", {
  			name: "displaySplash",
			hint: "displaySplash",
			scope: "client",
			config: false,
			type: Boolean,
			default: true,
			onChange: (value) => {}
		}
	);
	
	new window.Ardittristan.ColorSetting("SIFToolkit", "standardTemplateColor", {
		name: game.i18n.localize("SIFToolkit.standardTemplateColor.name"),
		hint: game.i18n.localize("SIFToolkit.standardTemplateColor.hint"),
		label: "Click to select color",
		restricted: true,
		defaultColor: "#000000ff",
		scope: "world",
		onChange: () => { SIFT.Settings.standardTemplateColor = value; }
	});
	SIFSettings.standardTemplateColor = ("#"+(game.settings.get('SIFToolkit', 'standardTemplateColor')).substring(1,7));


    new window.Ardittristan.ColorSetting("SIFToolkit", "enduringTemplateColor", {
		name: game.i18n.localize("SIFToolkit.enduringTemplateColor.name"),
		hint: game.i18n.localize("SIFToolkit.enduringTemplateColor.hint"),
		label: "Click to select color",
		restricted: true,
		defaultColor: "#00ff00ff",
		scope: "world",
		onChange: () => { SIFT.Settings.enduringTemplateColor = value; }
	});
	SIFSettings.enduringTemplateColor = ("#"+(game.settings.get('SIFToolkit', 'enduringTemplateColor')).substring(1,7));

	new window.Ardittristan.ColorSetting("SIFToolkit", "specialTemplateColor", {
		name: game.i18n.localize("SIFToolkit.specialTemplateColor.name"),
		hint: game.i18n.localize("SIFToolkit.specialTemplateColor.hint"),
		label: "Click to select color",
		restricted: true,
		defaultColor: "#ffffffff",
		scope: "world",
		onChange: () => { SIFT.Settings.specialTemplateColor = value; }
	});
	SIFSettings.specialTemplateColor = ("#"+(game.settings.get('SIFToolkit', 'specialTemplateColor')).substring(1,7));

	game.settings.register(
		"SIFToolkit", "unmanagedTemplateAction", {
  			name: game.i18n.localize("SIFToolkit.unmanagedTemplateAction.name"),
			hint: game.i18n.localize("SIFToolkit.unmanagedTemplateAction.hint"),
			scope: "client",
			config: true,
			type: String,
			choices: {
				"prompt": game.i18n.localize("SIFToolkit.unmanagedTemplateAction.prompt"),
				"skip": game.i18n.localize("SIFToolkit.unmanagedTemplateAction.skip"),
				"delete": game.i18n.localize("SIFToolkit.unmanagedTemplateAction.delete"),
				"claim": game.i18n.localize("SIFToolkit.unmanagedTemplateAction.claim")
			},
			default: "prompt",
			onChange: (value) => { SIFT.Settings.unmanagedTemplateAction = value; }
		}
	);
	SIFSettings.unmanagedTemplateAction = game.settings.get("SIFToolkit","unmanagedTemplateAction");

	game.settings.register(
		"SIFToolkit", "instantaneousSpellFade", {
			name: game.i18n.localize("SIFToolkit.instantaneousSpellFade.name"),
			hint: game.i18n.localize("SIFToolkit.instantaneousSpellFade.hint"),
			scope: "world",
			config: true,
			type: Number,
			range: {
				min: 0,
				max: 10,
				step: 1
			},
			default: 0,
			onChange: (value) => { SIFT.Settings.instantaneousSpellFade = value; }
		}
	);
	SIFSettings.instantaneousSpellFade = game.settings.get("SIFToolkit","instantaneousSpellFade");

	game.settings.register(
		"SIFToolkit","enforceConcentration", {
			name: game.i18n.localize("SIFToolkit.enforceConcentration.name"),
			hint: game.i18n.localize("SIFToolkit.enforceConcentration.hint"),
			type: Boolean,
			default: true,
			config: true,
			scope: "world",
			onChange: (value) => { SIFT.Settings.enforceConcentration = value; }
		}
	);
	SIFSettings.enforceConcentration = game.settings.get("SIFToolkit","enforceConcentration");

	game.settings.register(
		"SIFToolkit","worldConcentration", {
               		name: game.i18n.localize("SIFToolkit.worldConcentration.name"),
			        hint: game.i18n.localize("SIFToolkit.worldConcentration.hint"),
                    type: Boolean,
                    default: true,
                    config: true,
        	       	scope: "world",
                       onChange: (value) => { SIFT.Settings.worldConcentration = value; }
                    }
	);
	SIFSettings.worldConcentration = game.settings.get("SIFToolkit","worldConcentration");


	game.settings.register(
		"SIFToolkit", "timeProcessor", {
  			name: game.i18n.localize("SIFToolkit.timeProcessor.name"),
			hint: game.i18n.localize("SIFToolkit.timeProcessor.hint"),
			scope: "world",
			config: true,
			type: String,
			choices: {
				"SIFT": game.i18n.localize("SIFToolkit.timeProcessor.SIFT"),
				"SimpleCalendar": game.i18n.localize("SIFToolkit.timeProcessor.SimpleCalendar")
			},
			default: "SIFT",
			onChange: (value) => { 
				let TPChoice = game.settings.get("SIFToolkit","timeProcessor");
				
				let SCInstalled = false;
				let SCEnabled = false;
				try{ SCInstalled = !(game.modules.get("foundryvtt-simple-calendar") == undefined); }catch{}
				try{ SCEnabled = game.modules.get("foundryvtt-simple-calendar").active; }catch{}
				
				SIFSettings.timeProcessor = (TPChoice == "SimpleCalendar" && SCInstalled && SCEnabled)?"SimpleCalendar":"SIFT";
			 }
		}
	);
	
	let TPChoice = game.settings.get("SIFToolkit","timeProcessor");
	
	let SCInstalled = false;
	let SCEnabled = false;
	try{ SCInstalled = !(game.modules.get("foundryvtt-simple-calendar") == undefined); }catch{}
	try{ SCEnabled = game.modules.get("foundryvtt-simple-calendar").active; }catch{}
	
	SIFSettings.timeProcessor = (TPChoice == "SimpleCalendar" && SCInstalled && SCEnabled)?"SimpleCalendar":"SIFT";

	SIFSettings.roundSeconds = CONFIG.time.roundTime??6;

    game.settings.register(
		"SIFToolkit","messageHistory", {
            name: game.i18n.localize("SIFToolkit.messageHistory.name"),
            hint: game.i18n.localize("SIFToolkit.messageHistory.hint"),
			scope: "world",
			config: true,
			type: Number,
			range: {
				min: 0,
				max: 25,
				step: 1
			},
			default: 10,
			onChange: (value) => { SIFT.Settings.messageHistory = value; }
        }
	);
	SIFSettings.messageHistory = game.settings.get("SIFToolkit","messageHistory");

	game.settings.register(
		"SIFToolkit","reloadSpecialEffects", {
			name: "reloadSpecialEffects",
			hint: "reloadSpecialEffects",
			type: Boolean,
			default: false,
			config: false,
			scope: "client",
			onChange: (value) => {}
		}
	);
	game.settings.set("SIFToolkit","reloadSpecialEffects",false);


    return SIFSettings;	
}