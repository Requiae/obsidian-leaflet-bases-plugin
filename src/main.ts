import { BaseLeafletViewPlugin } from "plugin/plugin";

export default BaseLeafletViewPlugin;

// Remaining
// TODO: Measure tool
// TODO: Invalid map settings error (image not found, settings didn't pass validation)
// BUG: Map zoom using scroll uses steps of 1, disregarding zoomDelta. Zoomdelta can't be changed after init!?

// Maybe
// TODO: Be able set the marker property identifier from settings
// TODO: Pin tool: Right click map create note with marker?
// TODO: Add marker type: pin | circle?
// TODO: Prettier marker tooltip note preview
