# Changelog

All notable changes to this project are documented in this file.

## Unreleased

### Added

- Map context menu: Right click a position on the map to add a marker or update the map.
- Marker context menu: Right click a marker to update or remove a marker.
- Removed the map "copy tool" and added the lost functionality to the map and marker context menus
- "Create note here" map toolbar tool: click a spot on the map to create a new note (respecting the vault's "Default location for new notes" setting) or add the marker to an existing note, from a single field. ([#14](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/14))
- The context menu's "Add marker to note" now uses the same new-or-existing-note flow as the toolbar tool, replacing the old new-note-only flow. ([#14](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/14))
- Pick a marker's map and coordinates directly from the map itself: the marker property's '+' button now lets you pick which Leaflet map view a marker belongs to (when the vault has more than one), then click on that map to set its coordinates, instead of typing them by hand. ([#15](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/15))
- The marker modal gains an "Open map" button that jumps to the note's Leaflet map view, and a live preview of the currently selected icon. ([#15](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/15))
- Browse and add Iconify icon sets in-app: a new "Browse icon sets" button searches Iconify's full collection and adds a set with one click, instead of requiring a manual `.json` download. ([#16](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/16))

### Fixed

- `MarkerModal` no longer crashes when a subclass (e.g. the note-picker modal) reads a constructor argument while building its settings, by moving settings construction to Obsidian's `onOpen()` lifecycle hook instead of the constructor. ([#14](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/14))
- The map's background image can no longer be dragged out via the browser's native image drag-and-drop. ([#14](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/14))
- Right-clicking a marker no longer re-centers the map on it. ([#14](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/14))
- Right-clicking the map on a trackpad (e.g. macOS two-finger click) no longer pans the map out from under the context menu — trackpad right-clicks are reported to the browser as a left mousedown, which tricked Leaflet's dragging handler. ([#16](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/16))
- The marker-add map/coordinate picker now also finds Leaflet map views defined in bases embedded as code blocks in markdown notes, not just standalone `.base` files. ([#15](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/15))
- Markers now properly reset after the base view is changed ([[#12](https://github.com/Requiae/obsidian-leaflet-bases-plugin/issues/12)])
- The note-picker modal now crashes gracefully when obsidian is unable to deserialise the user's base formula
