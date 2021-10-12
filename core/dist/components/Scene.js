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
const GameObject_1 = __importDefault(require("./GameObject"));
const _1 = require("./");
const Input_1 = __importDefault(require("./Input"));
class Scene {
    constructor() {
        this.isEditor = false;
        this.raycaster = null;
        this.scene = new THREE.Scene();
        this.activeCamera = null;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.clock = new THREE.Clock();
        this.render = this.render.bind(this);
        this.externalUpdate = null;
        this.gameObjects = [];
        this.inputSystem = new Input_1.default(this);
        this.raycaster = new THREE.Raycaster();
    }
    onWindowResize() {
        if (this.activeCamera) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    setup(domElement, externalUpdate) {
        this.externalUpdate = externalUpdate;
        domElement.appendChild(this.renderer.domElement);
        window.addEventListener("resize", this.onWindowResize.bind(this), false);
        this.inputSystem.setup();
    }
    //Type 0 (Down), 1 (Up)
    inputEvent(type, key) {
        this.gameObjects.forEach((go) => {
            if (go.instantiated) {
                go.inputEvent(type, key);
            }
        });
    }
    screenRaycast(screenPosition) {
        if (this.activeCamera) {
            this.raycaster.setFromCamera(screenPosition, this.activeCamera);
            return this.raycaster.intersectObjects(this.scene.children);
        }
        return [];
    }
    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
        gameObject.scene = this;
        gameObject.threeJSScene = this.scene;
        gameObject.instantiated = true;
        gameObject.awake();
    }
    findGameObject(name) {
        return this.gameObjects.find((e) => e.name === name) || null;
    }
    parseScene(componentDeclarations, sceneJSON) {
        let returnProperty = componentDeclarations.returnProperty;
        let Components = componentDeclarations.Components;
        //Hello
        let parsedJSON = JSON.parse(sceneJSON);
        let gameObjects = parsedJSON["gameObjects"];
        if (!gameObjects && parsedJSON["default"] !== undefined) {
            gameObjects = parsedJSON["default"]["gameObjects"];
            if (!gameObjects)
                return;
        }
        // Loop through each of the game objects in the JSON list
        for (const jsonObject of gameObjects) {
            const gameObject = new GameObject_1.default(jsonObject.name);
            gameObject.parentName = jsonObject.parent;
            // Attach all the components in the JSON to the game object
            for (const jsonComponent of jsonObject.components) {
                const componentProps = {};
                // Go through each prop name, and parse the given data
                // TODO: This parsing logic is bad
                for (const prop of jsonComponent.props) {
                    const innerCo = jsonComponent;
                    if (prop in innerCo && returnProperty(jsonComponent.name, prop)) {
                        let foundProp = (0, _1.returnValidatedProperty)(innerCo[prop], returnProperty(jsonComponent.name, prop).type);
                        componentProps[prop] = foundProp;
                    }
                }
                const ComponentClass = Components[jsonComponent.name];
                const component = new ComponentClass(jsonComponent.name, gameObject, componentProps //still pass in if needed
                );
                //pre-assign component properties (only validated props)
                for (const [k, v] of Object.entries(componentProps)) {
                    if (k in component)
                        component[k] = v;
                }
                gameObject.attachComponent(component);
            }
            this.addGameObject(gameObject);
        }
        for (const gameObject of this.gameObjects) {
            if (gameObject.parentName !== "") {
                const foundParent = this.findGameObject(gameObject.parentName);
                if (foundParent)
                    gameObject.setParent(foundParent);
            }
        }
    }
    render() {
        const delta = this.clock.getDelta();
        requestAnimationFrame(this.render);
        for (const gameObject of this.gameObjects) {
            gameObject.update(delta, this.isEditor);
        }
        if (this.activeCamera)
            this.renderer.render(this.scene, this.activeCamera);
        if (this.externalUpdate)
            this.externalUpdate(delta);
    }
}
exports.default = Scene;
