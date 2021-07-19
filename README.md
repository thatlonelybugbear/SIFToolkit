# SIFToolkit
**Spells, Items, and Features Toolkit Module for Foundry VTT**

## Patreon
Your support helps make this module continue to improve.  Consider contributing https://www.patreon.com/SIFToolkit

## Youtube Channel
Introduction, how-to, and update videos will all be made available on my Youtube channel: https://www.youtube.com/channel/UC6YPR7wQE3vQ4FkFdRVwu0A.

## Introduction

SIFToolkit is a module developed in JavaScript to extend the capabilities of the DnD5E and PF2E systems of Foundry VTT. After enabling the module, SIFToolkit (SIFT) will take over multiple aspects of managing measured templates as they are deployed to a scene.

**Template Automatic Cleanup**

When a template is generated, the template will be analyzed to determine the ability's duration and requirements for concentration.  Based on this analysis, the template will be flagged with meta-data indicating this information along with other relevant information that allows the system to function. The border of the newly created templates are color-coded to indicate the status of the template. SIFT then tracks the meta-data as time progresses. As templates reach expiration, SIFT automatically removes them from the scene. For DND5E, if a second spell requiring concentration is cast, SIFT can be configured to automatically remove templates from any previous concentration spells for that actor. Additionally, at the conclusion of a player's turn, they will be given the opportunity to impose management on any existing unmanaged templates that they own, giving them the option to skip, delete, or claim (begin management of) the unmanaged template. Finally, on the item/spell sheet, it is possible to force a given template to ignore duration and expire immediately at the end of the character's turn.

In all, there are 5 status of templates: unmanaged, instantaneous, concentration, enduring, and special.
Unmanaged templates are any template that was created manually, using the measured template controls.  They will utilize the default border color.

Instantaneous templates are templates that have an "instantaneous" duration, and therefore do not require concentration. By default these templates will utilize a black border.

Concentration templates are templates that have a duration greater than instantaneous, but which require concentration to maintain. By default these templates will utilize a yellow border.

Enduring templates are templates that have a duration greater than instantaneous, but do not require concentration to maintain. By default these templates will utilize a green border.

Special templates are templates that have a non-time-based duration, typically this involves a trigger of some sort. These templates do not require concentration to maintain. By default these templates will utilize a white border. Note: these templates will not be automatically removed by STM, they will require manual deletion.

The color's utilized by the 4 managed template types are all configurable via 24-bit Hexadecimal color codes (RRGGBB) in the module settings dialogue. A color picker is also available to assist in color selection.

**Spell Textures**

SIFT extends the current Item sheet, and adds additional options on the per item/spell sheet, that will allow you to specify a texture to supply to the spell template along with supplying a transparency option. This feature currently is able to make use of all image and video formats that Foundry VTT supports. Settings supplied at the compendium level will transfer to the item level, which will carry on to the character level, and so on. Changing the setting at a lower level will not affect the upper levels. The exception is for Token Actors that are linked to the PC/NPC.

**Template ToolTip**

SIFT adds a tooltip to the Measured Template tools. Simply select the Measured Template tools, and hover over a template's control icon to few the Character/Player who placed a template, the spell/item that produced the template, and any remaining duration of the template.

**Simple Calendar Compatibility**

SIFT fully supports real-time template expiration through use of the Simple Calendar module. When this module is installed, a new setting is available in the Foundry settings panel, that will allow you to offload processing to the Simple Calendar module. This is the suggested configuration.

**Requirements**

SIFT requires the Color Settings module to support core settings selections, and the lib-Wrapper module to support hover capabilities for players.
