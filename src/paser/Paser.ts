import { Entity, AST } from '../types/types';
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import { Node } from '@babel/types';

export async function findEntityAtPosition(offset: number, documentText: string): Promise<Entity> {
  const ast = parser.parse(documentText, {
    sourceType: "module",
    plugins: ["jsx"]
  });
  // walkAST(offset, ast, {} as AST);
  let node: AST;
  traverse(ast, {
    enter(path) {
      // if (
      //   path.node.type === "Identifier" &&
      //   path.node.name === "n"
      // ) {
      //   path.node.name = "x";
      // }
      console.log(path.node);
      switch (path.node.type) {
        case 'JSXElement':
        case 'JSXOpeningElement':
        case 'JSXAttribute':
        case 'JSXExpressionContainer':
        case 'Identifier':
          if (inRange(offset, ast)) {
            node.node = path.node;
            node.parent = path.parent;
          }
      }
    }
  });
  return ASTtoEntity(node);
}



// walks the ast and returns the ast node position is in
function walkAST(offset: number, ast: AST, parent: AST): void {
  switch (ast.type) {
    // case "Program":
    //   if (ast.body) {
    //     for (let i = 0; i < ast.body.length; i++) {
    //       walkAST(offset, ast.body[i], ast);
    //     }
    //   }
    //   break;
    // case "ExpressionStatement":
    //   if (ast.expression && ast.expression.type === "JSXElement") {
    //     walkAST(offset, ast.expression, ast);
    //   }
    //   break;
    // case "JSXElement":
    //   if (inRange(offset, ast) && ast.openingElement && ast.children) {
    //     node = ast;
    //     node.parent = parent;
    //     walkAST(offset, ast.openingElement, ast);
    //     for (let i = 0; i < ast.children.length; i++) {
    //       walkAST(offset, ast.children[i], ast);
    //     }
    //   }
    //   break;
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
        walkAST(offset, ast.name, node);
        walkAST(offset, ast.value, node);
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

function inRange(offset: number, ast: Node): boolean {
  if (offset >= (ast.start || 0) && offset < (ast.end || 0)) {
    return true;
  }
  return false;
}

function ASTtoEntity(node: Node, parent: Node): Entity {
  switch (node.type) {
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
          value: node.openingElement ? node.openingElement.name ? node.openingElement.name : '' : ''
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
          value: node.name ? node.name : ''
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
          value: parent.name,
        },
        value: node.name,
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
          value: node.parent ? node.parent.name ? node.parent.name.name : '' : ''
        },
        value: node.name ? (node.name.name ? node.name.name : node.name) : '',
      } as Entity;
    // case "JSXExpressionContainer":
    //   break;
    case "Literal":
      return {
        target: 'attributeValue',
        parent: ASTtoEntity(node.parent),
        value: node.value ? node.value : '',
      } as Entity;
    default:
      console.error("Invalid");
      console.error(node);
      throw new Error("Invalid");
  }
}