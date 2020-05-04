import * as vscode from 'vscode';
import { findEntityAtPosition } from '../paser/Paser';
import { Entity } from '../types/types';
import { entityToCompletionItem } from '../entity/Entity';

export class CarbonCompletionItemProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        let a: Entity = {} as Entity;
        try {
            a = await findEntityAtPosition(document.offsetAt(position), document.getText());
        } catch (e) {
            console.error('provideCompletionItems', e);
        }
        return entityToCompletionItem(a);
    }
}