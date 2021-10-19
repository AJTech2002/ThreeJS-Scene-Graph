import * as THREE from "three";
import { Euler, Vector3 } from "three";
import GameComponent from "./GameComponent";
import GameObject from "./GameObject";
export default class TransformComponent extends GameComponent {
    position: THREE.Vector3;
    private rotation;
    scale: THREE.Vector3;
    quaternion: THREE.Quaternion;
    matrix: THREE.Matrix4 | null;
    constructor(name: string, gameObject: GameObject, componentProps: any);
    updateTransform(): void;
    rotateOnAxis(axis: Vector3, angle: number): void;
    getEulerRotation(): Euler;
    setRotationFromEuler(euler: Euler): void;
    transformVector(vector: Vector3, isDirection: boolean): Vector3;
    getTransformedPosition(): Vector3;
    getTransformedRotation(): Euler;
    getTransformedScale(): Vector3;
    awake(): void;
    update(): void;
}
