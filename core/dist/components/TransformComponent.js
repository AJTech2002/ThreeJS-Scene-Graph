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
const THREE = __importStar(require("three"));
const three_1 = require("three");
const GameComponent_1 = __importDefault(require("./GameComponent"));
class TransformComponent extends GameComponent_1.default {
    constructor(name, gameObject, componentProps) {
        super(name, gameObject, componentProps);
        //[prop position vec3]
        this.position = new three_1.Vector3(0, 0, 0);
        //[prop rotation eul3]
        this.rotation = new three_1.Euler(0, 0, 0);
        //[prop scale vec3]
        this.scale = new three_1.Vector3(1, 1, 1);
        this.quaternion = new three_1.Quaternion();
        this.matrix = null;
        this.updateTransform();
    }
    updateTransform() {
        this.matrix = new THREE.Matrix4();
        let quat = this.quaternion;
        this.matrix.compose(this.position.clone(), quat.clone(), this.scale.clone());
    }
    rotateOnAxis(axis, angle) {
        let newQuat = new THREE.Quaternion()
            .setFromAxisAngle(axis.normalize(), angle)
            .normalize();
        this.quaternion = this.quaternion.multiply(newQuat).normalize();
    }
    getEulerRotation() {
        return this.rotation;
    }
    setRotationFromEuler(euler) {
        this.quaternion.setFromEuler(euler.clone());
    }
    transformVector(vector, isDirection) {
        const vec4 = new three_1.Vector4(vector.x, vector.y, vector.z, isDirection ? 0 : 1);
        vec4.applyMatrix4(this.matrix);
        return new three_1.Vector3(vec4.x, vec4.y, vec4.z);
    }
    getTransformedPosition() {
        if (!this.matrix)
            return this.position;
        const outputPosition = new THREE.Vector3().setFromMatrixPosition(this.matrix);
        return outputPosition;
    }
    getTransformedRotation() {
        if (!this.matrix)
            return this.rotation;
        const outputRotation = new THREE.Euler().setFromRotationMatrix(this.matrix);
        return outputRotation;
    }
    getTransformedScale() {
        if (!this.matrix)
            return this.scale;
        const outputScale = new THREE.Vector3().setFromMatrixPosition(this.matrix);
        return outputScale;
    }
    awake() {
        this.quaternion.setFromEuler(this.rotation).normalize();
    }
    update() {
        var _a, _b;
        this.updateTransform();
        this.rotation.setFromQuaternion(this.quaternion);
        if (this.matrix && ((_b = (_a = this.gameObject.parent) === null || _a === void 0 ? void 0 : _a.transform) === null || _b === void 0 ? void 0 : _b.matrix)) {
            this.matrix.copy(this.matrix.premultiply(this.gameObject.parent.transform.matrix));
        }
    }
}
exports.default = TransformComponent;
