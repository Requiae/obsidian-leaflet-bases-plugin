# Leaflet Bases

![preview](docs/preview.png)

This plugin for [Obsidian](https://obsidian.md) adds a new bases view: 'Leaflet Map' and a new type of property: 'marker'

> Leaflet Bases is still in the testing phase. While you can be confident that no current features will be dramatically changed, you should expect the occasional bug.
> Please report any issues you encounter [here](https://github.com/Requiae/obsidian-leaflet-bases-plugin/issues).

Leaflet bases was developed for three reasons:

- To leverage the versatility of [Obsidian bases](https://help.obsidian.md/bases)
- Marker data is part of the note it belongs to, not of the map it is shown on
- To have your maps be available in your online garden using [Quartz](https://quartz.jzhao.xyz/)

> For use with Quartz you'll need the appropiate Quartz plugin, which is currently still under development.

## Installation

This plugin currently requires Obsidian v1.11.4 or later to work.

### Install via BRAT

1. Install the [BRAT plugin](https://obsidian.md/plugins?search=BRAT) under Community Plugins.
2. Open BRAT settings and click "Add beta plugin".
3. Enter the URL of this repository: `https://github.com/Requiae/obsidian-leaflet-bases-plugin`.
4. Under "Select a version", choose the Latest version.
5. Click "Add plugin".

### Install via Community Plugins

Leaflet Bases is not yet available under Community Plugins. It is currently still in the testing phase.

## Usage

### Adding a map

#### Using configurations

1. First you need a [base](https://help.obsidian.md/bases) and add a 'Leaflet Map' view.
   ![add map](docs/add-map.png)
2. Change the settings as you wish.

#### Using a code block

You can also embed the base:

````markdown
```base
views:
  - type: leaflet-map
    name: Map
    mapName: test
    image: assets/Locke.png
    height: 400
    minZoom: -1.5
    maxZoom: 2
    defaultZoom: -1.5
    zoomDelta: 0.25
    scale: "0.2"
    unit: km
```
````

| Setting       |             | What it does                                                                            |
| ------------- | ----------- | --------------------------------------------------------------------------------------- |
| Layout        | type        | The type of base, don't change this (from Obsidian bases)                               |
| -             | name        | What the view is called (from Obsidian bases)                                           |
| Image         | image       | The image the map should show. It also accepts wiki links.                              |
| Map name      | mapName     | Optional identifier for the map. Useful if you want to reuse a note across several maps |
| Default zoom  | defaultZoom | The zoom value the map opens with                                                       |
| Minimum zoom  | minZoom     | How far you can zoom out                                                                |
| maximum zoom  | maxZoom     | How far you can zoom in                                                                 |
| Zoom stepsize | zoomDelta   | How much you zoom (⚠️ currently broken)                                                 |
| Scale         | scale       | How much to scale the result of the measure tool                                        |
| Unit          | unit        | The unit the measure tool uses (think km, mi, hours)                                    |

> Technically only 'type', 'name', and 'image' are required for the map view to work. However you'll likely end up using most of the other settings.

### Adding a marker

#### Using UI

1. Add a new marker property to the note you want to have a marker.
   ![add marker property](docs/add-marker-property.png)
2. Add a marker using the '+' button that appeared. Fill in the form in the modal and click 'Create marker'.
   ![add marker modal](docs/add-marker-modal.png)
3. You can add more markers using the '+' button, add markers by clicking the tags, or remove them using the 'x' buttons.
   ![edit marker modal](docs/add-marker-edit.png)

#### Using source code frontmatter

Ensure that the frontmatter block is the first thing in your note.

```markdown
---
marker:
  - coordinates: 100, 300
    icon: lucide-tree-pine
    colour: "#039c4b"
    minZoom: 1
  - coordinates: 5, 5
    mapName: mapName
    colour: "#bdf123"
---
```

| Setting      |             | What it does                                                                                |
| ------------ | ----------- | ------------------------------------------------------------------------------------------- |
| Map name     | mapName     | If you want this marker to only show for a certain map, set this to the mapname of that map |
| Coordinates  | coordinates | Where the marker is placed on the map                                                       |
| Icon         | icon        | Which icon to use for the marker. Can be any [lucide icon](https://lucide.dev/icons/).      |
| Colour       | colour      | Which colour the marker will be                                                             |
| Minimal zoom | minZoom     | How far zoomed in the map should be before the marker becomes visible                       |

> Technically only 'coordinates' is required for the marker to be valid. However you'll likely end up using most of the other settings.

> Coordinates can easily be obtained using the 'copy' (📌) tool in the map. Clicking a spot on the map automatically copies the coordinates to your clipboard.

## Alternatives

### Leaflet ([link](https://github.com/javalent/obsidian-leaflet))

The OG for Obsidian fantasy maps has to be mentioned. It is no longer under active development and has been in maintenance mode for years.

### Zoom map ([link](https://github.com/Jareika/zoom-map))

This plugin is awesome, comprehensive, and feature rich. If you do not wish to use Obsidian bases, your markers to be saved in your notes, nor to host your garden using Quartz then I highly recommend you to take a look at this plugin!

### Map view ([link](https://help.obsidian.md/bases/views/map))

My inspiration and my frustration, for it does not allow images to be used for your maps, and the workarounds are difficult, not accessible, and tend to break GitHub ToS.
