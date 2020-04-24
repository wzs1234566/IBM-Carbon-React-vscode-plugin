import * as vscode from 'vscode';
import { findEntityAtPosition } from '../paser/Paser';
import { Entity } from '../types/types';

export class CarbonHoverProvider implements vscode.HoverProvider {
    async provideHover(document: vscode.TextDocument, position: vscode.Position) {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        try {
            let a: Entity = await findEntityAtPosition(document.offsetAt(position), document.getText());
        } catch (e) {
            console.error(e);
        }
        const myContent = new vscode.MarkdownString('# Hello Value \n\n' + '[Click to see example](https://react.carbondesignsystem.com/?path=/story/accordion)');
        myContent.isTrusted = true;
        const myHover = new vscode.Hover(myContent);

        if (word === "HELLO") {
            return myHover;
        }
        return null;
    }
}