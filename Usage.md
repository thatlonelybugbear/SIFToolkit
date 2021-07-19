# SIFToolkit Usage
![image](https://user-images.githubusercontent.com/70086485/126088022-cf3a69ef-0952-455f-bde0-6437fcf2ce58.png)

## Template Management
Template Management is automatic, and does not need to be enabled.  Once SIFToolkit is installed and enabled, it will begin tracking all placed templates.  Once placed, SIFT will attempt to analyze the source of the template for a duration.  If discovered, the template will be flagged with a duration, which will begin counting down.  When the duration reaches 0, the template will be automatically removed from the canvas.  

### Template Aging and Expiration
Templates age as combat progresses.  Specifically, all templates on the canvas will age up by 6 seconds (standard round duration) when a new combat round is ended/begun.  Templates will not age mid-round; however, at the end of each actor's turn in combat, all templates owned by that actor will be evaluated to determine if they should expire during that turn.  They will be removed if the current duration will be less than 1 at the end of the round. Moving backward through combat will allow time to be re-added to a template's duration; however, once a template is removed from the canvas, this action is permanent and the template will not be re-added to the canvas as time progresses in reverse.  

### Ignore Template Duration
Template durations can be ignored completely so that such templates, while utilized, can be removed immediately.  This option can be set by opening the Spell/Item/Feature and opening the "Special Effects" tab.  The first option, "Ignore Spell Duration (Remove Immediately)", will provide this functionality.  This is useful for spells such as sleep, whereby it is useful to place the template in order to identify affected individuals, but for which continued display of the template may not be helpful. 
  
### Concentration (DND5E)
DND5E utilizes the concentration concept, which requires that only one concentration spell can be maintained by any single actor at any given time.  SIFToolkit incorporates this feature into two options, each of which can be found in the module settings of Foundry VTT.  The first option "Enforce Concentration", if enabled, will remove any previously placed concentration spell templates early, if a new concentration spell template is added.  The second option "Maintain concentration across scenes" will apply this same concept across all scenes at the same time.  With this option enabled, if a new concentration spell template is added to ANY scene, ALL previously placed concentration spell templates will be removed.  

### Simple Calendar Enhancements
SIFToolkit is compatible with Simple Calendar.  If the "Time Processor" option in module settings is set to "Simple Calendar", then template durations will continue to tick down outside of combat.  Constant re-evaluation of templates may be resource intensive on lower-end hardware.  For this reason, if Simple Calendar is used, and SIFToolkit is configured to use Simple Calendar for time processing, then it is suggested to configure Simple Calendar's time settings to update with a frequency of 6 seconds.

### Manual Template Duration Adjustment
Template durations can be adjusted by double-clicking on the template's control icon when the measured template tools are selected.  This will bring up the standard Measured Template configuration dialog.  SIFToolkit adds a new field to this dialog, "Duration".  The duration field will be initially populated with the current duration at the time that the dialog is opened.  The field will accept any number of seconds.  Upon changing the value, the template's duration will be instantly updated to the new value, and does not wait for the "Save Template" button to be clicked.  

## Template Information ToolTip
![image](https://user-images.githubusercontent.com/70086485/126091792-03917050-90e1-48ef-a9be-98c7aff06472.png)
The Template Information ToolTip is automatic and does not need to be enabled.  To use, select the Measured Template control set.  Hovering the mouse over any available template control icon will provide a pop-up temlate to indicate the originator of the template, the spell/item/feature that was used to generate it, and any remaining duration that it may have.  

## Animations
Animations are currently only provided for "Area of Effect" spells/items/features, which require a template.  Additional special effects are planned.  To add these effects, open the spell/item/feature from a compendium, imported item, or actor sheet.  A new tab "Special Effects" is added to the sheet to provide a place for managing all special effects.  In order to add an animation, the "Use Texture" option must be enabled, and a valid image/video file must be supplied. Reference the below image for options.
![image](https://user-images.githubusercontent.com/70086485/126092764-73a27456-7f06-4930-a8b4-1e93a97bfef8.png)
| Option | Description |
| ----------- | ----------- |
| **Use Texture** | This option specifies whether or not the supplied texture file should be used. |
| **Texture** | This field is a path to the desired image/video clip to be used.  Optionally, a select button is present to browse for such files. |
| **Alpha (Opacity)%** | This option provides a mechanism for determining how opaque/transparent the supplied texture should appear.  By default this is set at 50.  Any value between 0 and 100 is accepted. | 
| **Loop Animations** | This option, if selected, will cause video files to loop.  If not selected, such files will play through once and stop on the final frame.  |
| **Cone texture Origin** | This option allows you to specify, for templates with a cone shape, where the origin (Source) of the cone is located in the supplied image/video.  By default, the left edge of the image/video file will be utilized; however, depending on the supplied file, it may be more appropriate to select a different option. |

## Audio
Audio is currently provided for all spells/items/features.  Currently, all spells/items/features support the option to play audio on "damage" rolls, which includes healing type rolls.  Additionally, spells/items/features that allow for a template to be placed also support having audio play when the template is added to the canvas.  To add these effects, open the spell/item/feature from a compendium, imported item, or actor sheet.  A new tab "Special Effects" is added to the sheet to provide a place for managing all special effects.  In order to add an animation, the appropriate "Play audio" option must be enabled, and a valid sound file must be supplied. Reference the below image for options.
![image](https://user-images.githubusercontent.com/70086485/126093525-eca9c3ba-c3aa-4a8f-bbf7-991c51d3b1b0.png)
| Option | Description |
| ----------- | ----------- |
| **Play audio on template set** | This option specifies that the supplied audio clip should be played when a template is added to the canvas. |
| **Play audio on damage rolls** | This option specifies that the supplied audio clip should be played when a "damage" roll is made.  In this instance, damage includes any form of HP adjusting roll, including healing rolls. |
| **Clip** | This field is a path to the desired audio clip to be used.  Optionally, a select button is present to browse for such files. | 
| **Volume%** | This option defines the percentage of the original volume in the audio clip that should be utilized when played.  A minimum value of 10, and a maximum value of 200 are allowed.  |

## Options
![image](https://user-images.githubusercontent.com/70086485/126088978-1ec942d0-7e61-4711-946d-50afbf0c0461.png)
| Option | Description |
| ----------- | ----------- |
| **Standard Spell Template Border Color** | This is the border color for all templates that do not match any other category. |
| **Enduring Spell Template Border Color** | This border color will be applied to all templates that have a duration greater than 0 (Instantaneous), but that do not require concentration. |
| **Special Spell Template Border Color** | This border color will be applied to all templates that have a non-zero duration that utilizes logic outside of simple time.  This usually involves a trigger of some sort.  Templates of this type will need to be removed manually. | 
| **Concentration Spell Template Border Color** | This border color will be applied to all templates that require concentration, regardless of their duration.  This option only appears in DND5E system. | 
| **Unmanaged Template Action** | This option will determine what action SIFToolkit will take at the end of an actor's turn, if a template is identified that has not yet been categorized/flagged by SIFToolkit.  Options include "Prompt me every time", "Skip - leave in place", "Delete", and "Claim them".  |
| **Instantaneous Spell Fade Duration** | This option specifies an additional number of rounds to keep an otherwise instantaneous spell on the canvas.  A settings of 0 indicates that no additional rounds should be added and that such templates should be removed immediately.  Any other value will add that number of rounds to the duration of the template. |
| **Enforce Concentration** | This option, if enabled, will cause SIFToolkit to remove previous concentration spell templates from the current scene, if a new one is placed.  This option only appears in the DND5E system. |
| **Maintain concentration across scenes** | This option, if enabled, will cause SIFToolkit to remove previous concentration spell templates from ALL scenes if a new concentration temlate is added to ANY scene.  This option requires **Enforce Concentration** to be enabled in order to function.  | 
| **Time Processor** | This option designates the module responsible for managing template times.  The default is SIFToolkit, which does not provide real-time aging of templates outside of combat.  The Simple Calendar option will provide this benefit, if installed.  |
| **Message History Count** | This option tells SIFToolkit how many previous actionable chat cards, for which special effects options should be remembered.  If a chat message falls outside of this range, the buttons can still be used, but special effects options such as textures and audio will not be applied.  |




