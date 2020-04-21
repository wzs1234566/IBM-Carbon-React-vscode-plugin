import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { Position } from 'sax-wasm';
import { findEntityAtPosition, DocumentEntity } from '../../paser/Paser';

suite('Paser Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Simple tag name and attributeName - full tag', async () => {
		const a: DocumentEntity = await findEntityAtPosition({
			line: 0,
			character: 3
		} as Position, "<a></a>");
		assert.equal(a.tag ? a.tag.name : '', 'a');
		assert.equal(a.target, 'attributeName');
	});

	test('Simple tag name and attributeName - simple tag', async () => {
		const a: DocumentEntity = await findEntityAtPosition({
			line: 0,
			character: 4
		} as Position, "<a  />");
		assert.equal(a.tag ? a.tag.name : '', 'a');
		assert.equal(a.target, 'attributeName');
	});

	test('Simple tag name and attributeValue - full tag', async () => {
		const a: DocumentEntity = await findEntityAtPosition({
			line: 0,
			character: 6
		} as Position, "<a a=' '></a>");
		assert.equal(a.tag ? a.tag.name : '', 'a');
		assert.equal(a.target, 'attributeValue');
		assert.equal(a.attribute ? a.attribute.name : '', 'a');

	});

	test('Simple tag name and attributeValue - simple tag', async () => {
		const a: DocumentEntity = await findEntityAtPosition({
			line: 0,
			character: 11
		} as Position, "<a a='' b=' ' />");
		assert.equal(a.tag ? a.tag.name : '', 'a');
		assert.equal(a.target, 'attributeValue');
		assert.equal(a.attribute ? a.attribute.name : '', 'b');
	});

	test('Simple tag name and children - full tag', async () => {
		const a: DocumentEntity = await findEntityAtPosition({
			line: 0,
			character: 4
		} as Position, "<a> </a>");
		assert.equal(a.parent ? a.parent.name : '', '');
		assert.equal(a.target, 'tag');
	});

	test('Nested tags" children', async () => {
		const a: DocumentEntity = await findEntityAtPosition({
			line: 0,
			character: 7
		} as Position, "<a><b>  </b></a>");
		assert.equal(a.parent ? a.parent.name : '', 'a');
		assert.equal(a.target, 'tag');
	});

	test('Nested tags" attributeName', async () => {
		const a: DocumentEntity = await findEntityAtPosition({
			line: 0,
			character: 6
		} as Position, "<a><b >  </b></a>");
		assert.equal(a.tag ? a.tag.name : '', 'b');
		assert.equal(a.target, 'attributeName');
	});

	test('Nested tags" attributeValue', async () => {
		const a: DocumentEntity = await findEntityAtPosition({
			line: 0,
			character: 9
		} as Position, "<a><b a=' '>  </b></a>");
		assert.equal(a.tag ? a.tag.name : '', 'b');
		assert.equal(a.target, 'attributeValue');
		assert.equal(a.attribute ? a.attribute.name : '', 'a');
	});

});
