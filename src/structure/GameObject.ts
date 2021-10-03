import Scene from "./Scene";
import GameComponent from "./GameComponent";
import TransformComponent from "./TransformComponent";

export default class GameObject {
  public scene: Scene | null;
  public instantiated: boolean;
  public name: string;
  public components: GameComponent[];
  public transform: TransformComponent | null;
  public threeJSScene: THREE.Scene | null;

  constructor(name: string) {
    this.instantiated = false;
    this.name = name;
    this.components = [];
    this.transform = null;
    this.threeJSScene = null;
    this.scene = null;
  }

  awake() {
    this.transform = this.findComponent(
      "TransformComponent"
    ) as TransformComponent | null;

    if (!this.transform) console.error("No transform found on : " + this.name);

    this.components.forEach((c) => {
      c?.awake();
    });
  }

  findComponent(name: string) {
    for (let i = 0; i < this.components.length; i++) {
      if (this.components[i].name === name) return this.components[i];
    }

    return null;
  }

  attachComponent(component: GameComponent) {
    this.components.push(component);
    if (this.instantiated) component?.awake();
  }

  update(dt: number) {
    this.components.forEach((c) => {
      c?.update(dt);
    });
  }
}
