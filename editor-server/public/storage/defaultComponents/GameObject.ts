import Scene from "./Scene";
import GameComponent from "./GameComponent";
import TransformComponent from "./TransformComponent";
import Input from "./Input";

export default class GameObject {
  public scene: Scene | null;
  public instantiated: boolean;
  public name: string;
  public components: GameComponent[];
  public transform: TransformComponent | null;
  public threeJSScene: THREE.Scene | null;
  public parent: GameObject | null;
  public parentName: string;

  constructor(name: string) {
    this.instantiated = false;
    this.name = name;
    this.components = [];
    this.transform = null;
    this.threeJSScene = null;
    this.scene = null;
    this.parent = null;
    this.parentName = "";
  }

  awake() {
    this.transform = this.findComponent(
      "TransformComponent"
    ) as TransformComponent | null;

    if (!this.transform) console.error("No transform found on : " + this.name);

    this.components.forEach((c) => {
      c.input = this.getInput();
      c.transform = this.transform;
      c?.awake();
    });
  }

  setParent(gameObject: GameObject) {
    this.parent = gameObject;
  }

  getInput(): Input | undefined {
    return this.scene?.inputSystem;
  }

  findComponentOfType<T>(componentName: string): T | null {
    return this.findComponent(componentName) as T | null;
  }

  inputEvent(type: number, key: string) {
    this.components.forEach((comp: GameComponent) => {
      if (type === 0) comp.onKeyDown(key);
      else if (type === 1) comp.onKeyUp(key);
    });
  }

  findComponent(name: string) {
    return this.components.find((e) => e.name === name) || null;
  }

  attachComponent(component: GameComponent) {
    this.components.push(component);
    if (this.instantiated) component?.awake();
  }

  update(dt: number) {
    this.components.forEach((c) => {
      c?.update(dt);
      c?.executeOnEditorUpdate();
    });
  }
}
