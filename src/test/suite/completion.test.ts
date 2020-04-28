import * as assert from 'assert';
import * as vscode from 'vscode';
import { carbonModelToCompletionItem, propsTypeToOptions } from '../../entity/Entity';
import { Model, PropsModel } from '../../types/types';

suite('Completion Test Suite', () => {
    vscode.window.showInformationMessage('Completion Test Suite');

    test('Simple tag completion without props', () => {
        const a: any = carbonModelToCompletionItem(
            'a',
            {} as Model
        );
        assert.equal(JSON.stringify(a.insertText.value), JSON.stringify("<a\n\t$1\n>$2\n</a>$3"));
    });

    test('type to props - enum 0', () => {
        const type = {
            "type": {
                "name": "enum",
                "value": [
                    {
                        "value": "'reset'",
                        "computed": false
                    },
                    {
                        "value": "'button'",
                        "computed": false
                    },
                    {
                        "value": "'submit'",
                        "computed": false
                    }
                ]
            },
            "required": false,
            "description": "Optional prop to specify the type of the Button"
        };
        assert.equal(propsTypeToOptions(type as PropsModel), "'reset','button','submit'");
    });

    test('type to props - enum 1', () => {
        const type = {
            "defaultValue": {
                "value": "'button'",
                "computed": false
            },
            "type": {
                "name": "enum",
                "value": [
                    {
                        "value": "'reset'",
                        "computed": false
                    },
                    {
                        "value": "'button'",
                        "computed": false
                    },
                    {
                        "value": "'submit'",
                        "computed": false
                    }
                ]
            },
            "required": false,
            "description": "Optional prop to specify the type of the Button"
        };
        assert.equal(propsTypeToOptions(type as PropsModel), "'button','reset','submit'");
    });

    test('type to props - enum 2', () => {
        const type = {
            "defaultValue": {
                "value": "'primary'",
                "computed": false
            },
            "type": {
                "name": "enum",
                "computed": true,
                "value": "ButtonKinds"
            },
            "required": false,
            "description": "Specify the type of the <FileUploaderButton>"
        };
        assert.equal(propsTypeToOptions(type as PropsModel), "'primary',{ButtonKinds}");
    });

    test('type to props - enum 3', () => {
        const type = {
            "type": {
                "name": "enum",
                "computed": true,
                "value": "Object.values(sortStates)"
            },
            "required": false,
            "description": "Specify which direction we are currently sorting by, should be one of DESC,\nNONE, or ASC."
        };
        assert.equal(propsTypeToOptions(type as PropsModel), '{Object.values(sortStates)}');

    });

    test('type to props - node 0', () => {
        const type = {
            "type": {
                "name": "node"
            },
            "required": false,
            "description": "Pass in the children that will be rendered within the Accordion"
        };
        assert.equal(propsTypeToOptions(type as PropsModel), '');
    });

    test('type to props - node 1', () => {
        const type = {
            "defaultValue": {
                "value": "'title'",
                "computed": false
            },
            "type": {
                "name": "node"
            },
            "required": false,
            "description": "The accordion title."
        };
        assert.equal(propsTypeToOptions(type as PropsModel), "'title'");
    });

    test('type to props - node 2', () => {
        const type = {
            "defaultValue": {
                "value": "title",
                "computed": true
            },
            "type": {
                "name": "node"
            },
            "required": false,
            "description": "The accordion title."
        };
        assert.equal(propsTypeToOptions(type as PropsModel), "{title}");
    });

    test('type to props - string 0', () => {
        const type = {
            "type": {
                "name": "string"
            },
            "required": false,
            "description": "Provide an optional class to be applied to the containing node"
        };
        assert.equal(propsTypeToOptions(type as PropsModel), "");
    });

    test('type to props - string 1', () => {
        const type = {
            "defaultValue": {
                "value": "'title'",
                "computed": false
            },
            "type": {
                "name": "string"
            },
            "required": false,
            "description": "Provide an optional class to be applied to the containing node"
        };
        assert.equal(propsTypeToOptions(type as PropsModel), "'title'");
    });

    test('type to props - string 2', () => {
        const type = {
            "defaultValue": {
                "value": "'title'",
                "computed": true
            },
            "type": {
                "name": "string"
            },
            "required": false,
            "description": "Provide an optional class to be applied to the containing node"
        };
        assert.equal(propsTypeToOptions(type as PropsModel), "{'title'}");
    });

    test('type to props - func 0', () => {
        const type = {
            "defaultValue": {
                "value": "() => {}",
                "computed": false
            },
            "type": {
                "name": "func"
            },
            "required": false,
            "description": ""
        };
        assert.equal(propsTypeToOptions(type as PropsModel), "{() => {}}");
    });

    test('type to props - func 1', () => {
        const type = {
            "defaultValue": {
                "value": "() => {}",
                "computed": false
            },
            "type": {
                "name": "func"
            },
            "required": false,
            "description": ""
        };
        assert.equal(propsTypeToOptions(type as PropsModel), "{() => {}}");
    });
});