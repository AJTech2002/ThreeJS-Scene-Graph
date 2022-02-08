import MemoryStore from "../interpreter/ReferenceMemoryStore";
import Visitor from "../interpreter/Visitor";
import GameComponent from "../scene-parsed/defaultComponents/GameComponent";
import GameObject from "../scene-parsed/defaultComponents/GameObject";

export default class ControllableComponent extends GameComponent {

    public memoryStore: MemoryStore;
    public visitor: Visitor | null = null;

    constructor(name: string, gameObject: GameObject, componentProps: any) {
        super(name, gameObject, componentProps);
        this.memoryStore = new MemoryStore();
        this.memoryStore.registerThis(this);
    }

    override awake() {
        this.visitor = new Visitor(this.memoryStore);
    }

    override update(dt: number) {

    }

}
