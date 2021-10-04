import Scene from "./Scene";

interface Dictionary<T> {
  [Key: string]: T;
}

export default class Input {
  public inputMappings: Dictionary<boolean>;
  public scene: Scene | null;

  constructor(scene: Scene) {
    this.inputMappings = {};
    this.scene = scene;
    this.keyIsPressed = this.keyIsPressed.bind(this);
  }

  setup() {
    document.addEventListener("keydown", (e) => {
      if (!this.keyIsPressed(e.key.toLowerCase()))
        this.scene?.inputEvent(0, e.key.toLowerCase());
      this.inputMappings[e.key.toLowerCase()] = true;
    });

    document.addEventListener("keyup", (e) => {
      if (this.keyIsPressed(e.key.toLowerCase()))
        this.scene?.inputEvent(1, e.key.toLowerCase());
      this.inputMappings[e.key.toLowerCase()] = false;
    });

    window.addEventListener("blur", (e) => {
      this.inputMappings = {};
    });
  }

  getRawHorizontal(): number {
    if (this.keyIsPressed("A")) return -1;
    if (this.keyIsPressed("D")) return 1;
    return 0;
  }

  getRawVertical(): number {
    if (this.keyIsPressed("W")) return 1;
    if (this.keyIsPressed("S")) return -1;
    return 0;
  }

  keyIsPressed(key: string): boolean {
    if (
      key.toLowerCase() in this.inputMappings &&
      this.inputMappings[key.toLowerCase()] === true
    )
      return true;
    return false;
  }
}
