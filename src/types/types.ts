export interface AST {
    type: string,
    start: number,
    end: number,
    parent: AST,
    body?: AST[],
    expression?: AST,
    openingElement?: AST,
    attributes?: AST[],
    name?: any,
    value?: AST,
    children?: AST[]
}

export interface Entity {
    target: 'tagName' | 'attributeName' | 'attributeValue' | 'children',
    parent: Entity,
    value: string
}

export type CarbonModel = Record<string, Model>;
export interface Model {
    description: string,
    displayName: string,
    props?: Record<string, PropsModel>;
}
export interface PropsModel {
    defaultValue?: {
        computed: boolean
        value: string
    },
    description?: string,
    required: boolean,
    type?: any
}