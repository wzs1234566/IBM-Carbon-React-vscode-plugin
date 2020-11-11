import * as vscode from 'vscode';
import { CarbonHoverProvider } from './providers/HoverProvider';
import { CarbonCompletionItemProvider } from './providers/CompletionProvider';
import { iconWebView } from './providers/IconWebView';

export function activate(context: vscode.ExtensionContext) {
	const languages = ['javascript', 'javascriptreact',];

	// Completion Item Provider
	const provider = vscode.languages.registerCompletionItemProvider(
		languages,
		new CarbonCompletionItemProvider(),
		' ', '.', "'", '"', '{', '<',
	);
	context.subscriptions.push(provider);

	// Hover Provider
	vscode.languages.registerHoverProvider(
		languages,
		new CarbonHoverProvider()
	);

	// Carbon Icons
	context.subscriptions.push(
		vscode.commands.registerCommand('CarbonIconPreview', iconWebView)
	);
}

export function deactivate() { }
