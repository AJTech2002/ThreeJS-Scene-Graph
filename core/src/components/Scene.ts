import * as THREE from "three";
import GameObject from "./GameObject";

import { returnValidatedProperty } from "./";
import Input from "./Input";
import { Vector2 } from "three";

export default class Scene {
  public scene: THREE.Scene;
  public isEditor: boolean = false;
  public activeCamera: THREE.PerspectiveCamera | null;
  public renderer: THREE.Renderer;
  public clock: THREE.Clock;
  public gameObjects: GameObject[];
  public externalUpdate: null | ((delta?: number) => void);
  public inputSystem: Input;
  protected raycaster: THREE.Raycaster | null = null;

  constructor() {
    this.scene = new THREE.Scene();
    this.activeCamera = null;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.clock = new THREE.Clock();

    this.render = this.render.bind(this);
    this.externalUpdate = null;

    this.gameObjects = [];

    this.inputSystem = new Input(this);

    this.raycaster = new THREE.Raycaster();
  }

  onWindowResize() {
    if (this.activeCamera) {
      this.activeCamera.aspect = window.innerWidth / window.innerHeight;
      this.activeCamera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  setup(domElement: HTMLElement, externalUpdate: Scene["externalUpdate"]) {
    this.externalUpdate = externalUpdate;
    domElement.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    this.inputSystem.setup();
  }

  //Type 0 (Down), 1 (Up)
  inputEvent(type: number, key: string) {
    this.gameObjects.forEach((go: GameObject) => {
      if (go.instantiated) {
        go.inputEvent(type, key);
      }
    });
  }

  screenRaycast(screenPosition: Vector2): THREE.Intersection[] {
    if (this.activeCamera) {
      this.raycaster!.setFromCamera(screenPosition, this.activeCamera);

      return this.raycaster!.intersectObjects(this.scene.children);
    }

    return [];
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

  parseScene(componentDeclarations: any, sceneJSON: string) {
    let returnProperty = componentDeclarations.returnProperty;
    let Components = componentDeclarations.Components;

    //Hello
    let parsedJSON = JSON.parse(sceneJSON);

    let gameObjects = parsedJSON["gameObjects"];

    if (!gameObjects && parsedJSON["default"] !== undefined) {
      gameObjects = parsedJSON["default"]["gameObjects"];
      if (!gameObjects) return;
    }
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

          if (prop in innerCo && returnProperty(jsonComponent.name, prop)) {
            let foundProp = returnValidatedProperty(
              innerCo[prop],
              returnProperty(jsonComponent.name, prop).type
            );
            componentProps[prop] = foundProp;
          }
        }

        // `jsonComponent.name` should be one of the component names, otherwise
        // the program will crash
        // TODO: Scene validation; maybe?
        type ComponentName = keyof typeof Components;
        const ComponentClass = Components[jsonComponent.name as ComponentName];

        const component = new ComponentClass(
          jsonComponent.name,
          gameObject,
          componentProps //still pass in if needed
        );

        //pre-assign component properties (only validated props)
        for (const [k, v] of Object.entries(componentProps)) {
          if (k in component) component[k] = v;
        }

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
      gameObject.update(delta, this.isEditor);
    }

    if (this.activeCamera) this.renderer.render(this.scene, this.activeCamera);

    if (this.externalUpdate) this.externalUpdate(delta);
  }
}
