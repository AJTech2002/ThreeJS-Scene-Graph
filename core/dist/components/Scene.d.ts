import * as THREE from "three";
import GameObject from "./GameObject";
import Input from "./Input";
import { Vector2 } from "three";
export default class Scene {
    scene: THREE.Scene;
    isEditor: boolean;
    activeCamera: THREE.PerspectiveCamera | null;
    renderer: THREE.Renderer;
    clock: THREE.Clock;
    gameObjects: GameObject[];
    externalUpdate: null | ((delta?: number) => void);
    inputSystem: Input;
    protected raycaster: THREE.Raycaster | null;
    constructor();
    onWindowResize(): void;
    setup(domElement: HTMLElement, externalUpdate: Scene["externalUpdate"]): void;
    inputEvent(type: number, key: string): void;
    screenRaycast(screenPosition: Vector2): THREE.Intersection[];
    addGameObject(gameObject: GameObject): void;
    findGameObject(name: string): GameObject | null;
    parseScene(componentDeclarations: any, sceneJSON: string): void;
    render(): void;
}
