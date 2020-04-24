import * as vscode from 'vscode';
import { findEntityAtPosition } from '../paser/Paser';
import { Entity } from '../types/types';

export class CarbonCompletionItemProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

        // get all text until the `position` and check if it reads `console.`
        // and if so then complete if `log`, `warn`, and `error`
        // let linePrefix = document.lineAt(position).text.substr(0, position.character);
        // if (linePrefix.endsWith('<')) {
        // 	return [new vscode.CompletionItem('items', vscode.CompletionItemKind.Method)];
        // }
        // document.getText
        let a: Entity = await findEntityAtPosition(document.offsetAt(position), document.getText());
        vscode.window.showInformationMessage(
            `type: ${a.target}, value: ${a.value}, parent: ${a.parent.value}`
        );
        console.log(a);

        return [
            new vscode.CompletionItem('log1', vscode.CompletionItemKind.Method),
            new vscode.CompletionItem('warn1', vscode.CompletionItemKind.Method),
            new vscode.CompletionItem('error1', vscode.CompletionItemKind.Method),
        ];

    }
}