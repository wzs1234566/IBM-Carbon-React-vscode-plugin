import * as vscode from 'vscode';
import { findEntityAtPosition } from '../paser/Paser';
import { Entity } from '../types/types';
import { entityToCompletionItem } from '../entity/Entity';

export class CarbonCompletionItemProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

        // get all text until the `position` and check if it reads `console.`
        // and if so then complete if `log`, `warn`, and `error`
        // let linePrefix = document.lineAt(position).text.substr(0, position.character);
        // if (linePrefix.endsWith('<')) {
        // 	return [new vscode.CompletionItem('items', vscode.CompletionItemKind.Method)];
        // }
        // document.getText
        let a: Entity = {} as Entity;
        try {
            a = await findEntityAtPosition(document.offsetAt(position), document.getText());
        } catch (e) { }

        vscode.window.showInformationMessage(
            `type: ${a.target}, value: ${a.value}, parent: ${a.parent.value}`
        );
        console.log(a);
        return entityToCompletionItem(a);
    }

    // resolveCompletionItem?(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
    //     // console.log(item);
    //     return null;

    // }
}