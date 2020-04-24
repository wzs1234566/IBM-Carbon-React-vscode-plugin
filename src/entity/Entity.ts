import * as vscode from 'vscode';
import { Entity, CarbonModel } from '../types/types';
import * as carbonModel from '../CarbonModel/react-docgen.json';
export function entityToCompletionItem(entity: Entity) {

    carbonModel as CarbonModel;

    switch (entity.target) {
        case 'tagName':
            break;
        case 'attributeName':
            break;
        case 'attributeValue':
            break;
        case 'children':
            // return children of parent component
            // TODO: return base on parent ? need to get meta of component tree
            // for now just return all carbon components

            break;
        default:
            console.error("Invalid");
            console.error(entity);
    }
}

// export function entityToHoverItem(entity: Entity) {

// }

function carbonModelToCompletionItem(model: CarbonModel) {
    // mode
    let ci = new vscode.CompletionItem('log1', vscode.CompletionItemKind.Method);

}