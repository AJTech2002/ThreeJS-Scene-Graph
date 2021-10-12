import * as THREE from "three";
import GameObject from "./GameObject";
import { DefaultComponents } from "../components";
import {
  returnDefaultValue,
  returnValidatedProperty,
} from "../utility/propGenerator";
import Input from "./Input";
import { Vector2 } from "three";
import GameComponent from "./GameComponent";
import { getData, projectRoot } from "../../App";

export default class Scene {
  public scene: THREE.Scene;
  public activeCamera: THREE.PerspectiveCamera | null;
  public renderer: THREE.Renderer;
  public clock: THREE.Clock;
  public gameObjects: GameObject[];
  public externalUpdate: null | ((delta?: number) => void);
  public inputSystem: Input;
  private raycaster: THREE.Raycaster | null = null;
  public parsedComponents: any = {};

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

    gameObject.scene = this;
    gameObject.threeJSScene = this.scene;
    gameObject.instantiated = true;

    gameObject.awake();
  }

  findGameObject(name: string) {
    return this.gameObjects.find((e) => e.name === name) || null;
  }

  returnComponentJSON(componentName: string): Promise<any> {
    //found JSON
    return getData(
      "componentJSON",
      `?root=${projectRoot}&component=${componentName}`
    ).then((d: string): any => {
      try {
        let json = JSON.parse(d);
        return json;
      } catch (e: any) {
        return {};
      }
    });
  }

  parseType(type: string, val: any): any {
    if (type === "vec3" || type === "eul3") {
      return [val.x, val.y, val.z];
    }

    return val;
  }

  getComponentJSON(comp: GameComponent): any {
    let template: any = {
      name: comp.name,
      props: [],
    };

    let objComp = this.parsedComponents[comp.name];
    for (const [k, v] of Object.entries(objComp)) {
      template.props.push(k as string);
      if (k in comp)
        template[k] = this.parseType((v as any).type, (comp as any)[k]);
      else if (k in comp.props)
        template[k] = this.parseType((v as any).type, (comp.props as any)[k]);
    }

    return template;
  }

  serialize(): string {
    let sceneJSON: any = {
      gameObjects: [],
    };

    this.gameObjects.forEach((go) => {
      let goTemplate: any = {
        name: go.name,
        parent: go.parentName,
        components: [],
      };

      go.components.forEach((comp) => {
        goTemplate.components.push(this.getComponentJSON(comp));
      });

      sceneJSON.gameObjects.push(goTemplate);
    });

    return JSON.stringify(sceneJSON);
  }

  parseComponents(json: string): Promise<void>[] {
    const SceneJSON = JSON.parse(json);
    let promises: Promise<void>[] = [];
    const gameObjects = SceneJSON.gameObjects;
    if (!gameObjects) return [];
    // Loop through each of the game objects in the JSON list
    for (const jsonObject of gameObjects) {
      for (const jsonComponent of jsonObject.components) {
        promises.push(
          this.returnComponentJSON(jsonComponent.name).then((d) => {
            this.parsedComponents[jsonComponent.name] = d;
          })
        );
      }
    }

    console.log(this.parsedComponents);
    return promises;
  }

  parseScene(json: string) {
    this.parsedComponents = {};
    this.gameObjects = [];
    this.activeCamera = null;

    Promise.all(this.parseComponents(json)).then(() => {
      const SceneJSON = JSON.parse(json);

      const gameObjects = SceneJSON.gameObjects;
      if (!gameObjects) return;
      // Loop through each of the game objects in the JSON list
      for (const jsonObject of gameObjects) {
        const gameObject = new GameObject(jsonObject.name);
        gameObject.parentName = jsonObject.parent;

        // Attach all the components in the JSON to the game object
        for (const jsonComponent of jsonObject.components) {
          const componentProps: Record<string, any> = {};

          // Go through each prop name, and parse the given data

          // TODO: This parsing logic is bad

          if (jsonComponent.name in this.parsedComponents)
            for (const [k, v] of Object.entries(
              (this.parsedComponents as any)[jsonComponent.name]
            )) {
              const innerCo = jsonComponent as Record<string, any>;
              let foundProp = returnDefaultValue((v as any).type);

              if (k in innerCo) {
                foundProp = returnValidatedProperty(
                  innerCo[k],
                  (v as any).type
                );
              }

              componentProps[k] = foundProp;
            }

          // `jsonComponent.name` should be one of the component names, otherwise
          // the program will crash
          // TODO: Scene validation; maybe?
          type ComponentName = keyof typeof DefaultComponents;

          let ComponentClass = GameComponent;

          if (jsonComponent.name in DefaultComponents)
            ComponentClass =
              DefaultComponents[jsonComponent.name as ComponentName];

          const component: any = new ComponentClass(
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
    });
  }

  render() {
    const delta = this.clock.getDelta();
    requestAnimationFrame(this.render);

    for (const gameObject of this.gameObjects) {
      gameObject.update(delta);
    }

    if (this.activeCamera) this.renderer.render(this.scene, this.activeCamera);

    if (this.externalUpdate) this.externalUpdate(delta);
  }
}
