import { Vector2 } from "three";
import Scene from "./Scene";

enum MouseButtons {
  Left = 1,
  Middle = 2,
  Right = 4,
  None = 8,
}

export default class Input {
  public inputMappings: any;
  public scene: Scene | null;
  public mousePosition: Vector2;
  public mouseButtons: MouseButtons = MouseButtons.None;

  constructor(scene: Scene) {
    this.inputMappings = {};
    this.scene = scene;
    this.keyIsPressed = this.keyIsPressed.bind(this);
    this.mousePosition = new Vector2(0, 0);
  }

  mapMouse(inputMouseButton: number): number {
    return Math.pow(2, inputMouseButton);
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

    document.addEventListener("mousemove", (e) => {
      this.mousePosition = new Vector2(e.clientX, e.clientY);
    });

    document.addEventListener("mousedown", (e) => {
      this.mouseButtons |= this.mapMouse(e.button);
    });

    document.addEventListener("mouseup", (e) => {
      this.mouseButtons &= ~this.mapMouse(e.button);
    });

    window.addEventListener("blur", (e) => {
      this.inputMappings = {};
    });
  }

  getMouseButton(mouseButton: number): boolean {
    if (this.mouseButtons & this.mapMouse(mouseButton)) return true;
    return false;
  }

  getAdjustedMousePosition(): Vector2 {
    let mouse = new Vector2();
    mouse.x = (this!.mousePosition.x / window.innerWidth) * 2 - 1;
    mouse.y = -(this!.mousePosition.y / window.innerHeight) * 2 + 1;
    return mouse;
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
