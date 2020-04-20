import * as vscode from 'vscode';

export class CarbonHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position) {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        const myContent = new vscode.MarkdownString('# Hello Value \n\n' + '[Click to see example](https://react.carbondesignsystem.com/?path=/story/accordion)');
        myContent.isTrusted = true;
        const myHover = new vscode.Hover(myContent);

        if (word == "HELLO") {
            return myHover;
        }
    }
}