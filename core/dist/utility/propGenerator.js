"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnValidatedProperty = void 0;
const three_1 = require("three");
const returnValidatedProperty = (value, type) => {
    //Handle custom types
    if (type === "vec3")
        return new three_1.Vector3(value[0], value[1], value[2]);
    if (type === "eul3")
        return new three_1.Euler(value[0], value[1], value[2]);
    return value;
};
exports.returnValidatedProperty = returnValidatedProperty;
