import { Vector3 } from "three";
import GameComponent from "../scene-parsed/defaultComponents/GameComponent";
import GameObject from "../scene-parsed/defaultComponents/GameObject";
import MeshComponent from "../scene-parsed/defaultComponents/MeshComponent";
import GameManager from "./GameManager";

export default class GroundUnit extends GameComponent {

    public currentX: number = 0;
    public currentY: number = 0;
    private gameManager: GameManager | null = null;

    public static create(origin: Vector3, index: number, xCoord: number, yCoord: number): GameObject {
        // TODO: Use JSON Prefab Definitions
        const temp: GameObject = GameObject.default("GroundUnit-" + index.toString(), new Vector3(origin.x, origin.y + 1, origin.z), new Vector3(1, 2, 1));
        MeshComponent.attachCube(temp);
        let groundUnit: GroundUnit = new GroundUnit("GroundUnit", temp, {});
        groundUnit.currentX = xCoord;
        groundUnit.currentY = yCoord;
        temp.attachComponent(groundUnit);
        return temp;
    }


    override awake() {
        this.gameManager = this.gameObject.scene!.findGameObject("GameManager")!.findComponentOfType<GameManager>("GameManager")!;
    }


    step() {

        let moveAway = false;

        this.gameManager!.units.forEach((u) => {
            if (u !== this)
                if (u.transform!.position.distanceTo(this.transform!.position) <= 1.5) {
                    moveAway = true;
                }
        });

        if (!moveAway)
            this.move(0, -1);
        else {

            this.move(1 * (Math.random() < 0.5 ? -1 : 1), 0);
        }

    }

    move(h: number, v: number) {
        if (v > 1) v = 1;
        if (h > 1) h = 1;
        if (v < -1) v = -1;
        if (h < -1) h = -1;

        const tile: GameObject | null = this.gameManager!.tileAt(this.currentX + h, this.currentY + v);

        if (tile) {

            this.transform!.position! = new Vector3(tile?.transform?.position.x, tile!.transform!.position.y + 1, tile?.transform?.position.z);
            this.currentX = this.currentX + h;
            this.currentY = this.currentY + v;

        }

    }


    override update(dt: number) {

    }

}
