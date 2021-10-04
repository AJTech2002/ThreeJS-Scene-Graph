import { Intersection, Vector2, Vector3 } from "three";
import GameComponent from "../structure/GameComponent";
import MeshComponent from "../structure/MeshComponent";

export default class MoveObject extends GameComponent {
  public time: number = 0;

  override awake() {
    this.time = 0;
  }

  override onKeyDown(key: string) {
    if (key === "a") {
      let meshComp: MeshComponent | null =
        this.gameObject.findComponentOfType<MeshComponent>("MeshComponent");

      (meshComp?.mesh?.material as THREE.MeshBasicMaterial).color.setHex(
        0xffffff
      );
    }
  }

  override update(dt: number) {
    if (this.input?.getMouseButton(0)) {
      let mousePosition: Vector2 = this.input.getAdjustedMousePosition();

      const intersects: Intersection[] =
        this.gameObject.scene!.screenRaycast(mousePosition);

      for (let i = 0; i < intersects.length; i++) {
        console.log((intersects[i].object as any).gameObject);
      }
    }
    let inputVector: Vector3 = new Vector3(
      this.input?.getRawHorizontal(),
      this.input?.getRawVertical(),
      0
    ).multiplyScalar(dt * 10);

    this.gameObject.transform?.position.add(inputVector);
  }
}
