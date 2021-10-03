import * as THREE from "three";
import * as SceneJSON from "../scene-parsed/scene.json";
import GameObject from "./GameObject";
import { Components, returnProperty } from "../scene-parsed/components";
import { returnValidatedProperty } from "../scene-parsed/utility/propGenerator";

export default class Scene {
  public scene: THREE.Scene;
  public camera: THREE.Camera;
  public renderer: THREE.Renderer;
  public clock: THREE.Clock;
  public gameObjects: GameObject[];
  public externalUpdate: any;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.clock = new THREE.Clock();

    this.render = this.render.bind(this);

    this.gameObjects = [];
  }

  setup(domElement: HTMLElement, externalUpdate: any) {
    this.externalUpdate = externalUpdate;
    domElement.appendChild(this.renderer.domElement);
  }

  addGameObject(go: GameObject) {
    this.gameObjects.push(go);

    go.scene = this;
    go.threeJSScene = this.scene;
    go.instantiated = true;

    go.awake();
  }

  findGameObject(name: string) {
    for (let i = 0; i < this.gameObjects.length; i++) {
      if (this.gameObjects[i].name === name) return this.gameObjects[i];
    }

    return null;
  }

  parseScene() {
    let gameObjects = SceneJSON.gameObjects;

    gameObjects.forEach((go) => {
      let createdGO = new GameObject(go.name);

      if (createdGO) {
        go.components.forEach((co) => {
          let componentProps: Record<string, any> = {};

          //Go through each prop name
          co.props.forEach((prop) => {
            const innerCo = co as Record<string, any>;
            let foundProp = returnValidatedProperty(
              innerCo[prop],
              returnProperty(co.name, prop).type
            );
            componentProps[prop] = foundProp;
          });

          type ComponentName = keyof typeof Components;
          let newComponent = new Components[co.name as ComponentName](
            co.name,
            createdGO,
            componentProps
          );
          createdGO.attachComponent(newComponent);
        });
      }

      this.addGameObject(createdGO);
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
