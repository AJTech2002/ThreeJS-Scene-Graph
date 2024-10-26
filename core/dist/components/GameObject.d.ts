import Scene from "./Scene";
import GameComponent from "./GameComponent";
import TransformComponent from "./TransformComponent";
import Input from "./Input";
export default class GameObject {
    scene: Scene | null;
    instantiated: boolean;
    name: string;
    components: GameComponent[];
    transform: TransformComponent | null;
    threeJSScene: THREE.Scene | null;
    parent: GameObject | null;
    parentName: string;
    private lastParentName;
    constructor(name: string);
    awake(): void;
    setParent(gameObject: GameObject): void;
    getInput(): Input | undefined;
    findComponentOfType<T>(componentName: string): T | null;
    inputEvent(type: number, key: string): void;
    findComponent(name: string): GameComponent | null;
    attachComponent(component: GameComponent): void;
    update(dt: number, editor: boolean): void;
}
