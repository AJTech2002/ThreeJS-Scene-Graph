import { defaultOptions, parse } from "acorn";
import { Vector3 } from "three";
import GameComponent from "../scene-parsed/defaultComponents/GameComponent";
import GameObject from "../scene-parsed/defaultComponents/GameObject";
import MeshComponent from "../scene-parsed/defaultComponents/MeshComponent";
import ControllableComponent from "./ControllableComponent";
import GameManager from "./GameManager";

export default class Unit extends ControllableComponent {

    public currentX: number = 0;
    public currentY: number = 0;

    public health: number = 100;

    public totalUnitStamina: number = 100;
    public currentStamina: number;

    public code: string = "";
    public awakeCode: string = "";

    protected parsed: any = {};

    constructor(name: string, gameObject: GameObject, componentProps: any) {
        super(name, gameObject, componentProps);
        this.currentStamina = this.totalUnitStamina;
    }

    protected gameManager: GameManager | null = null;

    public static create(origin: Vector3, index: number, xCoord: number, yCoord: number, type: string, code: string, awakeCode: string): GameObject {
        return new GameObject("NONE");
    }

    generalSetup() {
        this.death = this.death.bind(this);
        this.step = this.step.bind(this);
        this.memoryStore.registerFunction("death");
        this.memoryStore.registerVariable("currentX", true);
        this.memoryStore.registerVariable("currentY", true);
        this.memoryStore.registerVariable("currentStamina", true);
        this.memoryStore.registerVariable("totalStamina", true);

        this.memoryStore.registerVariable("health", true);
    }

    runAwakeCode() {
        this.parsed = parse(this.code, defaultOptions);

        this.gameManager = this.gameObject.scene!.findGameObject("GameManager")!.findComponentOfType<GameManager>("GameManager")!;
        this.gameManager!.tileComponentAt(this.currentX, this.currentY)!.occupied = true;

        let awakeParsed = parse(this.awakeCode, defaultOptions);

        if (this.visitor)
            this.visitor.visitNode(awakeParsed);
    }


    override awake() {
        this.generalSetup();

        super.awake();

        this.runAwakeCode();
    }


    step() {

        if (this.health <= 0) this.death();

        this.currentStamina = this.totalUnitStamina;

        if (this.visitor)
            this.visitor.visitNode(this.parsed);


    }

    death() {
        this.gameManager!.tileComponentAt(this.currentX, this.currentY)!.occupied = false;
        this.gameObject.scene?.destroy(this.gameObject);
        this.gameManager?.death(this);
    }

}
