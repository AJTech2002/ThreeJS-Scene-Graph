import { Vector2 } from "three";
import Scene from "./Scene";
declare enum MouseButtons {
    Left = 1,
    Middle = 2,
    Right = 4,
    None = 8
}
export default class Input {
    inputMappings: any;
    scene: Scene | null;
    mousePosition: Vector2;
    mouseButtons: MouseButtons;
    constructor(scene: Scene);
    mapMouse(inputMouseButton: number): number;
    setup(): void;
    getMouseButton(mouseButton: number): boolean;
    getAdjustedMousePosition(): Vector2;
    getRawHorizontal(): number;
    getRawVertical(): number;
    keyIsPressed(key: string): boolean;
}
export {};
