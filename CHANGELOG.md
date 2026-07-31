# Changelog

All notable changes to this project are documented in this file.

## Unreleased

### Added
- "Create note here" map toolbar tool: click a spot on the map to create a new note (respecting the vault's "Default location for new notes" setting) or add the marker to an existing note, from a single field. ([#14](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/14))
- The context menu's "Add marker to note" now uses the same new-or-existing-note flow as the toolbar tool, replacing the old new-note-only flow. ([#14](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/14))

### Fixed
- `MarkerModal` no longer crashes when a subclass (e.g. the note-picker modal) reads a constructor argument while building its settings, by moving settings construction to Obsidian's `onOpen()` lifecycle hook instead of the constructor. ([#14](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/14))
- The map's background image can no longer be dragged out via the browser's native image drag-and-drop. ([#14](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/14))
- Right-clicking a marker no longer re-centers the map on it. ([#14](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/14))
- Right-clicking the map on a trackpad (e.g. macOS two-finger click) no longer pans the map out from under the context menu — trackpad right-clicks are reported to the browser as a left mousedown, which tricked Leaflet's dragging handler. ([#16](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/16))
- The marker-add map/coordinate picker now also finds Leaflet map views defined in bases embedded as code blocks in markdown notes, not just standalone `.base` files. ([#15](https://github.com/Requiae/obsidian-leaflet-bases-plugin/pull/15))
