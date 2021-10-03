import * as THREE from 'three';
import * as SceneJSON from '../scene-parsed/scene.json';
import GameObject from './GameObject';
import { Components, returnProperty } from '../scene-parsed/components';
import { returnValidatedProperty } from '../scene-parsed/utility/propGenerator';

export default class Scene {

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.clock = new THREE.Clock();

        this.render = this.render.bind(this);

        this.gameObjects = [];
    }

    setup(domElement, externalUpdate) {
        this.externalUpdate = externalUpdate;
        domElement.appendChild(this.renderer.domElement);
    }

    addGameObject(go) {
        this.gameObjects.push(go);

        go.scene = this;
        go.threeJSScene = this.scene;
        go.instantiated = true;

        go.awake();
    }

    findGameObject(name) {
        for (let i = 0; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i].name === name) return this.gameObjects[i];
        }

        return null;
    }

    parseScene() {
        let sceneGameObjects = SceneJSON.gameObjects;

        sceneGameObjects.forEach((go) => {
            let createdGO = new GameObject(go.name);
            createdGO.parentName = go.parent;

            if (createdGO) {
                go.components.forEach((co) => {
                    let componentProps = {};
                    //Go through each prop name
                    co.props.forEach((prop) => {
                        let foundProp = returnValidatedProperty(co[prop], returnProperty(co.name, prop).type);
                        componentProps[prop] = foundProp;
                    });

                    let newComponent = new Components[co.name](co.name, createdGO, componentProps);
                    createdGO.attachComponent(newComponent);
                });
            }

            this.addGameObject(createdGO);
        });

        this.gameObjects.forEach((go) => {
            if (go.parentName !== "") {
                let foundObject = this.findGameObject(go.parentName);
                if (foundObject) go.setParent(foundObject);
            }
        });

    }

    render() {
        let delta = this.clock.getDelta();
        requestAnimationFrame(this.render);
        this.gameObjects.forEach((go) => {
            go.update(delta);
        });

        this.renderer.render(this.scene, this.camera);

        if (this.externalUpdate) this.externalUpdate(delta);
    }

}