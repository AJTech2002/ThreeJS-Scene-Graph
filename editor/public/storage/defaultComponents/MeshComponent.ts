import * as THREE from "three";
import GameComponent from "./GameComponent";
import GameObject from "./GameObject";

export default class MeshComponent extends GameComponent {
  public mesh: THREE.Mesh | null;

  //[prop primitive boolean]
  public primitive: boolean | null = false;
  //[prop color string]
  public color: string | null = "ffffff";
  //[prop primitiveShape string]
  public primitiveShape: string | null = "None";

  constructor(name: string, gameObject: GameObject, componentProps: any) {
    super(name, gameObject, componentProps);
    this.mesh = null;
  }

  override awake() {
    super.awake();

    if (!this.color) this.color = "ffffff";

    if (this.primitive) {
      if (this.primitiveShape === "Cube" && this.gameObject.threeJSScene) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
          color: parseInt(this.color, 16),
        });
        this.mesh = new THREE.Mesh(geometry, material);

        //Inject GameObject into THREE Mesh to allow access from Raycasts ex.
        let tempMesh = this.mesh as any;
        tempMesh.gameObject = this.gameObject;

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
