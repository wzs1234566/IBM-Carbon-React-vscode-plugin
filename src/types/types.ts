import { Node } from '@babel/types';
export interface AST {
    node: Node,
    parent: Node,
};

export interface Entity {
    target: 'tagName' | 'attributeName' | 'attributeValue' | 'children',
    parent: Entity,
    value: string
}

export interface CarbonModel {
    [key: string]: Model
}

export interface Model {
    description: string,
    displayName: string,
    props?: {
        [key: string]: PropsModel
    }
    // composes?: any
}
export interface PropsModel {
    defaultValue?: {
        computed: boolean
        value: string
    },
    description?: string,
    required: boolean,
    type?: {
        name?: string,
        value?: any,
        raw?: string,
        computed?: boolean
    }
}