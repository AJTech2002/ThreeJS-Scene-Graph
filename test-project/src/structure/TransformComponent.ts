import { Euler, Vector3 } from "three";
import GameComponent from "./GameComponent";
import GameObject from "./GameObject";

export default class TransformComponent extends GameComponent {
  public position: Vector3;
  public rotation: Euler;
  public scale: Vector3;

  constructor(name: string, gameObject: GameObject, componentProps: any) {
    super(name, gameObject, componentProps);

    this.position = this.props.position;
    this.rotation = this.props.rotation;
    this.scale = this.props.scale;
  }
}
