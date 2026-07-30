import { parse } from "yaml";
import { FileManager, MetadataCache, UserEvent, Vault, Workspace } from "obsidian";

export function parseYaml(yaml: string): unknown {
	return parse(yaml);
}

export class App {
	/** @public */
	workspace!: Workspace;

	/** @public */
	vault!: Vault;

	/** @public */
	metadataCache!: MetadataCache;

	/** @public */
	fileManager!: FileManager;

	/**
	 * The last known user interaction event, to help commands find out what modifier keys are pressed.
	 * @public
	 */
	lastEvent!: UserEvent | null;
}
