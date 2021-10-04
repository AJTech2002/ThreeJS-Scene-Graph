import { Vector3 } from "three";
import GameComponent from "./GameComponent";
import MeshComponent from "./MeshComponent";

export default class MoveObject extends GameComponent {
  public time: number = 0;

  override awake() {
    this.time = 0;
  }

  override onKeyDown(key: string) {
    if (key === "a") {
      console.log(
        this.gameObject.findComponentOfType<MeshComponent>("MeshComponent")
          ?.mesh
      );
    }
  }

  override update(dt: number) {
    if (this.input?.getMouseButton(0)) {
      console.log(this.input.mousePosition);
    }
    let inputVector: Vector3 = new Vector3(
      this.input?.getRawHorizontal(),
      this.input?.getRawVertical(),
      0
    ).multiplyScalar(dt * 10);

    this.gameObject.transform?.position.add(inputVector);
  }
}
