import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, WorkspaceLeaf} from 'obsidian';
import { HEADING_SELECTOR_VIEW_TYPE, HeadingSelectorView } from 'headingSelectorView';

interface HeadingTransporterSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: HeadingTransporterSettings = {
	mySetting: 'default'
}

export default class HeadingTransporterPlugin extends Plugin {
	settings: HeadingTransporterSettings;



	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {

				const linePosition = editor.getCursor('from').line
				const lineContent = editor.getLine(linePosition)

				const isHeading = (lineContent.charAt(0) == "#") ? true : false

				// TODO: Get line of selection to see if the entire line is a heading

				if (isHeading) {
					menu.addItem((item) => {
					item
						.setTitle('Add to Heading Selector')
						.setIcon('document')
						.onClick(async () => {	
							const selection = editor.getSelection()
							const filePath = view.file?.path

							
							
						});
					});
				} else {
					new Notice("Not a heading")
				}

				
			})
		);

		this.registerView(
			HEADING_SELECTOR_VIEW_TYPE,
			(leaf) => new HeadingSelectorView(leaf)
		)

		const ribbonIconEl = this.addRibbonIcon('apple', 'Sample Plugin', (evt: MouseEvent) => {
			this.activateView()
		});
		ribbonIconEl.addClass('my-plugin-ribbon-class');


		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						// new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

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
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
