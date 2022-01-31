import { Intersection, Vector2, Vector3, Vector4 } from "three";
import GameComponent from "../scene-parsed/defaultComponents/GameComponent";
import MeshComponent from "../scene-parsed/defaultComponents/MeshComponent";

export default class FreeFlyCamera extends GameComponent {

    public speed: number = 2;
    private leftMouseIsDown: boolean = false;
    private startMouseDrag: Vector2 = new Vector2(0, 0);
    private endMouseDrag: Vector2 = new Vector2(0, 0);
    private tempOrbitPoint: Vector3 = new Vector3(0, 0, 0);

    override awake() {

    }

    override onKeyDown(key: string) {

    }



    override update(dt: number) {


        let inputVector: Vector3 = new Vector3(
            this.input!.getRawHorizontal(),
            (this.input?.keyIsPressed("E")) ? 1 : ((this.input?.keyIsPressed("Q")) ? -1 : 0),
            -1 * this.input!.getRawVertical()
        ).multiplyScalar(dt * 10 * this.speed);

        if (!this.leftMouseIsDown && this.input?.getMouseButton(0)) {
            let mousePosition: Vector2 = this.input!.getAdjustedMousePosition();

            const intersects: Intersection[] =
                this.gameObject.scene!.screenRaycast(mousePosition);

            if (intersects.length > 0) {
                this.tempOrbitPoint = intersects[0].point;

                if (this.gameObject.scene?.findGameObject("Indicator")) {
                    this.gameObject.scene!.findGameObject("Indicator")!.transform!.position = this.tempOrbitPoint;
                    this.gameObject.scene!.findGameObject("Indicator")!.findComponentOfType<MeshComponent>("MeshComponent")?.setVisibility(true);
                }

                this.leftMouseIsDown = true;
                this.startMouseDrag = this.input.getAdjustedMousePosition();
            }
        }

        if (this.input?.getMouseButton(0) === false) {
            this.leftMouseIsDown = false;
            if (this.gameObject.scene?.findGameObject("Indicator")) {
                this.gameObject.scene!.findGameObject("Indicator")!.findComponentOfType<MeshComponent>("MeshComponent")?.setVisibility(false);
            }
        }

        if (this.leftMouseIsDown) {


            this.endMouseDrag = this.input!.getAdjustedMousePosition();

            const rotatedelta: Vector2 = new Vector2(0, 0);
            rotatedelta.subVectors(this.endMouseDrag, this.startMouseDrag).multiplyScalar(1);

            let up = new Vector3(0, 1, 0);
            let right = new Vector3(1, 0, 0);

            let vec4Right: Vector4 = this.transform!.localToWorld(right.clone()).normalize();

            right = new Vector3(vec4Right.x, vec4Right.y, vec4Right.z);



            this.transform!.rotateAround(this.tempOrbitPoint, right, rotatedelta.y * 5);
            this.transform!.rotateAround(this.tempOrbitPoint, up, - rotatedelta.x * 5);

            this.startMouseDrag.copy(this.endMouseDrag);

        }

        inputVector = this.transform?.transformVector(
            inputVector.clone(),
            true
        ) as Vector3;

        // this.gameObject.transform!.rotateOnAxis(
        //     new Vector3(0, 1, 0),
        //     -this.input!.getRawHorizontal() * dt * this.speed
        // );
        this.gameObject.transform?.position.add(inputVector);

        this.transform?.updateTransform();
    }

}
