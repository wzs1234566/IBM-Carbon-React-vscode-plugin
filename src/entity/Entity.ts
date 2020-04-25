import * as vscode from 'vscode';
import { Entity, CarbonModel, Model, PropsModel } from '../types/types';
import * as cm from '../CarbonModel/react-docgen.json';

export function entityToCompletionItem(entity: Entity): vscode.CompletionItem[] {
    let carbonModel = cm as CarbonModel;

    switch (entity.target) {
        case 'tagName':
            break;
        case 'attributeName':
            break;
        case 'attributeValue':
            break;
        case 'children':
            const res: vscode.CompletionItem[] = [];
            Object.keys(carbonModel).forEach(
                (model) => {
                    res.push(carbonModelToCompletionItem(model, carbonModel[model]));
                }
            );
            return res;
        default:
            console.error("Invalid");
            console.error(entity);
    }
    return [];
}

export function carbonModelToCompletionItem(name: string, model: Model): vscode.CompletionItem {
    // mode
    let ci = new vscode.CompletionItem(name, vscode.CompletionItemKind.Class);
    // ci.insertText = `<${name}>\n   $1 \n</${name}>$2`;
    // ci.insertText = new vscode.SnippetString("Good ${1|'morning',afternoon,evening|}.\n It is ${2|a,c,d|}, right?");
    let propsText = "";
    if (model.props) {
        let counter = 1;
        Object.keys(model.props).forEach(
            (propKey) => {
                const prop = model.props?.[propKey];
                if (prop?.required) {
                    propsText += `\t${propKey}=`;
                    let options = propsTypeToOptions(prop);
                    if (options.length >= 1) {
                        propsText += '${' + counter + '|' + options + '|}\n';
                        counter++;
                    } else {
                        propsText +=  options;
                    }
                }
            }
        );
    }

    ci.documentation = model.description;
    const insertText = new vscode.SnippetString(`<${name}\n${propsText}>\n</${name}>`);
    ci.insertText = insertText;
    return ci;
}

function propsTypeToOptions(prop: PropsModel): string {
    switch (prop.type?.name) {
        case 'enum':
            let r = "";
            if (prop.type.value) {
                // enum and union is array value
                for (let v of prop.type.value) {
                    r += v.value;
                    r += ',';
                }
            }
            return r.slice(0, -1);
        // "value": [
        //     {
        //         "value": "'small'",
        //         "computed": false
        //     },
        //     {
        //         "value": "'normal'",
        //         "computed": false
        //     }
        // ]
        case 'node':
        // "type": {
        //     "name": "node"
        // },
        // "required": false,
        // "description": ""

        case 'string':
            // if(prop.type.value){
            //     return prop.type.value;
            // }
            return "''";
        // "type": {
        //     "name": "string"
        // },
        // "required": false,
        // "description": ""
        case 'func':

        case 'union':
        //
        // "type": {
        //     "name": "union",
        //     "value": [
        //         {
        //             "name": "string"
        //         },
        //         {
        //             "name": "arrayOf",
        //             "value": {
        //                 "name": "union",
        //                 "value": [
        //                     {
        //                         "name": "string"
        //                     },
        //                     {
        //                         "name": "number"
        //                     },
        //                     {
        //                         "name": "object"
        //                     }
        //                 ]
        //             }
        //         },
        //         {
        //             "name": "object"
        //         },
        //         {
        //             "name": "number"
        //         }
        //     ]
        // },

        //
        // "value": [
        //     {
        //         "name": "number"
        //     },
        //     {
        //         "name": "string"
        //     }
        // ]':

        case 'bool':

        case 'custom':
        // "type": {
        //     "name": "custom",
        //     "raw": "deprecate(\n  PropTypes.bool,\n  `\\nThe prop \\`persistant\\` for TableToolbarSearch has been deprecated in favor of \\`persistent\\`. Please use \\`persistent\\` instead.`\n)"
        // },
        case 'object':
        case 'shape':
        case 'arrayOf':
        case 'number':

        // number
        // "name": "arrayOf",
        // "value": {
        //     "name": "string"
        // }
        // "type": {
        //     "name": "shape",
        //     "value": "Downshift.propTypes",
        //     "computed": true
        // },
    }
    return '';
}
// export function entityToHoverItem(entity: Entity) {

// }