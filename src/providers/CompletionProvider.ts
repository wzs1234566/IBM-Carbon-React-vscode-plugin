
import * as vscode from 'vscode';

export class CarbonCompletionItemProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

        // get all text until the `position` and check if it reads `console.`
        // and if so then complete if `log`, `warn`, and `error`
        // let linePrefix = document.lineAt(position).text.substr(0, position.character);
        // if (!linePrefix.endsWith('a')) {
        // 	return undefined;
        // }

        return [
            new vscode.CompletionItem('log1', vscode.CompletionItemKind.Method),
            new vscode.CompletionItem('warn1', vscode.CompletionItemKind.Method),
            new vscode.CompletionItem('error1', vscode.CompletionItemKind.Method),
        ];
    }
}