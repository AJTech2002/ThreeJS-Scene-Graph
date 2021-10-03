export default class GameObject {
  public instantiated: any;
  public name: any;
  public components: any;
  public transform: any;

  constructor(name) {
    this.instantiated = false;
    this.name = name;
    this.components = [];
  }

  awake() {
    this.transform = this.findComponent("TransformComponent");

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
