import { default as GameComponent } from "./GameComponent";
import { default as CameraComponent } from "./CameraComponent";
import { default as GameObject } from "./GameObject";
import { default as Input } from "./Input";
import { default as MeshComponent } from "./MeshComponent";
import { default as Scene } from "./Scene";
import { default as TransformComponent } from "./TransformComponent";
import { Euler, Vector3 } from "three";

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

export const returnValidatedProperty = (value: any, type: string) => {
  //Handle custom types (cant directly be serialized by json)

  if (type === "vec3") return new Vector3(value[0], value[1], value[2]);
  if (type === "eul3") return new Euler(value[0], value[1], value[2]);

  return value;
};

export const returnDefaultValue = (type: string) => {
  //All supported serializable types

  if (type === "vec3") return new Vector3(0, 0, 0);
  if (type === "eul3") return new Euler(0, 0, 0);
  if (type === "float") return 0;
  if (type === "string") return "";
  if (type === "none") return null;
  if (type === "boolean" || type === "bool") return false;
  if (type === "dict") return {};

  return {};
};

export const DefaultComponentNames = Object.keys(DefaultComponents);
