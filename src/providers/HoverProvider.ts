import * as vscode from 'vscode';
import { findEntityAtPosition } from '../paser/Paser';
import { Entity } from '../types/types';
import { entityToHover } from '../entity/Entity';

export class CarbonHoverProvider implements vscode.HoverProvider {
    async provideHover(document: vscode.TextDocument, position: vscode.Position) {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        let a: Entity = {} as Entity;
        try {
            a = await findEntityAtPosition(document.offsetAt(position), document.getText());
        } catch (e) {
            console.error('provideHover', e);
        }
        return entityToHover(a, word);
    }
}