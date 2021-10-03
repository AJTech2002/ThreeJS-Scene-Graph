//File will be auto-generated

import MoveObject from "../structure/MoveObject";
import TransformComponent from "../structure/TransformComponent";
import GameComponent from "../structure/GameComponent";
import MeshComponent from "../structure/MeshComponent";

import * as MeshComponentProps from './component-props/MeshComponent.props.json';
import * as MoveObjectProps from './component-props/MoveObject.props.json';
import * as TransformComponentProps from './component-props/TransformComponent.props.json';

export const Components = {
    MoveObject,
    TransformComponent,
    GameComponent,
    MeshComponent
};


export const returnProperty = (component, property) => {
    const ComponentProperties = {
        MeshComponentProps,
        MoveObjectProps,
        TransformComponentProps
    };
    return ComponentProperties[component + "Props"].default[property];
}