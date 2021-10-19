import {CameraComponent,CameraComponentProps,MeshComponent,MeshComponentProps,TransformComponent,TransformComponentProps} from '@razor/core';
import ColorChanger from '../game-logic/ColorChanger.ts'; 
import * as ColorChangerProps from './component-props/ColorChanger.props.json';
import HelloComponent from '../game-logic/HelloComponent.ts'; 
import * as HelloComponentProps from './component-props/HelloComponent.props.json';
import MoveObject from '../game-logic/MoveObject.ts'; 
import * as MoveObjectProps from './component-props/MoveObject.props.json';
export const Components = {
ColorChanger,
HelloComponent,
MoveObject,
CameraComponent,
MeshComponent,
TransformComponent
};

export const returnProperty = (component, property) => { 
const ComponentProperties = {
ColorChangerProps,
HelloComponentProps,
MoveObjectProps,
CameraComponentProps,
MeshComponentProps,
TransformComponentProps
};
return ComponentProperties[component+"Props"].default[property]; 
}