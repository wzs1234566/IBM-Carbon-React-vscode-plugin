import { Parser } from 'acorn';
import { AST, Entity } from '../types/types';
const parser = Parser.extend(
	require("acorn-jsx")(),
);
const walk = require('acorn-walk');
const { extend } = require('acorn-jsx-walk');
extend(walk.base);

export async function findEntityAtPosition(offset: number, documentText: string): Promise<Entity> {
	const ast: AST = parser.parse(documentText) as AST;
	const node: any = walkAST(offset, ast);
	return ASTtoEntity(node);
}

// walks the ast and returns the ast node position is in
function walkAST(offset: number, ast: AST): any {
	let node: any = null;
	const setNode = (cnode: any, ancestors: any[]) => {
		if (!node) {
			if (inRange(offset, cnode)) {
				node = cnode;
				node.ancestors = ancestors;
				if (ancestors.length >= 2) {
					node.parent = ancestors[ancestors.length - 2];
					node.parent.ancestors = ancestors.slice(0, ancestors.length - 2);
				} else {
					node.parent = {};
					node.parent.ancestors = [];
				}
			}
		}
	};
	walk.ancestor(
		ast, {
		JSXElement(cnode: any, ancestors: any[]) {
			setNode(cnode, ancestors);
		},
		JSXOpeningElement(cnode: any, ancestors: any[]) {
			setNode(cnode, ancestors);
		},
		JSXIdentifier(cnode: any, ancestors: any[]) {
			setNode(cnode, ancestors);
		},
		JSXExpressionContainer(cnode: any, ancestors: any[]) {
			setNode(cnode, ancestors);
		},
		JSXAttribute(cnode: any, ancestors: any[]) {
			setNode(cnode, ancestors);
		},
		Literal(cnode: any, ancestors: any[]) {
			setNode(cnode, ancestors);
		},
	});
	return node;
}

function inRange(offset: number, ast: AST): boolean {
	if (offset >= ast.start && offset < ast.end) {
		return true;
	}
	return false;
}

function ASTtoEntity(ast: AST): Entity {
	switch (ast.type) {
		case "JSXElement":
			// children of some component
			return {
				target: 'children',
				parent: {
					target: 'tagName',
					parent: {} as Entity,
					value: ast.openingElement ? ast.openingElement.name ? ast.openingElement.name.name : '' : ''
				} as Entity,
				value: '',
			} as Entity;
		case "JSXOpeningElement":
			// return attributes names of some component
			return {
				target: 'attributeName',
				parent: {
					target: 'tagName',
					parent: {} as Entity,
					value: ast.name ? ast.name.name : ''
				} as Entity,
				value: '',
			} as Entity;
		case "JSXIdentifier":
			// on hover, property
			return {
				target: 'attributeName',
				parent: {
					target: 'tagName',
					parent: {},
					value: findNameFromAncestors(ast.ancestors ?? []) === '' ? findNameFromAncestors(ast.parent.ancestors ?? []) : findNameFromAncestors(ast.ancestors ?? [])
				},
				value: ast.name,
			} as Entity;
		case "JSXAttribute":
			// return attributes names of some component
			// happends when pressed enter on an attribute
			// TODO: should more intelligent ? 
			return {
				target: 'attributeName',
				parent: {
					target: 'tagName',
					parent: {},
					value: findNameFromAncestors(ast.ancestors ?? []) === '' ? findNameFromAncestors(ast.parent.ancestors ?? []) : findNameFromAncestors(ast.ancestors ?? [])
				},
				value: ast.name ? (ast.name.name ? ast.name.name : ast.name) : '',
			} as Entity;
		case "Literal":
			return {
				target: 'attributeValue',
				parent: ASTtoEntity(ast.parent),
				value: ast.value ? ast.value : '',
			} as Entity;
		default:
			console.error("ASTtoEntity", ast);
			return {} as Entity;
	}
}

function findNameFromAncestors(node: AST[]): string {
	for (let i = node.length - 1; i > 0; i--) {
		if (node[i].name && node[i].name.name) {
			return node[i].name.name;
		}
	}
	return '';
}