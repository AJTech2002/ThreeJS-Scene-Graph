import GameComponent from "./GameComponent";
import * as THREE from "three";
export default class CameraComponent extends GameComponent {
    camera: THREE.PerspectiveCamera;
    awake(): void;
    update(): void;
}
