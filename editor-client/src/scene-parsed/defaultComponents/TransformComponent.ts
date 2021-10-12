import * as THREE from "three";
import { Euler, Matrix4, Quaternion, Vector3, Vector4 } from "three";
import GameComponent from "./GameComponent";
import GameObject from "./GameObject";

export default class TransformComponent extends GameComponent {
  //[prop position vec3]
  public position: THREE.Vector3 = new Vector3(0, 0, 0);
  //[prop rotation eul3]
  private rotation: THREE.Euler = new Euler(0, 0, 0);
  //[prop scale vec3]
  public scale: THREE.Vector3 = new Vector3(1, 1, 1);

  public quaternion: THREE.Quaternion = new Quaternion();

  public matrix: THREE.Matrix4 | null;

  constructor(name: string, gameObject: GameObject, componentProps: any) {
    super(name, gameObject, componentProps);

    this.matrix = null;

    this.updateTransform();
  }

  updateTransform() {
    this.matrix = new THREE.Matrix4();
    let quat = this.quaternion;
    this.matrix.compose(
      this.position.clone(),
      quat.clone(),
      this.scale.clone()
    );
  }

  rotateOnAxis(axis: Vector3, angle: number) {
    let newQuat = new THREE.Quaternion()
      .setFromAxisAngle(axis.normalize(), angle)
      .normalize();
    this.quaternion = this.quaternion.multiply(newQuat).normalize();
  }

  getEulerRotation(): Euler {
    return this.rotation;
  }

  setRotationFromEuler(euler: Euler) {
    this.quaternion.setFromEuler(euler.clone());
  }

  transformVector(vector: Vector3, isDirection: boolean): Vector3 {
    const vec4: Vector4 = new Vector4(
      vector.x,
      vector.y,
      vector.z,
      isDirection ? 0 : 1
    );
    vec4.applyMatrix4(this.matrix as Matrix4);
    return new Vector3(vec4.x, vec4.y, vec4.z);
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

  override awake() {
    this.quaternion.setFromEuler(this.rotation).normalize();
  }

  override update() {
    this.updateTransform();
    //this.rotation.setFromQuaternion(this.quaternion);
    this.quaternion.setFromEuler(this.rotation); //TODO: For editor purposes
    if (this.matrix && this.gameObject.parent?.transform?.matrix) {
      this.matrix.copy(
        this.matrix.premultiply(this.gameObject.parent.transform.matrix)
      );
    }
  }
}
