import * as vscode from 'vscode';
import { Entity, CarbonModel, Model, PropsModel } from '../types/types';
import * as cm from '../CarbonModel/react-docgen.json';
const carbonModel: CarbonModel = cm as CarbonModel;

export function entityToCompletionItem(entity: Entity): vscode.CompletionItem[] {

    const res: vscode.CompletionItem[] = [];

    switch (entity.target) {
        case 'tagName':
            break;
        case 'attributeName':
            const parentTagName: string = entity.parent.value;
            const parentModel: Model = carbonModel[parentTagName];
            const propsModel = parentModel.props;
            if (propsModel) {
                Object.keys(propsModel).forEach(
                    (propsName) => {
                        res.push(propsToCompletionItem(propsName, propsModel[propsName]));
                    }
                );
            }
            break;
        case 'attributeValue':
            break;
        case 'children':
            Object.keys(carbonModel).forEach(
                (model) => {
                    res.push(carbonModelToCompletionItem(model, carbonModel[model]));
                }
            );
            break;
        default:
            console.error("Invalid");
            console.error(entity);
    }
    return res;
}

export function propsToCompletionItem(propsName: string, props: PropsModel): vscode.CompletionItem {
    let ci = new vscode.CompletionItem(propsName, vscode.CompletionItemKind.Field);
    let snippetString = `${propsName}=`;
    if (props.defaultValue) {
        if (props.defaultValue.computed) {
            snippetString += '{';
            snippetString += props.defaultValue.value;
            snippetString += '}';
        }
    }
    const propOptions = propsTypeToOptions(props);
    if (propOptions.length > 0) {
        snippetString += '${1|' + propsTypeToOptions(props) + '|}';
    }
    ci.insertText = new vscode.SnippetString(snippetString);
    ci.documentation = props.description;
    ci.detail = 'detail' + props.description;
    return ci;
}

// function props

export function carbonModelToCompletionItem(name: string, model: Model): vscode.CompletionItem {
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
                        propsText += options;
                    }
                }
            }
        );
    }

    ci.documentation = model.description;
    const insertText = new vscode.SnippetString(`<${name}\n${propsText}\t$1\n>$2\n</${name}>$3`);
    ci.insertText = insertText;
    return ci;
}

export function propsTypeToOptions(prop: PropsModel): string {
    let r = "";
    switch (prop.type?.name) {
        case 'enum':
            if (prop.type.value) {
                // enum and union is array value
                let values = [];
                if (prop.defaultValue?.value) {
                    if (prop.defaultValue?.computed) {
                        values.push(`{${prop.defaultValue?.value}}`);
                    } else {
                        values.push(prop.defaultValue?.value);
                    }
                }
                if (Array.isArray(prop.type.value)) {
                    for (let v of prop.type.value) {
                        if (v.value !== values[0]) {
                            if (v.computed) {
                                values.push(`{${v.value}}`);
                            } else {
                                values.push(v.value);
                            }
                        }
                    }
                } else {
                    if (prop.type.computed) {
                        values.push(`{${prop.type.value}}`);
                    } else {
                        values.push(prop.type.value);
                    }
                }
                for (let v of values) {
                    r += v;
                    r += ',';
                }
            }
            return r.slice(0, -1);
        case 'func':
            if (prop.defaultValue?.computed === false) {
                prop.defaultValue.computed = true;
            }
        case 'string':
        case 'node':
            if (prop.defaultValue) {
                if (prop.defaultValue?.computed) {
                    r += `{${prop.defaultValue?.value}}`;
                } else {
                    r += `${prop.defaultValue?.value}`;
                }
            }
            return r;

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
            return '{true},{false}';
        case 'custom':
            return prop.type.raw || '';
        case 'object':
        case 'shape':
        case 'arrayOf':
        case 'number':
    }
    return '';
}

// export function entityToHoverItem(entity: Entity) {

// }