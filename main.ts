import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, WorkspaceLeaf} from 'obsidian';
import { HEADING_SELECTOR_VIEW_TYPE, HeadingSelectorView } from 'headingSelectorView';
import { HeadingInfo} from 'heading';

export interface HeadingTransporterSettings {
	HeadingInfos: HeadingInfo[];
	test: string;
}

export const DEFAULT_SETTINGS: HeadingTransporterSettings = {
	HeadingInfos: [],
	test: "testString"
}

export default class HeadingTransporterPlugin extends Plugin {
	settings: HeadingTransporterSettings;

	async onload() {
		await this.loadSettings();
		let headingSelectorView: HeadingSelectorView


		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {

				const linePosition = editor.getCursor('from').line
				const lineContent = editor.getLine(linePosition)

				const isHeading = (lineContent.charAt(0) == "#") ? true : false

				if (isHeading) {
					menu.addItem((item) => {
					item
						.setTitle('Add to Heading Selector')
						.setIcon('document')
						.onClick(async () => {	

							const headingName = lineContent.slice(1).trim()
							const path = view.file?.path
							if (!path) return

							this.settings.test = "A"

							this.settings.HeadingInfos.push({headingName: headingName, path: path})
							if (headingSelectorView) headingSelectorView.display()
							await this.saveSettings()
						});
					});
				} else {
					new Notice("Not a heading")
					this.settings.test = ""
					this.saveSettings();
				}

				
			})
		);



		this.registerView(
			HEADING_SELECTOR_VIEW_TYPE,
			(leaf) => headingSelectorView = new HeadingSelectorView(leaf, this.settings)
		)

		const ribbonIconEl = this.addRibbonIcon('apple', 'Sample Plugin', (evt: MouseEvent) => {
			this.activateView()
			console.log(this.settings.HeadingInfos)
		});
		ribbonIconEl.addClass('my-plugin-ribbon-class');



		this.addSettingTab(new HeadingTransporterSettingTab(this.app, this));

	}

	onunload() {

	}


	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(HEADING_SELECTOR_VIEW_TYPE);

		if (leaves.length > 0) {
		// A leaf with our view already exists, use that
		leaf = leaves[0];
		} else {
		// Our view could not be found in the workspace, create a new leaf
		// in the right sidebar for it
		leaf = workspace.getRightLeaf(false);
		if (!leaf) return
		await leaf.setViewState({ type: HEADING_SELECTOR_VIEW_TYPE, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		workspace.revealLeaf(leaf);
	
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		console.log("Saved Settings")
	}
}



class HeadingTransporterSettingTab extends PluginSettingTab {
	plugin: HeadingTransporterPlugin;

	constructor(app: App, plugin: HeadingTransporterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.test)
				.onChange(async (value) => {
					this.plugin.settings.HeadingInfos.push({headingName: "Test", path: ""});
					this.plugin.settings.HeadingInfos[0].headingName = value;
					console.log(value)
					await this.plugin.saveSettings();
				}));
	}
}
