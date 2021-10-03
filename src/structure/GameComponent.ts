import GameObject from "./GameObject";

export default class GameComponent {
  public name: string;
  public gameObject: GameObject;
  public props: any;

  constructor(name, gameObject, componentProps) {
    this.name = name;
    this.gameObject = gameObject;
    this.props = componentProps;
  }

  awake() {}

  update(dt?) {}
}
