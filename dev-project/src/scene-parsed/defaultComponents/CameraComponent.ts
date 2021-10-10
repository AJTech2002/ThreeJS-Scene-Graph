import GameComponent from "./GameComponent";
import * as THREE from "three";
import { Euler, Vector3 } from "three";

export default class CameraComponent extends GameComponent {
  public camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  override awake() {
    super.awake();
    this!.gameObject!.scene!.activeCamera = this.camera;
    // this!.transform!.position.z += 5;
  }

  override update() {
    super.update();
    this.camera.setRotationFromEuler(
      this.transform?.getTransformedRotation() as Euler
    );

    this.camera.position.copy(
      this.transform?.getTransformedPosition() as Vector3
    );
  }
}
