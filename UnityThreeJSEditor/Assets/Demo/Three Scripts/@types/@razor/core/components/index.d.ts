import { default as GameComponent } from "./GameComponent";
import { default as CameraComponent } from "./CameraComponent";
import { default as GameObject } from "./GameObject";
import { default as Input } from "./Input";
import { default as MeshComponent } from "./MeshComponent";
import { default as Scene } from "./Scene";
import { default as TransformComponent } from "./TransformComponent";
import * as MeshComponentProps from "../component-props/MeshComponent.props.json";
import * as CameraComponentProps from "../component-props/CameraComponent.props.json";
import * as TransformComponentProps from "../component-props/TransformComponent.props.json";
export declare const DefaultComponents: {
    CameraComponent: typeof CameraComponent;
    MeshComponent: typeof MeshComponent;
    TransformComponent: typeof TransformComponent;
};
export declare const DefaultComponentProps: {
    MeshComponentProps: {
        primitive: {
            type: string;
        };
        color: {
            type: string;
        };
        primitiveShape: {
            type: string;
        };
    };
    CameraComponentProps: {};
    TransformComponentProps: {
        position: {
            type: string;
        };
        rotation: {
            type: string;
        };
        scale: {
            type: string;
        };
    };
};
export { GameComponent, CameraComponent, MeshComponent, TransformComponent, GameObject, Input, Scene, MeshComponentProps, CameraComponentProps, TransformComponentProps, };
export declare const returnValidatedProperty: (value: any, type: string) => any;
export declare const returnDefaultValue: (type: string) => {} | null;
export declare const parseType: (type: string, val: any) => any;
export declare const DefaultComponentNames: string[];
