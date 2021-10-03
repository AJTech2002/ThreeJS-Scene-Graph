import { Euler, Vector3 } from "three";
import GameComponent from "./GameComponent";

export default class TransformComponent extends GameComponent {
  public position: Vector3;
  public rotation: Euler;
  public scale: Vector3;

  constructor(name, gameObject, componentProps) {
    super(name, gameObject, componentProps);

    this.position = this.props.position;
    this.rotation = this.props.rotation;
    this.scale = this.props.scale;
  }
}
