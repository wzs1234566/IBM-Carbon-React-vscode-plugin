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
            const attributeName = entity.parent.value;
            const tagName = entity.parent.parent.value;
            const tagModel = carbonModel[tagName];
            break;
        case 'children':
            Object.keys(carbonModel).forEach(
                (model) => {
                    res.push(carbonModelToCompletionItem(model, carbonModel[model]));
                }
            );
            break;
        default:
            console.error("entityToCompletionItem", entity);
    }
    return res;
}

export function propsToCompletionItem(propsName: string, props: PropsModel): vscode.CompletionItem {
    let ci = new vscode.CompletionItem(propsName, vscode.CompletionItemKind.Field);
    let snippetString = `${propsName}=`;
    const propOptions = propsModelToOptions(props);
    if (propOptions.length > 0) {
        snippetString += '${1|' + propsModelToOptions(props) + '|}';
    }

    ci.insertText = new vscode.SnippetString(snippetString);
    ci.detail = props.description;
    let typeDoc = '';
    if (props.type?.name) {
        typeDoc += 'type: ' + props.type?.name;
    }
    ci.documentation = typeDoc;
    return ci;
}

export function carbonModelToCompletionItem(name: string, model: Model): vscode.CompletionItem {
    let ci = new vscode.CompletionItem(name, vscode.CompletionItemKind.Class);
    // ci.insertText = `<${name}>\n   $1 \n</${name}>$2`;
    // ci.insertText = new vscode.SnippetString("Good ${1|'morning',afternoon,evening|}.\n It is ${2|a,c,d|}, right?");
    let propsText = "";
    let counter = 1;
    if (model.props) {
        Object.keys(model.props).forEach(
            (propKey) => {
                const prop = model.props?.[propKey];
                if (prop?.required) {
                    propsText += `\t${propKey}=`;
                    let options = propsModelToOptions(prop);
                    if (prop.type?.name === 'arrayOf') {
                        if (options.length >= 1) {
                            propsText += options + '\n';
                        }
                    } else {
                        if (options.length >= 1) {
                            propsText += '${' + counter + '|' + options + '|}\n';
                            counter++;
                        } else {
                            propsText += options;
                        }
                    }
                }
            }
        );
    }

    ci.detail = model.description;

    let insertText = null;
    if (propsText.length === 0) {
        insertText = new vscode.SnippetString(`<${name}>$${++counter}</${name}>`);
    } else {
        insertText = new vscode.SnippetString(`<${name}\n${propsText}$${++counter}>$${++counter}\n</${name}>$${++counter}`);
    }
    ci.insertText = insertText;
    return ci;
}

export function propsModelToOptions(prop: PropsModel): string {
    let r = "";
    switch (prop.type?.name) {
        case 'custom':
        case 'shape':
            if (prop.defaultValue && !prop.defaultValue?.value && prop.type.raw) {
                prop.defaultValue.value = prop.type.raw || '';
                prop.defaultValue.computed = true;
            }
            if (prop.defaultValue && typeof prop.defaultValue?.value !== 'string') {
                try { prop.defaultValue.value = JSON.stringify(prop.defaultValue?.value); } catch (e) { }
            }
            if (prop.type.value && typeof prop.type.value !== 'string') {
                try { prop.type.value = JSON.stringify(prop.type.value); } catch (e) { }
            }
        case 'number':
        case 'func':
            if (prop.defaultValue && !prop.defaultValue?.computed) {
                prop.defaultValue.computed = true;
            }
            if (!prop.type.computed) {
                prop.type.computed = true;
            }
            if (Array.isArray(prop.type.value)) {
                for (let v of prop.type.value) {
                    v.computed = true;
                }
            }
        case 'string':
        case 'node':
        case 'object':
        case 'union':
        case 'enum':
            if (!prop.type.value) {
                prop.type.value = '';
            }
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
                    let t = '';
                    if (v.computed) {
                        t = `{${v.value}}`;
                    } else {
                        t = v.value;
                    }
                    if (v.value && v.value.length > 0 && t !== values[0]) {
                        values.push(t);
                    }
                }
            } else {
                if (prop.type.value && prop.type.value.length > 0) {
                    if (prop.type.computed) {
                        values.push(`{${prop.type.value}}`);
                    } else {
                        values.push(prop.type.value);
                    }
                }
            }
            for (let v of values) {
                r += v;
                r += ',';
            }
            return r.length >= 1 ? r.slice(0, -1) : "''";
        case 'bool':
            return '{true},{false}';
        case 'array':
            return '{[]}';
        case 'arrayOf':
            if (prop.defaultValue && prop.defaultValue.value) {
                return `{${prop.defaultValue?.value}}`;
            }
            if (prop.type?.value?.value && prop.type?.value?.value instanceof Object) {
                let values = prop.type?.value?.value;
                for (let v in values) {
                    r += `${v}: ${values[v].name}, `;
                }
                r = r.slice(0, -2);
                return `{[ {${r}} ]}`;
            }
        case 'any':
            return 'any';
    }
    return '';
}

export function entityToHover(entity: Entity, word: string): vscode.Hover {
    if (carbonModel[word]) {
        // debug for parser
        if (word !== entity.value) {
            console.error('entityToHover: parsed value wrong', word, entity);
        }
        return componentToHover(carbonModel[word]);
    }
    return {} as vscode.Hover;
}

function componentToHover(model: Model): vscode.Hover {
    let content = '';
    content += `## ${model.displayName} \n\n`;
    content += `${model.description} \n\n`;
    content += `## Props \n`;
    content += `|Props Name|Type|Required|Default|Values|  \n`;
    content += `| :--- |:---: | :---: |---:| ---: |  \n`;


    const propModel = model.props;
    if (propModel) {
        Object.keys(propModel).forEach(
            (propsName) => {
                try {
                    let valueOptions = propsModelToOptions(propModel[propsName]);
                    if (valueOptions === "''") {
                        valueOptions = '';
                    }
                    content += `| ${propsName} | ${propModel[propsName].type?.name} | ${propModel[propsName].required ? 'yes' : ''} | ${propModel[propsName].defaultValue?.value ?? ''} | ${valueOptions} |  \n`;
                } catch (e) {
                    console.error('????', e);
                }
            }
        );
    }

    content += `\n [Click to see example](https://react.carbondesignsystem.com/?path=/story/${model.displayName})  \n`;
    const myContent = new vscode.MarkdownString(content);
    myContent.isTrusted = true;
    return new vscode.Hover(myContent);
}