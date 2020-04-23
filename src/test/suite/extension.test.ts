import * as assert from 'assert';
import * as vscode from 'vscode';
import { findEntityAtPosition } from '../../paser/Paser';
import { Entity } from '../../types/types';

suite('Paser Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Simple tag name and attributeName - full tag', async () => {
        const a: Entity = await findEntityAtPosition(
            2,
            "<a ></a>");
        assert.equal(a.target, 'attributeName');
        assert.equal(a.parent.value, 'a');
    });

    test('Simple tag name and attributeName - simple tag', async () => {
        const a: Entity = await findEntityAtPosition(
            4,
            "<a  />");
        assert.equal(a.target, 'attributeName');
        assert.equal(a.parent.value, 'a');
    });

    test('Simple tag name and attributeValue - full tag', async () => {
        const a: Entity = await findEntityAtPosition(
            6,
            "<a b=' '></a>");
        assert.equal(a.target, 'attributeValue');
        assert.equal(a.parent.value, 'b');
        assert.equal(a.parent.parent.value, 'a');
    });

    test('Simple tag name and attributeValue - simple tag', async () => {
        const a: Entity = await findEntityAtPosition(
            11,
            "<a c='' b=' ' />");
        assert.equal(a.target, 'attributeValue');
        assert.equal(a.parent.value, 'b');
        assert.equal(a.parent.parent.value, 'a');
    });

    test('Simple tag name and children - full tag', async () => {
        const a: Entity = await findEntityAtPosition(
            4,
            "<a> </a>");
        assert.equal(a.target, 'children');
        assert.equal(a.parent.value, 'a');
    });

    test('Nested tags" children', async () => {
        const a: Entity = await findEntityAtPosition(
            7,
            "<a><b>  </b></a>");
        assert.equal(a.target, 'children');
        assert.equal(a.parent.value, 'b');
    });

    test('Nested tags" attributeName', async () => {
        const a: Entity = await findEntityAtPosition(
            6,
            "<a><b  >  </b></a>");
        assert.equal(a.target, 'attributeName');
        assert.equal(a.parent.value, 'b');
    });

    test('Nested tags" attributeValue', async () => {
        const a: Entity = await findEntityAtPosition(
            9,
            "<c><b a=' '>  </b></c>");
        assert.equal(a.target, 'attributeValue');
        assert.equal(a.parent.value, 'a');
        assert.equal(a.parent.parent.value, 'b');
    });

    test('JSX in attribute value - children', async () => {
        const a: Entity = await findEntityAtPosition(
            12,
            "<c a={<d><e> </e></d>}></c>");
        assert.equal(a.target, 'children');
        assert.equal(a.parent.value, 'e');
    });

    test('JSX in attribute value - children attribute Value', async () => {
        const a: Entity = await findEntityAtPosition(
            15,
            "<c a={<d><e f=' '></e></d>}></c>");
        assert.equal(a.target, 'attributeValue');
        assert.equal(a.parent.value, 'f');
        assert.equal(a.parent.parent.value, 'e');
    });

    test('JSX in attribute value - children attribute Name', async () => {
        const a: Entity = await findEntityAtPosition(
            13,
            "<c a={<d><e f=' '></e></d>}></c>");
        assert.equal(a.target, 'attributeName');
        assert.equal(a.parent.value, 'e');
    });
});
