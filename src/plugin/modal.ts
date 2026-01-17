import { App, Modal, Setting } from "obsidian";

const DEFAULT_RASTER_SIZE: number = 512;

export class RasteriseModal extends Modal {
	constructor(app: App, onSubmit: (rasterSize: number) => void) {
		super(app);

		let rasterSize: number;
		new Setting(this.contentEl).setName("Raster size").addText((text) => {
			text.inputEl.type = "number";
			text.setPlaceholder(DEFAULT_RASTER_SIZE.toString());
			text.onChange((value) => {
				rasterSize = parseInt(value);
			});
		});

		new Setting(this.contentEl).addButton((btn) =>
			btn
				.setButtonText("Rasterise image")
				.setCta()
				.onClick(() => {
					this.close();
					onSubmit(rasterSize ?? DEFAULT_RASTER_SIZE);
				}),
		);
	}
}
