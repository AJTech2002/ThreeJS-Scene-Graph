import { Euler, Vector3 } from "three";

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
