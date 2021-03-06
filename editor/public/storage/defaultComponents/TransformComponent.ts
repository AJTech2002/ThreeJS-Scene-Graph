import * as THREE from "three";
import { Euler, Vector3 } from "three";
import GameComponent from "./GameComponent";
import GameObject from "./GameObject";

export default class TransformComponent extends GameComponent {
  //[prop position vec3]
  public position: THREE.Vector3 = new Vector3(0, 0, 0);
  //[prop rotation eul3]
  public rotation: THREE.Euler = new Euler(0, 0, 0);
  //[prop scale vec3]
  public scale: THREE.Vector3 = new Vector3(1, 1, 1);
  public matrix: THREE.Matrix4 | null;

  constructor(name: string, gameObject: GameObject, componentProps: any) {
    super(name, gameObject, componentProps);

    this.matrix = null;

    this.updateTransform();
  }

  updateTransform() {
    this.matrix = new THREE.Matrix4();
    let quat = new THREE.Quaternion().setFromEuler(this.rotation.clone());
    this.matrix.compose(
      this.position.clone(),
      quat.clone(),
      this.scale.clone()
    );
  }

  getTransformedPosition(): Vector3 {
    if (!this.matrix) return this.position;
    const outputPosition = new THREE.Vector3().setFromMatrixPosition(
      this.matrix
    );
    return outputPosition;
  }

  getTransformedRotation(): Euler {
    if (!this.matrix) return this.rotation;
    const outputRotation = new THREE.Euler().setFromRotationMatrix(this.matrix);
    return outputRotation;
  }

  getTransformedScale(): Vector3 {
    if (!this.matrix) return this.scale;
    const outputScale = new THREE.Vector3().setFromMatrixPosition(this.matrix);
    return outputScale;
  }

  override update() {
    this.updateTransform();

    if (this.matrix && this.gameObject.parent?.transform?.matrix) {
      this.matrix.copy(
        this.matrix.premultiply(this.gameObject.parent.transform.matrix)
      );
    }
  }
}
