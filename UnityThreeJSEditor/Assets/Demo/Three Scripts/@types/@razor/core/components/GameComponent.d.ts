import GameObject from "./GameObject";
import Input from "./Input";
import TransformComponent from "./TransformComponent";
export default class GameComponent {
    name: string;
    gameObject: GameObject;
    props: any;
    input: Input | undefined;
    transform: TransformComponent | null;
    constructor(name: string, gameObject: GameObject, componentProps: any);
    awake(): void;
    update(dt?: number): void;
    onKeyDown(key: string): void;
    onKeyUp(key: string): void;
    executeOnEditorUpdate(): void;
}
