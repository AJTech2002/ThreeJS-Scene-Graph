import GameComponent from "./GameComponent";

export default class TransformComponent extends GameComponent {
  public position: any;
  public rotation: any;
  public scale: any;

  constructor(name, gameObject, componentProps) {
    super(name, gameObject, componentProps);

    this.position = this.props.position;
    this.rotation = this.props.rotation;
    this.scale = this.props.scale;
  }
}
