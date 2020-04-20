
import * as vscode from 'vscode';
import { findEntityAtPosition } from '../paser/Paser';

export class CarbonCompletionItemProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

        // get all text until the `position` and check if it reads `console.`
        // and if so then complete if `log`, `warn`, and `error`
        // let linePrefix = document.lineAt(position).text.substr(0, position.character);
        // if (!linePrefix.endsWith('a')) {
        // 	return undefined;
        // }

        let a = await findEntityAtPosition(position, document.getText());
        vscode.window.showInformationMessage(
            `target: ${a.target}, name: ${a.tag ? a.tag.name : 'noName'}, parent: ${a.parent ? a.parent.name : 'noParent'}`
        );

        return [
            new vscode.CompletionItem('log1', vscode.CompletionItemKind.Method),
            new vscode.CompletionItem('warn1', vscode.CompletionItemKind.Method),
            new vscode.CompletionItem('error1', vscode.CompletionItemKind.Method),
        ];

    }
}