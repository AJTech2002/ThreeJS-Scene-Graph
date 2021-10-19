"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultComponentNames = exports.parseType = exports.returnDefaultValue = exports.returnValidatedProperty = exports.TransformComponentProps = exports.CameraComponentProps = exports.MeshComponentProps = exports.Scene = exports.Input = exports.GameObject = exports.TransformComponent = exports.MeshComponent = exports.CameraComponent = exports.GameComponent = exports.DefaultComponentProps = exports.DefaultComponents = void 0;
const GameComponent_1 = __importDefault(require("./GameComponent"));
Object.defineProperty(exports, "GameComponent", { enumerable: true, get: function () { return GameComponent_1.default; } });
const CameraComponent_1 = __importDefault(require("./CameraComponent"));
Object.defineProperty(exports, "CameraComponent", { enumerable: true, get: function () { return CameraComponent_1.default; } });
const GameObject_1 = __importDefault(require("./GameObject"));
Object.defineProperty(exports, "GameObject", { enumerable: true, get: function () { return GameObject_1.default; } });
const Input_1 = __importDefault(require("./Input"));
Object.defineProperty(exports, "Input", { enumerable: true, get: function () { return Input_1.default; } });
const MeshComponent_1 = __importDefault(require("./MeshComponent"));
Object.defineProperty(exports, "MeshComponent", { enumerable: true, get: function () { return MeshComponent_1.default; } });
const Scene_1 = __importDefault(require("./Scene"));
Object.defineProperty(exports, "Scene", { enumerable: true, get: function () { return Scene_1.default; } });
const TransformComponent_1 = __importDefault(require("./TransformComponent"));
Object.defineProperty(exports, "TransformComponent", { enumerable: true, get: function () { return TransformComponent_1.default; } });
const three_1 = require("three");
const MeshComponentProps = __importStar(require("../component-props/MeshComponent.props.json"));
exports.MeshComponentProps = MeshComponentProps;
const CameraComponentProps = __importStar(require("../component-props/CameraComponent.props.json"));
exports.CameraComponentProps = CameraComponentProps;
const TransformComponentProps = __importStar(require("../component-props/TransformComponent.props.json"));
exports.TransformComponentProps = TransformComponentProps;
exports.DefaultComponents = {
    CameraComponent: CameraComponent_1.default,
    MeshComponent: MeshComponent_1.default,
    TransformComponent: TransformComponent_1.default,
};
exports.DefaultComponentProps = {
    MeshComponentProps,
    CameraComponentProps,
    TransformComponentProps,
};
//Handling custom types (right now just vec3, eul3)
const returnValidatedProperty = (value, type) => {
    //Handle custom types (cant directly be serialized by json)
    if (type === "vec3")
        return new three_1.Vector3(value[0], value[1], value[2]);
    if (type === "eul3")
        return new three_1.Euler(value[0], value[1], value[2]);
    return value;
};
exports.returnValidatedProperty = returnValidatedProperty;
const returnDefaultValue = (type) => {
    //All supported serializable types
    if (type === "vec3")
        return new three_1.Vector3(0, 0, 0);
    if (type === "eul3")
        return new three_1.Euler(0, 0, 0);
    if (type === "float")
        return 0;
    if (type === "string")
        return "";
    if (type === "none")
        return null;
    if (type === "boolean" || type === "bool")
        return false;
    if (type === "dict")
        return {};
    return {};
};
exports.returnDefaultValue = returnDefaultValue;
const parseType = (type, val) => {
    if (type === "vec3" || type === "eul3") {
        return [val.x, val.y, val.z];
    }
    return val;
};
exports.parseType = parseType;
exports.DefaultComponentNames = Object.keys(exports.DefaultComponents);
