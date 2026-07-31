## Lint follow-ups

- **`obsidianmd/no-tfile-tfolder-cast` in `test/plugin/properties/mapCandidates.test.ts`**: the test mocks build fake `TFile`s via `{ path, extension } as unknown as TFile`. Replace with real `TFile` instances (or a small test factory) so the test doesn't rely on a cast the linter otherwise flags in production code.
- **`obsidianmd/settings-tab/prefer-setting-definitions` in `src/plugin/settings/basesLeafletViewSettingsTab.ts`**: the settings tab doesn't implement `getSettingDefinitions()`, so its settings won't appear in Obsidian's settings search on 1.13.0+. Migrate to the declarative settings API.

## Tooling

- Enable GitHub's native [Stacked Pull Requests](https://docs.github.com/en/pull-requests/how-tos/stacked-pull-requests) feature for this repository. `gh stack` currently reports "Stacked PRs are not enabled for this repository", falling back to plain branch pushes without the linked-stack UI.
