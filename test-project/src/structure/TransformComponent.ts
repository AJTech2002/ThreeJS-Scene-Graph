import * as THREE from "three";
import GameComponent from "./GameComponent";
import GameObject from "./GameObject";

export default class TransformComponent extends GameComponent {
  public position: THREE.Vector3;
  public rotation: THREE.Euler;
  public scale: THREE.Vector3;
  public matrix: THREE.Matrix4 | null;

  constructor(name: string, gameObject: GameObject, componentProps: any) {
    super(name, gameObject, componentProps);

    this.position = this.props.position;
    this.rotation = this.props.rotation;
    this.scale = this.props.scale;

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

  override update() {
    this.updateTransform();

    if (this.matrix && this.gameObject.parent?.transform?.matrix) {
      this.matrix.copy(
        this.matrix.premultiply(this.gameObject.parent.transform.matrix)
      );
    }
  }
}
