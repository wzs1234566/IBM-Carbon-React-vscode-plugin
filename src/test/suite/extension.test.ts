import * as assert from 'assert';
import * as vscode from 'vscode';
import { findEntityAtPosition, AST } from '../../paser/Paser';

suite('Paser Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Simple tag name and attributeName - full tag', async () => {
        const a: AST = await findEntityAtPosition(
            3,
            "<a></a>");
        assert.equal(a.type, 'JSXElement');
        assert.equal(a.openingElement && a.openingElement.name && a.openingElement.name.name, 'a');
    });

    test('Simple tag name and attributeName - simple tag', async () => {
        const a: AST = await findEntityAtPosition(
            4,
            "<a  />");
        assert.equal(a.type, 'JSXOpeningElement');
        assert.equal(a.name && a.name.name, 'a');
    });

    test('Simple tag name and attributeValue - full tag', async () => {
        const a: AST = await findEntityAtPosition(
            6,
            "<a a=' '></a>");
        assert.equal(a.type, 'Literal');
        assert.equal(a.parent && a.parent.name && a.parent.name.name, 'a');
    });

    test('Simple tag name and attributeValue - simple tag', async () => {
        const a: AST = await findEntityAtPosition(
            11,
            "<a a='' b=' ' />");
        assert.equal(a.type, 'Literal');
        assert.equal(a.parent && a.parent.name && a.parent.name.name, 'b');

    });

    test('Simple tag name and children - full tag', async () => {
        const a: AST = await findEntityAtPosition(
            4,
            "<a> </a>");
        assert.equal(a.openingElement && a.openingElement.name && a.openingElement.name.name, 'a');
        assert.equal(a.type, 'JSXElement');
    });

    test('Nested tags" children', async () => {
        const a: AST = await findEntityAtPosition(
            7,
            "<a><b>  </b></a>");
        assert.equal(a.openingElement && a.openingElement.name && a.openingElement.name.name, 'b');
        assert.equal(a.type, 'JSXElement');
    });

    test('Nested tags" attributeName', async () => {
        const a: AST = await findEntityAtPosition(
            6,
            "<a><b  >  </b></a>");
        assert.equal(a.type, 'JSXOpeningElement');
        assert.equal(a.name && a.name.name, 'b');
    });

    test('Nested tags" attributeValue', async () => {
    	const a: AST = await findEntityAtPosition(
    		9,
    		"<a><b a=' '>  </b></a>");
            assert.equal(a.type, 'Literal');
            assert.equal(a.parent && a.parent.name && a.parent.name.name, 'a');
    });
});
