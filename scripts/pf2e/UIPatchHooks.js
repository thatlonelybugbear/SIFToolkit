export function setHooks() {

    Hooks.on("renderItemSheet", (...args) => {SIFT.utils.patchItemSheet(args)});

}