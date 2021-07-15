import {prepareSIFT} from './prepareSIFT.js';
import {loadUtils} from './loadUtils.js';
import {loadUI} from './loadUI.js';
import {loadTextures} from './loadTextures.js';

class SIFToolkit {
	static SIFTTT = undefined;
	static Status = { running : false };
	static Settings = {};
	static utils = undefined;
	static UI = undefined;
	static textures = undefined;
	static SIFData = {};
	static soundHold = true;
}
CONFIG.debug.hooks=true;
globalThis.SIFT = SIFToolkit;

prepareSIFT();
loadUtils();
loadUI();
loadTextures();

SIFToolkit.Status.running = true;
setTimeout(()=>{SIFT.soundHold = false;5},5000);



