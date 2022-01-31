import GameComponent from "./GameComponent";
import * as THREE from "three";
import { DirectionalLight, Euler, Object3D, Vector3 } from "three";

export default class Light extends GameComponent {

    public threeLight: Object3D | null = null;
    public lightType: String = "Directional";

    override awake() {
        super.awake();

        if (this.lightType === "Directional")
            this.threeLight = new THREE.DirectionalLight(0xffffff, 0.8);
        else if (this.lightType === "Ambient")
            this.threeLight = new THREE.AmbientLight(0x404040);

        if (this.threeLight)
            this.gameObject.scene?.scene.add(this.threeLight);

        this.transform?.lookAt(0, 0, 0);
    }

    override update() {
        super.update();

        if (this.threeLight) {
            this.threeLight.setRotationFromQuaternion(
                this.transform?.quaternion!
            );

            this.threeLight.position.copy(
                this.transform?.getTransformedPosition() as Vector3
            );
        }
    }
}
