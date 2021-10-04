import { Vector3 } from "three";
import GameComponent from "./GameComponent";

export default class MoveObject extends GameComponent {
  public time: number = 0;

  override awake() {
    this.time = 0;
  }

  override update(dt: number) {
    
    if (this.input?.keyIsPressed("A")) console.log("A is being pressed :)");

    let inputVector: Vector3 = new Vector3(
      this.input?.getRawHorizontal(),
      this.input?.getRawVertical(),
      0
    ).multiplyScalar(dt * 10);

    this.gameObject.transform?.position.add(inputVector);
  }
}
