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
class MeshComponent extends GameComponent_1.default {
    constructor(name, gameObject, componentProps) {
        super(name, gameObject, componentProps);
        //[prop primitive boolean]
        this.primitive = false;
        //[prop color string]
        this.color = "ffffff";
        //[prop primitiveShape string]
        this.primitiveShape = "None";
        this.mesh = null;
    }
    awake() {
        super.awake();
        if (!this.color)
            this.color = "ffffff";
        if (this.primitive) {
            if (this.primitiveShape === "Cube" && this.gameObject.threeJSScene) {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshBasicMaterial({
                    color: parseInt(this.color, 16),
                });
                this.mesh = new THREE.Mesh(geometry, material);
                //Inject GameObject into THREE Mesh to allow access from Raycasts ex.
                let tempMesh = this.mesh;
                tempMesh.gameObject = this.gameObject;
                this.gameObject.threeJSScene.add(this.mesh);
            }
        }
    }
    executeOnEditorUpdate() {
        if (!this.color)
            this.color = "ffffff";
        this.mesh.material.color.setHex(parseInt(this.color, 16));
    }
    update() {
        var _a, _b;
        super.update();
        if (this.mesh && ((_a = this.gameObject.transform) === null || _a === void 0 ? void 0 : _a.matrix)) {
            const outputScale = new THREE.Vector3().setFromMatrixScale(this.gameObject.transform.matrix);
            var rotMat2 = new THREE.Matrix4().extractRotation((_b = this.gameObject.transform) === null || _b === void 0 ? void 0 : _b.matrix);
            const outputRotation = new three_1.Quaternion().setFromRotationMatrix(rotMat2);
            // const outputRotation = new Euler().setFromRotationMatrix(
            //   this.gameObject.transform.matrix
            // );
            const outputPosition = new THREE.Vector3().setFromMatrixPosition(this.gameObject.transform.matrix);
            this.mesh.setRotationFromQuaternion(outputRotation.clone());
            this.mesh.scale.copy(outputScale);
            this.mesh.position.copy(outputPosition);
            this.mesh.updateMatrixWorld();
        }
    }
}
exports.default = MeshComponent;
