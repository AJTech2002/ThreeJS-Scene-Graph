import * as THREE from 'three';
import { Euler, Vector3 } from 'three';
import GameComponent from './GameComponent';

export default class MeshComponent extends GameComponent {

    awake() {
        super.awake();
        if (this.props.primitive) {
            if (this.props.primitiveShape === "Cube") {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshBasicMaterial({ color: 0x964B00 });
                this.mesh = new THREE.Mesh(geometry, material);
                this.gameObject.threeJSScene.add(this.mesh);
            }
        }
    }

    update() {
        super.update();
        if (this.mesh) {

            let outputScale = new Vector3().setFromMatrixScale(this.gameObject.transform.matrix);
            let outputRotation = new Euler().setFromRotationMatrix(this.gameObject.transform.matrix);
            let outputPosition = new Vector3().setFromMatrixPosition(this.gameObject.transform.matrix);

            this.mesh.scale.copy(outputScale);
            this.mesh.rotation.copy(outputRotation);
            this.mesh.position.copy(outputPosition);

            this.mesh.updateMatrixWorld();
        }
    }

}
