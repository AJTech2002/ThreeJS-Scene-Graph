import { Intersection, Vector2, Vector3 } from "three";
import GameComponent from "../scene-parsed/defaultComponents/GameComponent";
import MeshComponent from "../scene-parsed/defaultComponents/MeshComponent";

export default class ColorChanger extends GameComponent {
  public time: number = 0;

  //[prop rgb dict]
  public rgb: any = {
    r: 0,
    g: 0,
    b: 0,
  };

  //[prop increment float]
  public increment: number = 0;

  public meshComp: MeshComponent | null = null;

  override awake() {
    this.time = 0;
    this.meshComp =
      this.gameObject.findComponentOfType<MeshComponent>("MeshComponent");
  }

  override onKeyDown(key: string) {
    if (key === "r") {
      this.rgb.r += this.increment;
    }
    if (key === "g") {
      this.rgb.g += this.increment;
    }
    if (key === "b") {
      this.rgb.b += this.increment;
    }
  }

  override update(dt: number) {
    (this.meshComp?.mesh?.material as THREE.MeshBasicMaterial).color.setRGB(
      this.rgb.r,
      this.rgb.g,
      this.rgb.b
    );
  }
}
