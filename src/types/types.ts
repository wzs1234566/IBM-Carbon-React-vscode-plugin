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

export interface Entity {
    target: 'tagName' | 'attributeName' | 'attributeValue' | 'children',
    parent: Entity,
    value: string
}