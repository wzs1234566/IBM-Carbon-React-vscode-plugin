import * as vscode from 'vscode';
import { CarbonHoverProvider } from './providers/HoverProvider';
import { CarbonCompletionItemProvider } from './providers/CompletionProvider';

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	vscode.window.showInformationMessage('Hello World from IBM-Carbon-React!');

	const languages = ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'];
	
	// Completion Item Provider
	const provider = vscode.languages.registerCompletionItemProvider(
		languages,
		new CarbonCompletionItemProvider(),
		'.', '\n'
	);
	context.subscriptions.push(provider);

	// Hover Provider
	vscode.languages.registerHoverProvider(
		languages,
		new CarbonHoverProvider()
	);

}

export function deactivate() { }
