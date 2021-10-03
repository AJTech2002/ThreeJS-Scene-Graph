import * as THREE from "three";
import GameComponent from "./GameComponent";
import GameObject from "./GameObject";

export default class MeshComponent extends GameComponent {
  public mesh: THREE.Mesh | null;

  constructor(name: string, gameObject: GameObject, componentProps: any) {
    super(name, gameObject, componentProps);
    this.mesh = null;
  }

  override awake() {
    super.awake();
    if (this.props.primitive) {
      if (
        this.props.primitiveShape === "Cube" &&
        this.gameObject.threeJSScene
      ) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x964b00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.gameObject.threeJSScene.add(this.mesh);
      }
    }
  }

  override update() {
    super.update();
    if (this.mesh && this.gameObject.transform?.matrix) {
      const outputScale = new THREE.Vector3().setFromMatrixScale(
        this.gameObject.transform.matrix
      );
      const outputRotation = new THREE.Euler().setFromRotationMatrix(
        this.gameObject.transform.matrix
      );
      const outputPosition = new THREE.Vector3().setFromMatrixPosition(
        this.gameObject.transform.matrix
      );

      this.mesh.scale.copy(outputScale);
      this.mesh.rotation.copy(outputRotation);
      this.mesh.position.copy(outputPosition);

      this.mesh.updateMatrixWorld();
    }
  }
}
