import * as THREE from "three";
import * as SceneJSON from "../scene.json";
import GameObject from "./GameObject";
import { Components, returnProperty } from "../components";
import { returnValidatedProperty } from "../utility/propGenerator";
import Input from "./Input";
import { Object3D, Vector2, Vector3 } from "three";
import RaycastHit from "./RaycastHit";

export default class Scene {
  public scene: THREE.Scene;
  public activeCamera: THREE.Camera | null;
  public renderer: THREE.Renderer;
  public clock: THREE.Clock;
  public gameObjects: (GameObject | null)[];
  public externalUpdate: null | ((delta?: number) => void);
  public inputSystem: Input;
  public raycaster: THREE.Raycaster | null = null;
  private gridHelper: THREE.GridHelper;

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

    this.gridHelper = new THREE.GridHelper(100, 100);

    this.scene.add(this.gridHelper);

  }

  setup(domElement: HTMLElement, externalUpdate: Scene["externalUpdate"]) {
    this.externalUpdate = externalUpdate;
    domElement.appendChild(this.renderer.domElement);
    this.inputSystem.setup();
  }

  //Type 0 (Down), 1 (Up)
  inputEvent(type: number, key: string) {
    this.gameObjects.forEach((go: GameObject | null) => {
      if (go && go.instantiated) {
        go.inputEvent(type, key);
      }
    });
  }

  screenRaycastObjects(screenPosition: Vector2, gameObjects: GameObject[]): RaycastHit | null {
    if (this.activeCamera) {
      this.raycaster!.setFromCamera(screenPosition, this.activeCamera);

      let found: RaycastHit | null = null;

      gameObjects.forEach((go) => {
        if (go.storedThreeObject) {
          const intersections: THREE.Intersection[] = this.raycaster!.intersectObject(go.storedThreeObject);

          if (intersections.length > 0) {
            const hit = new RaycastHit();
            hit.gameObject = go;
            hit.intersection = intersections[0];
            found = hit;
          }

        }
      });

      return found;
    }

    return null;
  }

  screenRaycast(screenPosition: Vector2): THREE.Intersection[] {
    if (this.activeCamera) {
      this.raycaster!.setFromCamera(screenPosition, this.activeCamera);

      let visibleObject: Object3D[] = [];

      this.gameObjects.forEach((go) => {
        if (go && go.storedThreeObject)
          visibleObject.push(go.storedThreeObject);
      });

      return this.raycaster!.intersectObjects(visibleObject);
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

  destroy(gameObject: GameObject) {
    const index = this.gameObjects.indexOf(gameObject);
    if (index > -1) {
      delete this.gameObjects[index];
      this.gameObjects.splice(index, 1); // 2nd parameter means remove one item only
    }

    gameObject.destroy();


  }

  findGameObject(name: string) {
    return this.gameObjects.find((e) => (e) ? e.name === name : false) || null;
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
      if (gameObject && gameObject.parentName !== "") {
        const foundParent = this.findGameObject(gameObject.parentName);
        if (foundParent) gameObject.setParent(foundParent);
      }
    }
  }

  render() {
    const delta = this.clock.getDelta();
    requestAnimationFrame(this.render);

    for (const gameObject of this.gameObjects) {
      if (gameObject)
        gameObject.update(delta);
    }

    if (this.activeCamera) this.renderer.render(this.scene, this.activeCamera);

    if (this.externalUpdate) this.externalUpdate(delta);
  }
}
