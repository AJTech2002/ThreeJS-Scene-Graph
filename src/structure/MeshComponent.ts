import * as THREE from "three";
import GameComponent from "./GameComponent";

export default class MeshComponent extends GameComponent {
  public mesh: any;

  awake() {
    super.awake();
    if (this.props.primitive) {
      if (this.props.primitiveShape === "Cube") {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x964b00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.gameObject.threeJSScene.add(this.mesh);
      }
    }
  }

  update() {
    super.update();
    if (this.mesh) {
      this.mesh.position.copy(this.gameObject.transform.position);
      this.mesh.rotation.copy(this.gameObject.transform.rotation);
      this.mesh.scale.copy(this.gameObject.transform.scale);
      this.mesh.updateMatrixWorld();
    }
  }
}
