import { Vector3 } from "three";
import GameComponent from "../scene-parsed/defaultComponents/GameComponent";
import GameObject from "../scene-parsed/defaultComponents/GameObject";
import MeshComponent from "../scene-parsed/defaultComponents/MeshComponent";
import GameManager from "./GameManager";

export default class TileComponent extends GameComponent {


    public occupied: boolean = false;


}
