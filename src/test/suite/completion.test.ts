import * as assert from 'assert';
import * as vscode from 'vscode';
import { carbonModelToCompletionItem, propsModelToOptions } from '../../entity/Entity';
import { Model, PropsModel } from '../../types/types';

suite('Completion Test Suite', () => {
    vscode.window.showInformationMessage('Completion Test Suite');

    test('Simple tag completion without props', () => {
        const a: any = carbonModelToCompletionItem(
            'a',
            {} as Model
        );
        assert.equal(JSON.stringify(a.insertText.value), JSON.stringify("<a>$2</a>"));
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
        assert.equal(propsModelToOptions(type as PropsModel), "'reset','button','submit'");
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
        assert.equal(propsModelToOptions(type as PropsModel), "'button','reset','submit'");
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
        assert.equal(propsModelToOptions(type as PropsModel), "'primary',{ButtonKinds}");
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
        assert.equal(propsModelToOptions(type as PropsModel), '{Object.values(sortStates)}');

    });

    test('type to props - node 0', () => {
        const type = {
            "type": {
                "name": "node"
            },
            "required": false,
            "description": "Pass in the children that will be rendered within the Accordion"
        };
        assert.equal(propsModelToOptions(type as PropsModel), "''");
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
        assert.equal(propsModelToOptions(type as PropsModel), "'title'");
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
        assert.equal(propsModelToOptions(type as PropsModel), "{title}");
    });

    test('type to props - string 0', () => {
        const type = {
            "type": {
                "name": "string"
            },
            "required": false,
            "description": ""
        };
        assert.equal(propsModelToOptions(type as PropsModel), "''");
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
        assert.equal(propsModelToOptions(type as PropsModel), "'title'");
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
        assert.equal(propsModelToOptions(type as PropsModel), "{'title'}");
    });

    test('type to props - func 0', () => {
        const type = {
            "defaultValue": {
                "value": "() => {}",
                "computed": true
            },
            "type": {
                "name": "func"
            },
            "required": false,
            "description": ""
        };
        assert.equal(propsModelToOptions(type as PropsModel), "{() => {}}");
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
        assert.equal(propsModelToOptions(type as PropsModel), "{() => {}}");
    });

    test('type to props - func 2', () => {
        const type = {
            "defaultValue": {
                "value": "() => {}",
                "computed": false
            },
            "type": {
                "name": "func"
            },
            "required": false,
            "description": "Provide a function that is called when menu is closed"
        };
        assert.equal(propsModelToOptions(type as PropsModel), "{() => {}}");
    });

    test('type to props - shape 0', () => {
        const type = {
            "type": {
                "name": "shape",
                "value": {
                    "width": {
                        "name": "string",
                        "required": false
                    },
                    "height": {
                        "name": "string",
                        "required": false
                    },
                    "viewBox": {
                        "name": "string",
                        "required": true
                    },
                    "svgData": {
                        "name": "object",
                        "required": true
                    }
                }
            },
            "required": false,
            "description": "The icon data."
        };
        assert.equal(propsModelToOptions(type as PropsModel), `{${type.type.value}}`);
    });

    test('type to props - shape 1', () => {
        const type = {
            "type": {
                "name": "shape",
                "value": "Downshift.propTypes",
                "computed": true
            },
            "required": false,
            "description": "Additional props passed to Downshift"
        };
        assert.equal(propsModelToOptions(type as PropsModel), "{Downshift.propTypes}");
    });

    test('type to props - shape 2', () => {
        const type = {
            "type": {
                "name": "shape",
                "value": "Downshift.propTypes",
                "computed": false
            },
            "required": false,
            "description": "Additional props passed to Downshift"
        };
        assert.equal(propsModelToOptions(type as PropsModel), "{Downshift.propTypes}");
    });

    test('type to props - bool 0', () => {
        const type = {
            "type": {
                "name": "bool",
                "value": "Downshift.propTypes",
                "computed": false
            },
            "required": false,
            "description": ""
        };
        assert.equal(propsModelToOptions(type as PropsModel), '{true},{false}');
    });

    test('type to props - number 0', () => {
        const type = {
            "type": {
                "name": "number",
                "value": "100",
                "computed": false
            },
            "required": false,
            "description": ""
        };
        assert.equal(propsModelToOptions(type as PropsModel), '{100}');
    });

    test('type to props - number 1', () => {
        const type = {
            "defaultValue": {
                "value": "100"
            },
            "type": {
                "name": "number",
                "value": [
                    {
                        "value": "1",
                        "computed": false
                    },
                    {
                        "value": "123",
                        "computed": false
                    },
                    {
                        "value": "100",
                        "computed": false
                    }
                ]
            },
            "required": false,
            "description": "Optional prop to specify the type of the Button"
        };
        assert.equal(propsModelToOptions(type as PropsModel), '{100},{1},{123}');
    });

    test('type to props - arrayof 0', () => {
        const type = {
            "defaultValue": {
                "value": "[]",
                "computed": false
            },
            "type": {
                "name": "arrayOf",
                "value": {
                    "name": "string"
                }
            },
            "required": false,
            "description": ""
        };
        assert.equal(propsModelToOptions(type as PropsModel), '{[]}');
    });

    test('type to props - arrayof 1', () => {
        const type = {
            "type": {
                "name": "arrayOf",
                "value": {
                    "name": "shape",
                    "value": {
                        "id": {
                            "name": "string",
                            "required": true
                        },
                        "disabled": {
                            "name": "bool",
                            "required": false
                        }
                    }
                }
            },
            "required": true,
            "description": "The `rows` prop is where you provide us with a list of all the rows that\nyou want to render in the table. The only hard requirement is that this\nis an array of objects, and that each object has a unique `id` field\navailable on it."
        };
        assert.equal(propsModelToOptions(type as PropsModel), "{[ {id: string, disabled: bool} ]}");
    });
});