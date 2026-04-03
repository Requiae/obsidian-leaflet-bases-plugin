import { LatLngBoundsExpression } from "leaflet";
import { App } from "obsidian";
import { Constants as C } from "@plugin/constants";

interface ImageData {
	bounds: LatLngBoundsExpression;
	url: string;
}

export class ImageLoader {
	constructor(private app: App) {}

	async getImageData(file: unknown): Promise<ImageData | null> {
		const url = this.getFileUrl(file);
		if (!url) return null;

		const bounds = await new Promise<LatLngBoundsExpression | null>((resolve, _reject) => {
			const image = new Image();
			image.onload = () => {
				const { width, height } = image;
				image.detach();
				resolve([
					[0, 0],
					[height, width],
				]);
			};
			image.onerror = () => resolve(null);
			image.src = url;
		});
		if (!bounds) return null;

		return { bounds, url };
	}

	private getFileUrl(file: unknown): string | null {
		const pathOrWiki = typeof file === "string" ? file : file?.toString();
		if (!pathOrWiki) return null;

		if (C.regExp.url.test(pathOrWiki)) return pathOrWiki;

		const path = this.app.metadataCache.getFirstLinkpathDest(pathOrWiki, "");
		if (!path) return null;

		return this.app.vault.getResourcePath(path);
	}
}
