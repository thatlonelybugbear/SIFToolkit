v0.1.2  07/20/2021

* Initial release
* Code Restructuring
* Added ability to add sound effects to Damage rolls/Template Placement.
* Added ability to reuse chat card buttons.
* Modified code to support new requirements of all lower-case package names.

v0.1.3 07/20/2021

* Updated manifest URL.

v0.1.5 07/21/2021

* removed debug code.

v0.1.8 07/21/2021

* added error checking for SIFData missing from objects.

v0.1.10 07/21/2021

* fixed bugs in migration script and renderChatMessage null object checking.

v0.1.11 07/21/2021

* fixed error checking entry on template button hijack for dnd5e
* added some additional error checks

v0.1.12 07/22/2021

* corrected bugs affecting Special Effects tab rendering on wrong itemSheet
* corrected bugs affecting changes to one itemSheet causing all other itemSheets to update with the same value.
* corrected bug on itemSheet causing scroll position to reset on itemSheet during re-render.

v0.1.13 07/22/2021

* updated version number

v0.1.14 07/22/2021

* updates due to bad commit.  

v0.1.15 07/23/2021

* updated item sheet template URL to be case specific.  

v0.1.16 07/23/2021

* fixed bug in dnd5e hooks that would under some circumstances prevent hooks from loading.

v0.1.17 07/23/2021

* updated item sheet template filename to match script request.  

v0.1.18 7/27/2021

* corrected background error in updateMeasuredTemplate hook that would occur when updating a measured template with no SIFT data attached.  
* corrected error in Hooks.js that could cause some Hooks to not be loaded.  
* removed some debug code.

v0.1.19 7/28/2021

* Added check for missing SIFData in updateTemplate code.  

v0.1.20 7/28/2021

* corrected typo preventing PF2E hooks from loading.

v0.1.21 7/28/2021

* corrected bug causing no SIF data to be appended to templates: this prevented hover information from displaying correctly.
* corrected multiple bugs in template processing that would /not allow selective deletion of templates by GM/players.  Errors would cause templates to display incorrectly
* corrected bug causing errors to be thrown when the primary user (not GM) rendered a chat message with hijackable button.

v0.1.22 7/28/2021

* added missing logic to remove templates for which ignoreDuration is checked early if appropriate, but not before spellFadeDuration has been reached.
