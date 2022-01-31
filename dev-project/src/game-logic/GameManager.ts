import { Intersection, Vector3 } from "three";
import GameComponent from "../scene-parsed/defaultComponents/GameComponent";
import GameObject from "../scene-parsed/defaultComponents/GameObject";
import MeshComponent from "../scene-parsed/defaultComponents/MeshComponent";
import RaycastHit from "../scene-parsed/defaultComponents/RaycastHit";
import GroundUnit from "./GroundUnit";

export default class GameManager extends GameComponent {

    public size: number = 30;
    public tiles: GameObject[] = [];
    public tileDictionary: any = {};

    override awake() {
        // setup the grid

        let startPos = this.transform?.position.sub(new Vector3(this.size / 2, 0, this.size / 2));

        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                let tilePos: Vector3 = startPos!.clone().add(new Vector3(x + 0.2 * x, 0, y + 0.2 * y));
                let tile = this.createTile(x, y, tilePos);

                if (y <= 14) {
                    tile.findComponentOfType<MeshComponent>("MeshComponent")!.color = "f0f0f0";
                }

                this.gameObject.scene?.addGameObject(tile);
                this.tiles.push(tile);
                this.tileDictionary[`${x}_${y}`] = tile;
            }
        }

    }

    createTile(x: number, y: number, pos: Vector3) {
        let tileObject: GameObject = GameObject.default("Tile_" + x.toString() + "_" + y.toString(), pos, new Vector3(1, 0.3, 1));

        let meshComponent: MeshComponent = new MeshComponent("MeshComponent", tileObject, {});
        meshComponent.primitive = true;
        meshComponent.primitiveShape = "Cube";

        tileObject.attachComponent(meshComponent);

        return tileObject;
    }

    tileAt(x: number, y: number): GameObject | null {
        if (`${x}_${y}` in this.tileDictionary) {
            return this.tileDictionary[`${x}_${y}`] as GameObject;
        }

        return null;
    }


    override onKeyDown(key: string) {

    }

    private leftMouseClicked: boolean = false;
    private spawnedUnitIndex: number = 0;

    private timer: number = 0;

    public units: GroundUnit[] = [];

    override update(dt: number) {

        this.timer += dt;

        if (this.timer >= 1) {
            this.timer = 0;

            this.units.forEach((u) => {
                u.step();
            });

        }

        let intersects: RaycastHit | null = this.gameObject.scene!.screenRaycastObjects(this.input!.getAdjustedMousePosition(), this.tiles);

        if (intersects !== null) {

            if (!this.leftMouseClicked && this.input?.getMouseButton(0) && this.input.keyIsPressed("z")) {
                this.leftMouseClicked = true;
                const nameSplit: string[] = intersects.gameObject!.name.split('_');
                const xCoord: number = parseInt(nameSplit[1]);
                const yCoord: number = parseInt(nameSplit[2]);

                const unit: GameObject = GroundUnit.create(intersects.gameObject!.transform!.position, this.spawnedUnitIndex, xCoord, yCoord);
                this.spawnedUnitIndex++;
                this.gameObject.scene?.addGameObject(unit);

                const unitC: GroundUnit = unit.findComponentOfType<GroundUnit>("GroundUnit")!;

                this.units.push(unitC);
            }
            else if (this.input?.getMouseButton(0) === false) {
                this.leftMouseClicked = false;
            }


        }

    }

}
