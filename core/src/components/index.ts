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

export const DefaultComponents = {
  CameraComponent,
  MeshComponent,
  TransformComponent,
};

export const DefaultComponentProps = {
  MeshComponentProps,
  CameraComponentProps,
  TransformComponentProps,
};

export {
  GameComponent,
  CameraComponent,
  MeshComponent,
  TransformComponent,
  GameObject,
  Input,
  Scene,
  MeshComponentProps,
  CameraComponentProps,
  TransformComponentProps,
};

export const DefaultComponentNames = Object.keys(DefaultComponents);
