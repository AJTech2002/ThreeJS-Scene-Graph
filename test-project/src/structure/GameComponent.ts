import GameObject from "./GameObject";

export default class GameComponent {
  public name: string;
  public gameObject: GameObject;
  public props: any;

  constructor(name: string, gameObject: GameObject, componentProps: any) {
    this.name = name;
    this.gameObject = gameObject;
    this.props = componentProps;
  }

  awake() {}

  update(dt?: number) {}
}
