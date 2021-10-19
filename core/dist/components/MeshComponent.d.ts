import * as THREE from "three";
import GameComponent from "./GameComponent";
import GameObject from "./GameObject";
export default class MeshComponent extends GameComponent {
    mesh: THREE.Mesh | null;
    primitive: boolean | null;
    color: string | null;
    primitiveShape: string | null;
    constructor(name: string, gameObject: GameObject, componentProps: any);
    awake(): void;
    executeOnEditorUpdate(): void;
    update(): void;
}
