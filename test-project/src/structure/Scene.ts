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
  public externalUpdate: null | ((delta?: number) => void);

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
    this.externalUpdate = null;

    this.gameObjects = [];
  }

  setup(domElement: HTMLElement, externalUpdate: Scene["externalUpdate"]) {
    this.externalUpdate = externalUpdate;
    domElement.appendChild(this.renderer.domElement);
  }

  addGameObject(gameObject: GameObject) {
    this.gameObjects.push(gameObject);

    gameObject.scene = this;
    gameObject.threeJSScene = this.scene;
    gameObject.instantiated = true;

    gameObject.awake();
  }

  findGameObject(name: string) {
    return this.gameObjects.find((e) => e.name === name) || null;
  }

  parseScene() {
    const gameObjects = SceneJSON.gameObjects;

    // Loop through each of the game objects in the JSON list
    for (const jsonObject of gameObjects) {
      const gameObject = new GameObject(jsonObject.name);
      gameObject.parentName = jsonObject.parent;

      // Attach all the components in the JSON to the game object
      for (const jsonComponent of jsonObject.components) {
        const componentProps: Record<string, any> = {};

        // Go through each prop name, and parse the given data

        // TODO: This parsing logic is bad
        for (const prop of jsonComponent.props) {
          const innerCo = jsonComponent as Record<string, any>;
          let foundProp = returnValidatedProperty(
            innerCo[prop],
            returnProperty(jsonComponent.name, prop).type
          );
          componentProps[prop] = foundProp;
        }

        // `jsonComponent.name` should be one of the component names, otherwise
        // the program will crash
        // TODO: Scene validation; maybe?
        type ComponentName = keyof typeof Components;
        const ComponentClass = Components[jsonComponent.name as ComponentName];

        const component = new ComponentClass(
          jsonComponent.name,
          gameObject,
          componentProps
        );
        gameObject.attachComponent(component);
      }

      this.addGameObject(gameObject);
    }

    for (const gameObject of this.gameObjects) {
      if (gameObject.parentName !== "") {
        const foundParent = this.findGameObject(gameObject.parentName);
        if (foundParent) gameObject.setParent(foundParent);
      }
    }
  }

  render() {
    const delta = this.clock.getDelta();
    requestAnimationFrame(this.render);

    for (const gameObject of this.gameObjects) {
      gameObject.update(delta);
    }

    this.renderer.render(this.scene, this.camera);

    if (this.externalUpdate) this.externalUpdate(delta);
  }
}
