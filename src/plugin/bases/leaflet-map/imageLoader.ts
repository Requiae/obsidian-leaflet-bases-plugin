import { App } from "obsidian";
import { regExpMap } from "plugin/constants";

interface ImageData {
	dimensions: { width: number; height: number };
	url: string;
}

export class ImageLoader {
	constructor(private app: App) {}

	async getImageData(file: unknown): Promise<ImageData | null> {
		const url = this.getFileUrl(file);
		if (!url) return null;

		const dimensions = await new Promise<{ width: number; height: number } | null>(
			(resolve, _reject) => {
				const image = new Image();
				image.onload = () => {
					const { width, height } = image;
					image.detach();
					resolve({ width, height });
				};
				image.onerror = () => resolve(null);
				image.src = url;
			},
		);
		if (!dimensions) return null;

		return { dimensions, url };
	}

	private getFileUrl(file: unknown): string | null {
		const pathOrWiki = typeof file === "string" ? file : file?.toString();
		if (!pathOrWiki) return null;

		if (regExpMap.url.test(pathOrWiki)) return pathOrWiki;

		const path = this.app.metadataCache.getFirstLinkpathDest(pathOrWiki, "");
		if (!path) return null;

		return this.app.vault.getResourcePath(path);
	}
}
