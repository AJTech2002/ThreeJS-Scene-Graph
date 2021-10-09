import { Euler, Vector3 } from "three";

export const returnValidatedProperty = (value: any, type: string) => {
  //Handle custom types

  if (type === "vec3") return new Vector3(value[0], value[1], value[2]);
  if (type === "eul3") return new Euler(value[0], value[1], value[2]);

  return value;
};
