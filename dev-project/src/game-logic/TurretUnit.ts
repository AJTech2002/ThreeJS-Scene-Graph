import { defaultOptions, parse } from "acorn";
import { Vector3 } from "three";
import GameComponent from "../scene-parsed/defaultComponents/GameComponent";
import GameObject from "../scene-parsed/defaultComponents/GameObject";
import MeshComponent from "../scene-parsed/defaultComponents/MeshComponent";
import ControllableComponent from "./ControllableComponent";
import GameManager from "./GameManager";
import Unit from "./Unit";

export default class TurretUnit extends Unit {

    public static override create(origin: Vector3, index: number, xCoord: number, yCoord: number, type: string, code: string, awakeCode: string): GameObject {
        // TODO: Use JSON Prefab Definitions
        const temp: GameObject = GameObject.default("TurretUnit-" + index.toString(), new Vector3(origin.x, origin.y + 0.5, origin.z), new Vector3(1, 1, 1));
        MeshComponent.attachCube(temp, "eb4034");
        let groundUnit: TurretUnit = new TurretUnit("TurretUnit", temp, {});
        groundUnit.currentX = xCoord;
        groundUnit.currentY = yCoord;
        groundUnit.code = code;
        groundUnit.awakeCode = awakeCode;
        temp.attachComponent(groundUnit);
        return temp;
    }

    override awake() {
        this.shoot = this.shoot.bind(this);
        this.memoryStore.registerFunction("shoot");

        super.awake();
    }

    override step() {
        super.step();

    }

    private projectiles: GameObject[] = [];
    private directions: Vector3[] = [];

    /// Shoot in a specified direction
    shoot(h: number, v: number) {
        if (this.currentStamina < 100) return;

        this.currentStamina -= 100;

        const dir = new Vector3(h, 0, v);
        dir.clampLength(0, 1);

        const temp: GameObject = GameObject.default("Projectile-" + this.projectiles.length, new Vector3(this.transform!.position.x, this.transform!.position.y + 0.5, this.transform!.position.z), new Vector3(0.1, 0.1, 0.5));
        MeshComponent.attachCube(temp, "fffff");

        this.gameObject.scene?.addGameObject(temp);

        this.projectiles.push(temp);
        this.directions.push(dir);
    }

    override update(dt: number): void {
        for (let i = 0; i < this.projectiles.length; i++) {
            let dir = this.directions[i].clone().multiplyScalar(7 * dt);

            let point = this.projectiles[i].transform!.position.clone().add(dir);
            this.projectiles[i].transform!.lookAt(point.x, point.y, point.z);
            this.projectiles[i].transform!.position = point.clone();
        }
    }

}
