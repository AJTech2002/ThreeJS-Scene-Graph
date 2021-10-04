import GameObject from "./GameObject";
import Input from "./Input";

export default class GameComponent {
  public name: string;
  public gameObject: GameObject;
  public props: any;
  public input: Input | undefined = undefined;

  constructor(name: string, gameObject: GameObject, componentProps: any) {
    this.name = name;
    this.gameObject = gameObject;
    this.props = componentProps;
  }

  awake() {}

  update(dt?: number) {}

  onKeyDown(key: string) {}

  onKeyUp(key: string) {}
}
