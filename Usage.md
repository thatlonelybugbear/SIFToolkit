# SIFToolkit Usage
![image](https://user-images.githubusercontent.com/70086485/126088022-cf3a69ef-0952-455f-bde0-6437fcf2ce58.png)

## Template Management
Template Management is automatic, and does not need to be enabled.  Once SIFToolkit is installed and enabled, it will begin tracking all placed templates.  Once placed, SIFT will attempt to analyze the source of the template for a duration.  If discovered, the template will be flagged with a duration, which will begin counting down.  When the duration reaches 0, the template will be automatically removed from the canvas.  

### Template Aging and Expiration
Templates age as combat progresses.  Specifically, all templates on the canvas will age up by 6 seconds (standard round duration) when a new combat round is ended/begun.  Templates will not age mid-round; however, at the end of each actor's turn in combat, all templates owned by that actor will be evaluated to determine if they should expire during that turn.  They will be removed if the current duration will be less than 1 at the end of the round. Moving backward through combat will allow time to be re-added to a template's duration; however, once a template is removed from the canvas, this action is permanent and the template will not be re-added to the canvas as time progresses in reverse.  
  
### Concentration (DND5E)
DND5E utilizes the concentration concept, which requires that only one concentration spell can be maintained by any single actor at any given time.  SIFToolkit incorporates this feature into two options, each of which can be found in the module settings of Foundry VTT.  The first option "Enforce Concentration", if enabled, will remove any previously placed concentration spell templates early, if a new concentration spell template is added.  The second option "Maintain concentration across scenes" will apply this same concept across all scenes at the same time.  With this option enabled, if a new concentration spell template is added to ANY scene, ALL previously placed concentration spell templates will be removed.  

### Simple Calendar Enhancements
SIFToolkit is compatible with Simple Calendar.  If the "Time Processor" option in module settings is set to "Simple Calendar", then template durations will continue to tick down outside of combat.  Constant re-evaluation of templates may be resource intensive on lower-end hardware.  For this reason, if Simple Calendar is used, and SIFToolkit is configured to use Simple Calendar for time processing, then it is suggested to configure Simple Calendar's time settings to update with a frequency of 6 seconds.

### Manual Template Duration Adjustment
Template durations can be adjusted by double-clicking on the template's control icon when the measured template tools are selected.  This will bring up the standard Measured Template configuration dialog.  SIFToolkit adds a new field to this dialog, "Duration".  The duration field will be initially populated with the current duration at the time that the dialog is opened.  The field will accept any number of seconds.  Upon changing the value, the template's duration will be instantly updated to the new value, and does not wait for the "Save Template" button to be clicked.  

### Options
![image](https://user-images.githubusercontent.com/70086485/126088978-1ec942d0-7e61-4711-946d-50afbf0c0461.png)
| Option | Description |
| ----------- | ----------- |
| Standard Spell Template Border Color | This is the border color for all templates that do not match any other category. |
| Enduring Spell Template Border Color | This border color will be applied to all templates that have a duration greater than 0 (Instantaneous), but that do not require concentration. |
| Special Spell Template Border Color | This border color will be applied to all templates that have a non-zero duration that utilizes logic outside of simple time.  This usually involves a trigger of some sort.  Templates of this type will need to be removed manually. | 



## Template Information ToolTip

## Animations

### Cone Templates

## Audio

