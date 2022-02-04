import MemoryStore from "../interpreter/ReferenceMemoryStore";
import GameComponent from "../scene-parsed/defaultComponents/GameComponent";
import GameObject from "../scene-parsed/defaultComponents/GameObject";

export default class ControllableComponent extends GameComponent {

    public memoryStore: MemoryStore;

    constructor(name: string, gameObject: GameObject, componentProps: any) {
        super(name, gameObject, componentProps);
        this.memoryStore = new MemoryStore();
        this.memoryStore.registerThis(this);
    }

    override awake() {

    }

    override update(dt: number) {

    }

}
