import GameComponent from "./GameComponent";
import TransformComponent from "./TransformComponent";

export default class GameObject {
  public instantiated: boolean;
  public name: string;
  public components: GameComponent[];
  public transform: TransformComponent | null;
  public threeJSScene: THREE.Scene | null;

  constructor(name) {
    this.instantiated = false;
    this.name = name;
    this.components = [];
    this.transform = null;
    this.threeJSScene = null;
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

  findComponent(name) {
    for (let i = 0; i < this.components.length; i++) {
      if (this.components[i].name === name) return this.components[i];
    }

    return null;
  }

  attachComponent(component) {
    this.components.push(component);
    if (this.instantiated) component?.awake();
  }

  update(dt) {
    this.components.forEach((c) => {
      c?.update(dt);
    });
  }
}
