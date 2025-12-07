import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, Vault, WorkspaceLeaf } from 'obsidian';
import { CheckHeadingExists, CheckHeadingExists2, CheckHeadingExistsTest, GetHeadingName, HeadingInfo, IndexHeadings, IsLineAHeading, SaveHeading, Test, TransportToHeading } from 'heading';
import { HEADING_SELECTOR_VIEW_TYPE, HeadingSelectorView } from 'headingSelectorView';

import { getLineFromCursor } from 'getLineFromCursor';

export interface HeadingTransporterSettings {
	headingInfos: HeadingInfo[];
	selectedHeadingIndex: number;
	cutWithCommand: boolean;
	test: string;
}

export const DEFAULT_SETTINGS: HeadingTransporterSettings = {
	headingInfos: [],
	selectedHeadingIndex: 0,
	cutWithCommand: true,
	test: "testString"
}

export default class HeadingTransporterPlugin extends Plugin {
	settings: HeadingTransporterSettings;

	async onload() {
		await this.loadSettings();
		let headingSelectorView: HeadingSelectorView
		const vault = this.app.vault

		this.registerDomEvent(document, "cut", (evt: ClipboardEvent) => {
			
		})

		this.addCommand({
			id: "transport-heading",
			name: "Transport Heading",
			callback: () => {
				const editor = this.app.workspace.activeEditor?.editor
				if (!editor) return

				const headingInfos = this.settings.headingInfos
				const selectedHeadingIndex = this.settings.selectedHeadingIndex

				const selection = getLineFromCursor(editor)
				
				TransportToHeading(selection, headingInfos[selectedHeadingIndex], this.app)
				if (this.settings.cutWithCommand) {
					editor.setLine(editor.getCursor().line, "")
				}
			}
		})

		this.addCommand({
			id: "check-heading-exists",
			name: "Check Heading Exists",
			callback: () => {
				const headingInfos = this.settings.headingInfos
				CheckHeadingExists(headingInfos, headingSelectorView, vault)	
			}
		})

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {

				const lineContent = getLineFromCursor(editor)

				const isHeading = IsLineAHeading(lineContent)

				if (isHeading) {
					menu.addItem((item) => {
					item
						.setTitle('Add to Heading Selector')
						.setIcon('document')
						.onClick(async () => {	

							const headingName = GetHeadingName(lineContent)
							const path = view.file?.path
							if (!path) return

							SaveHeading(headingName, path, this.settings)
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
			(leaf) => headingSelectorView = new HeadingSelectorView(leaf, this)
		)

		const ribbonIconEl = this.addRibbonIcon('a-large-small', 'Heading Transporter', (evt: MouseEvent) => {
			this.activateView()
			console.log(this.settings.headingInfos)
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
			.setName("Cut With Command")
			.setDesc("If you plan on cutting the text you want to transport, turn this on and set the command to Ctrl-X")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.cutWithCommand)
					.onChange(async (value) => {
						this.plugin.settings.cutWithCommand = value
						await this.plugin.saveSettings()
				}
			)
			})

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.test)
				.onChange(async (value) => {
					this.plugin.settings.headingInfos.push({headingName: "Test", path: ""});
					this.plugin.settings.headingInfos[0].headingName = value;
					console.log(value)
					await this.plugin.saveSettings();
				}));
	}
}
