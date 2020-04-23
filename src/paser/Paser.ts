import { Parser } from 'acorn';
const parser = Parser.extend(
  require("acorn-jsx")(),
);
export interface AST {
  type: string,
  start: number,
  end: number,
  parent: AST,
  body?: AST[],
  expression?: AST,
  openingElement?: AST,
  attributes?: AST[],
  name?: AST,
  value?: AST,
  children?: AST[]
}

let node: any = null;
export async function findEntityAtPosition(offset: number, documentText: string): Promise<Entity> {
  node = null;
  const ast: AST = parser.parse(documentText) as AST;
  walkAST(offset, ast, {} as AST);
  return ASTtoEntity(node);
}

// walks the ast and returns the ast node position is in
function walkAST(offset: number, ast: AST, parent: AST): void {
  switch (ast.type) {
    case "Program":
      if (ast.body) {
        for (let i = 0; i < ast.body.length; i++) {
          walkAST(offset, ast.body[i], ast);
        }
      }
      break;
    case "ExpressionStatement":
      if (ast.expression && ast.expression.type === "JSXElement") {
        walkAST(offset, ast.expression, ast);
      }
      break;
    case "JSXElement":
      if (inRange(offset, ast) && ast.openingElement && ast.children) {
        node = ast;
        node.parent = parent;
        walkAST(offset, ast.openingElement, ast);
        for (let i = 0; i < ast.children.length; i++) {
          walkAST(offset, ast.children[i], ast);
        }
      }
      break;
    case "JSXOpeningElement":
      if (inRange(offset, ast) && ast.name && ast.attributes) {
        node = ast;
        node.parent = parent;
        walkAST(offset, ast.name, ast);
        for (let i = 0; i < ast.attributes.length; i++) {
          walkAST(offset, ast.attributes[i], ast);
        }
      }
      break;
    case "JSXIdentifier":
      if (inRange(offset, ast)) {
        node = ast;
        node.parent = parent;
      }
      break;
    case "JSXAttribute":
      if (inRange(offset, ast) && ast.name && ast.value) {
        node = ast;
        node.parent = parent;
        walkAST(offset, ast.name, ast);
        walkAST(offset, ast.value, ast);
      }
      break;
    case "JSXExpressionContainer":
      if (inRange(offset, ast) && ast.expression) {
        node = ast;
        node.parent = parent;
        walkAST(offset, ast.expression, ast);
      }
      if (inRange(offset, ast) && ast.value) {
        node = ast;
        node.parent = parent;
        walkAST(offset, ast.value, ast);
      }
      break;
    case "Literal":
      if (inRange(offset, ast)) {
        node = ast;
        node.parent = parent;
      }
      break;
    default:
      return;
  }
}

function inRange(offset: number, ast: AST): boolean {
  if (offset >= ast.start && offset < ast.end) {
    return true;
  }
  return false;
}

export interface Entity {
  target: 'tagName' | 'attributeName' | 'attributeValue' | 'children',
  parent: Entity,
  value: string
}

function ASTtoEntity(ast: AST): Entity {
  switch (ast.type) {
    // case "Program":
    //   break;
    // case "ExpressionStatement":
    //   break;
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
    // case "JSXIdentifier":
    //   break;
    case "JSXAttribute":
      // return attributes names of some component
      // happends when pressed enter on an attribute
      // TODO: should more intelligent ? 
      return {
        target: 'attributeName',
        parent: {
          target: 'tagName',
          parent: {},
          value: ast.parent ? ast.parent.name ? ast.parent.name.name : '' : ''
        },
        value: ast.name ? ast.name.name : '',
      } as Entity;
    // case "JSXExpressionContainer":
    //   break;
    case "Literal":
      return {
        target: 'attributeValue',
        parent: ASTtoEntity(ast.parent),
        value: ast.value ? ast.value : '',
      } as Entity;
    default:
      console.error("Invalid");
      console.error(ast);
      throw new Error("Invalid");
  }
}