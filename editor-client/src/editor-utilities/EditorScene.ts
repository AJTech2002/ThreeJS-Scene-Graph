import * as THREE from "three";
import { GameObject, Input, Scene } from "@razor/core";
import { Vector2 } from "three";
import {
  serialize,
  parseSerializedJSON,
} from "./EditorSceneParsing";

export default class EditorScene extends Scene {
  public scene: THREE.Scene;
  public activeCamera: THREE.PerspectiveCamera | null;
  public renderer: THREE.Renderer;
  public clock: THREE.Clock;
  public gameObjects: GameObject[];
  public externalUpdate: null | ((delta?: number) => void);
  public inputSystem: Input;
  protected raycaster: THREE.Raycaster | null = null;
  public parsedComponents: any = {};

  //Public functions that have been moved out
  public serialize = serialize;
  public parseSerializedJSON = parseSerializedJSON;

  constructor() {
    super();
    this.scene = new THREE.Scene();
    this.activeCamera = null;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.clock = new THREE.Clock();

    this.render = this.render.bind(this);
    this.externalUpdate = null;

    this.gameObjects = [];

    this.inputSystem = new Input(this as any as Scene);

    this.raycaster = new THREE.Raycaster();
    this.parsedComponents = {};
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
    this.inputSystem.setup();
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
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

    gameObject.scene = this as any as Scene;
    gameObject.threeJSScene = this.scene;
    gameObject.instantiated = true;

    gameObject.awake();
  }

  findGameObject(name: string) {
    return this.gameObjects.find((e) => e.name === name) || null;
  }

  override render() {
    const delta = this.clock.getDelta();
    requestAnimationFrame(this.render);

    for (const gameObject of this.gameObjects) {
      gameObject.update(delta, true);
    }

    if (this.activeCamera) this.renderer.render(this.scene, this.activeCamera);

    if (this.externalUpdate) this.externalUpdate(delta);
  }
}
