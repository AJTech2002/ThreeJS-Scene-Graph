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
const GameComponent_1 = __importDefault(require("./GameComponent"));
const THREE = __importStar(require("three"));
class CameraComponent extends GameComponent_1.default {
    constructor() {
        super(...arguments);
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    }
    awake() {
        super.awake();
        this.gameObject.scene.activeCamera = this.camera;
    }
    update() {
        var _a, _b;
        super.update();
        this.camera.setRotationFromEuler((_a = this.transform) === null || _a === void 0 ? void 0 : _a.getTransformedRotation());
        this.camera.position.copy((_b = this.transform) === null || _b === void 0 ? void 0 : _b.getTransformedPosition());
    }
}
exports.default = CameraComponent;
