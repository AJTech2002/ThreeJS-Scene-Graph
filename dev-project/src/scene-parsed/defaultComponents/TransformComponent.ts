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

  vec4ToVec3(vec4: Vector4) {
    return new Vector3(vec4.x, vec4.y, vec4.z);
  }

  lookAt(x: number, y: number, z: number) {

    let _m1: Matrix4 = new Matrix4();
    let _q1: Quaternion = new Quaternion();

    _m1.lookAt(this.position.clone(), new Vector3(x, y, z), this.vec4ToVec3(this.localToWorld(new Vector3(0, 1, 0))));

    this.quaternion.setFromRotationMatrix(_m1);

    if (this.gameObject.parent) {

      _m1.extractRotation(this.gameObject.parent!.transform!.matrix!);
      _q1.setFromRotationMatrix(_m1);
      this.quaternion = this.quaternion.premultiply(_q1.invert());
    }


    this.updateTransform();
  }


  localToWorld = (vec: Vector3): Vector4 => {
    let vector = new THREE.Vector4(vec.x, vec.y, vec.z, 0);
    return vector.applyMatrix4(this.matrix!);
  }

  worldToLocal = (vec: Vector3): Vector4 => {
    let vector = new THREE.Vector4(vec.x, vec.y, vec.z, 0);
    const _m1 = new THREE.Matrix4();
    return vector.applyMatrix4(this.matrix!.clone().invert());
  }

  rotateOnWorldAxis(axis: Vector3, angle: number) {

    let _q1: Quaternion = new Quaternion();
    _q1.setFromAxisAngle(axis, angle);
    this.quaternion = this.quaternion.premultiply(_q1);
  }

  rotateAround = (pivot: Vector3, axis: Vector3, theta: number) => {

    let invDir = this.transform!.position.clone().sub(pivot.clone());

    let dirVec: any = this.worldToLocal(invDir.clone());

    this.position.copy(pivot.clone());

    this.updateTransform();

    this.rotateOnWorldAxis(axis, theta);

    this.updateTransform();

    let moveDir: Vector4 = this.localToWorld(dirVec.clone());

    this.position = (pivot.clone().add(new THREE.Vector3(moveDir.x, moveDir.y, moveDir.z)));

    this.updateTransform();
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
    this.rotation.setFromQuaternion(this.quaternion);
    if (this.matrix && this.gameObject.parent?.transform?.matrix) {
      this.matrix.copy(
        this.matrix.premultiply(this.gameObject.parent.transform.matrix)
      );
    }
  }
}
