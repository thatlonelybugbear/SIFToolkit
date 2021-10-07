export function registerSettings(){
	let SIFSettings = {};

    game.settings.register(
		"siftoolkit", "SIFTVersion", {
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
		"siftoolkit", "displaySplash", {
  			name: "displaySplash",
			hint: "displaySplash",
			scope: "client",
			config: false,
			type: Boolean,
			default: true,
			onChange: (value) => {}
		}
	);
	
	new window.Ardittristan.ColorSetting("siftoolkit", "standardTemplateColor", {
		name: game.i18n.localize("siftoolkit.standardTemplateColor.name"),
		hint: game.i18n.localize("siftoolkit.standardTemplateColor.hint"),
		label: "Click to select color",
		restricted: true,
		defaultColor: "#000000ff",
		scope: "world",
		onChange: () => { SIFT.Settings.standardTemplateColor = value; }
	});
	SIFSettings.standardTemplateColor = ("#"+(game.settings.get('siftoolkit', 'standardTemplateColor')).substring(1,7));


    new window.Ardittristan.ColorSetting("siftoolkit", "enduringTemplateColor", {
		name: game.i18n.localize("siftoolkit.enduringTemplateColor.name"),
		hint: game.i18n.localize("siftoolkit.enduringTemplateColor.hint"),
		label: "Click to select color",
		restricted: true,
		defaultColor: "#00ff00ff",
		scope: "world",
		onChange: () => { SIFT.Settings.enduringTemplateColor = value; }
	});
	SIFSettings.enduringTemplateColor = ("#"+(game.settings.get('siftoolkit', 'enduringTemplateColor')).substring(1,7));

	new window.Ardittristan.ColorSetting("siftoolkit", "specialTemplateColor", {
		name: game.i18n.localize("siftoolkit.specialTemplateColor.name"),
		hint: game.i18n.localize("siftoolkit.specialTemplateColor.hint"),
		label: "Click to select color",
		restricted: true,
		defaultColor: "#ffffffff",
		scope: "world",
		onChange: () => { SIFT.Settings.specialTemplateColor = value; }
	});
	SIFSettings.specialTemplateColor = ("#"+(game.settings.get('siftoolkit', 'specialTemplateColor')).substring(1,7));

	game.settings.register(
		"siftoolkit", "unmanagedTemplateAction", {
  			name: game.i18n.localize("siftoolkit.unmanagedTemplateAction.name"),
			hint: game.i18n.localize("siftoolkit.unmanagedTemplateAction.hint"),
			scope: "client",
			config: true,
			type: String,
			choices: {
				"prompt": game.i18n.localize("siftoolkit.unmanagedTemplateAction.prompt"),
				"skip": game.i18n.localize("siftoolkit.unmanagedTemplateAction.skip"),
				"delete": game.i18n.localize("siftoolkit.unmanagedTemplateAction.delete"),
				"claim": game.i18n.localize("siftoolkit.unmanagedTemplateAction.claim")
			},
			default: "prompt",
			onChange: (value) => { SIFT.Settings.unmanagedTemplateAction = value; }
		}
	);
	SIFSettings.unmanagedTemplateAction = game.settings.get("siftoolkit","unmanagedTemplateAction");

	game.settings.register(
		"siftoolkit", "instantaneousSpellFade", {
			name: game.i18n.localize("siftoolkit.instantaneousSpellFade.name"),
			hint: game.i18n.localize("siftoolkit.instantaneousSpellFade.hint"),
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
	SIFSettings.instantaneousSpellFade = game.settings.get("siftoolkit","instantaneousSpellFade");

	game.settings.register(
		"siftoolkit","enforceConcentration", {
			name: game.i18n.localize("siftoolkit.enforceConcentration.name"),
			hint: game.i18n.localize("siftoolkit.enforceConcentration.hint"),
			type: Boolean,
			default: true,
			config: true,
			scope: "world",
			onChange: (value) => { SIFT.Settings.enforceConcentration = value; }
		}
	);
	SIFSettings.enforceConcentration = game.settings.get("siftoolkit","enforceConcentration");

	game.settings.register(
		"siftoolkit","worldConcentration", {
               		name: game.i18n.localize("siftoolkit.worldConcentration.name"),
			        hint: game.i18n.localize("siftoolkit.worldConcentration.hint"),
                    type: Boolean,
                    default: true,
                    config: true,
        	       	scope: "world",
                       onChange: (value) => { SIFT.Settings.worldConcentration = value; }
                    }
	);
	SIFSettings.worldConcentration = game.settings.get("siftoolkit","worldConcentration");


	game.settings.register(
		"siftoolkit", "timeProcessor", {
  			name: game.i18n.localize("siftoolkit.timeProcessor.name"),
			hint: game.i18n.localize("siftoolkit.timeProcessor.hint"),
			scope: "world",
			config: true,
			type: String,
			choices: {
				"SIFT": game.i18n.localize("siftoolkit.timeProcessor.SIFT"),
				"SimpleCalendar": game.i18n.localize("siftoolkit.timeProcessor.SimpleCalendar")
			},
			default: "SIFT",
			onChange: (value) => { 
				let TPChoice = game.settings.get("siftoolkit","timeProcessor");
				
				let SCInstalled = false;
				let SCEnabled = false;
				try{ SCInstalled = !(game.modules.get("foundryvtt-simple-calendar") == undefined); }catch{}
				try{ SCEnabled = game.modules.get("foundryvtt-simple-calendar").active; }catch{}
				
				SIFSettings.timeProcessor = (TPChoice == "SimpleCalendar" && SCInstalled && SCEnabled)?"SimpleCalendar":"SIFT";
			 }
		}
	);
	
	let TPChoice = game.settings.get("siftoolkit","timeProcessor");
	
	let SCInstalled = false;
	let SCEnabled = false;
	try{ SCInstalled = !(game.modules.get("foundryvtt-simple-calendar") == undefined); }catch{}
	try{ SCEnabled = game.modules.get("foundryvtt-simple-calendar").active; }catch{}
	
	SIFSettings.timeProcessor = (TPChoice == "SimpleCalendar" && SCInstalled && SCEnabled)?"SimpleCalendar":"SIFT";

	SIFSettings.roundSeconds = CONFIG.time.roundTime??6;

    game.settings.register(
		"siftoolkit","messageHistory", {
            name: game.i18n.localize("siftoolkit.messageHistory.name"),
            hint: game.i18n.localize("siftoolkit.messageHistory.hint"),
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
	SIFSettings.messageHistory = game.settings.get("siftoolkit","messageHistory");

	game.settings.register(
		"siftoolkit","reloadSpecialEffects", {
			name: "reloadSpecialEffects",
			hint: "reloadSpecialEffects",
			type: Boolean,
			default: false,
			config: false,
			scope: "client",
			onChange: (value) => {}
		}
	);
	game.settings.set("siftoolkit","reloadSpecialEffects",false);

	game.settings.register(
		"siftoolkit","parseUnknownMessages", {
			name: "Parse Unknown Messages",
			hint: "Will cause unkown messages to be parsed, utilizing message history but increasing compatibility with some modules.  ",
			type: Boolean,
			default: true,
			config: true,
			scope: "world",
			onChange: (value) => { SIFT.Settings.parseUnknownMessages = value; }
		}
	);
	SIFSettings.parseUnknownMessages = game.settings.get("siftoolkit","parseUnknownMessages");

    return SIFSettings;	
}