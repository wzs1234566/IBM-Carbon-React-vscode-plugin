import * as assert from 'assert';
import * as vscode from 'vscode';
import { carbonModelToCompletionItem } from '../../entity/Entity';
import { Entity, Model, PropsModel } from '../../types/types';

suite('Completion Test Suite', () => {
    vscode.window.showInformationMessage('Completion Test Suite');

    test('Simple tag completion without props', () => {
        const a: any = carbonModelToCompletionItem(
            'a',
            {} as Model
        );
        assert.equal(JSON.stringify(a.insertText.value), JSON.stringify("<a\n>\n</a>"));
    });

});
// description: '',
//                 displayName: 'a',
//                 props: {
//                     'p1': {
//                         "type": {
//                             "name": "enum",
//                             "value": [
//                                 {
//                                     "value": "'error'",
//                                     "computed": false
//                                 },
//                                 {
//                                     "value": "'info'",
//                                     "computed": false
//                                 },
//                                 {
//                                     "value": "'success'",
//                                     "computed": false
//                                 },
//                                 {
//                                     "value": "'warning'",
//                                     "computed": false
//                                 }
//                             ]
//                         },
//                         "required": true,
//                     } as PropsModel,
//                     'p2': {
//                         "type": {
//                         },
//                         "required": false,
//                     } as PropsModel
//                 }
//             } as Model
