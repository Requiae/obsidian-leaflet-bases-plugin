.PHONY: build install-local update test lint

build:
	npm run build

install-local:
	@if [ -z "$(VAULT)" ]; then echo "Usage: make install-local VAULT=/path/to/vault"; exit 1; fi
	mkdir -p "$(VAULT)/.obsidian/plugins/obsidian-leaflet-bases-plugin"
	ln -sf "$(CURDIR)/main.js" "$(VAULT)/.obsidian/plugins/obsidian-leaflet-bases-plugin/main.js"
	ln -sf "$(CURDIR)/manifest.json" "$(VAULT)/.obsidian/plugins/obsidian-leaflet-bases-plugin/manifest.json"
	ln -sf "$(CURDIR)/styles.css" "$(VAULT)/.obsidian/plugins/obsidian-leaflet-bases-plugin/styles.css"

update: build install-local

test:
	npm test

lint:
	npm run lint
