import { Intersection, Vector2, Vector3 } from "three";
import GameComponent from "../scene-parsed/defaultComponents/GameComponent";
import MeshComponent from "../scene-parsed/defaultComponents/MeshComponent";
import GameObject from "../scene-parsed/defaultComponents/GameObject";

export default class MoveObject extends GameComponent {
  public time: number = 0;

  //[prop speed float]
  public speed: number = 0;

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

    if (key === "shift") this.speed *= 2;
  }

  override onKeyUp(key: string) {
    if (key === "shift") this.speed /= 2;
  }

  override update(dt: number) {
    if (this.input?.getMouseButton(0)) {
      let mousePosition: Vector2 = this.input.getAdjustedMousePosition();

      const intersects: Intersection[] =
        this.gameObject.scene!.screenRaycast(mousePosition);

      for (let i = 0; i < intersects.length; i++) {
        let foundGameObject: GameObject = (intersects[i].object as any)
          .gameObject;
        let foundMeshComponent =
          foundGameObject.findComponentOfType<MeshComponent>("MeshComponent");
        (
          foundMeshComponent?.mesh?.material as THREE.MeshBasicMaterial
        ).color.setHex(0xffffff);
      }
    }

    let inputVector: Vector3 = new Vector3(
      0,
      0,
      -1 * this.input!.getRawVertical()
    ).multiplyScalar(dt * 10 * this.speed);

    inputVector = this.transform?.transformVector(
      inputVector.clone(),
      true
    ) as Vector3;

    this.gameObject.transform!.rotateOnAxis(
      new Vector3(0, 1, 0),
      -this.input!.getRawHorizontal() * dt * 10 * this.speed
    );
    this.gameObject.transform?.position.add(inputVector);
  }
}
