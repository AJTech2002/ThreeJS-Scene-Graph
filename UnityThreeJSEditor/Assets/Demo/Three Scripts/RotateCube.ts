// Your TypeScript code here
import { GameComponent, MeshComponent, GameObject } from "./@types/@razor/core";
import { Vector3, Vector2, Quaternion, Intersection } from "./@types/three";

export default class RotateCube extends GameComponent {
    public time: number = 0;

    //[prop speed float]
    public speed: number = 0;

    //[prop rotationSpeed float]
    public rotationSpeed: number = 0;

    //[prop offset vec3]
    public offset: Vector3 = new Vector3(0, 1, 0);

    override awake() {
        this.time = 0;
    }

    override onKeyDown(key: string) {
        if (key === "a") {
            this.transform?.position.add(this.offset);
        }

        if (key === "shift") this.speed *= 2;
    }

    override onKeyUp(key: string) {
        if (key === "shift") this.speed /= 2;
    }

    override update(dt: number) {
        if (this.input?.getMouseButton(0)) {
            let mousePosition: Vector2 = this.input.getAdjustedMousePosition();

            const intersects: Intersection[] =
                this.gameObject.scene!.screenRaycast(mousePosition);

            for (let i = 0; i < intersects.length; i++) {
                let foundGameObject: GameObject = (intersects[i].object as any)
                    .gameObject;
                let foundMeshComponent =
                    foundGameObject.findComponentOfType<MeshComponent>("MeshComponent");
                (
                    foundMeshComponent?.mesh?.material as THREE.MeshBasicMaterial
                ).color.setHex(0xffffff);
            }

        }

        let inputVector: Vector3 = new Vector3(
            0,
            0,
            -1 * this.input!.getRawVertical()
        ).multiplyScalar(dt * 10 * this.speed);

        inputVector = this.transform?.transformVector(
            inputVector.clone(),
            true
        ) as Vector3;

        this.gameObject.transform!.rotateOnAxis(
            new Vector3(0, 1, 0),
            this.rotationSpeed * dt
        );
    }
}