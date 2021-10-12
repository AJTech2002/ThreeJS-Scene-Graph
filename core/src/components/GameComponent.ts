import GameObject from "./GameObject";
import Input from "./Input";
import TransformComponent from "./TransformComponent";

export default class GameComponent {
  public name: string;
  public gameObject: GameObject;
  public props: any;
  public input: Input | undefined = undefined;
  public transform: TransformComponent | null = null;

  constructor(name: string, gameObject: GameObject, componentProps: any) {
    this.name = name;
    this.gameObject = gameObject;
    this.props = componentProps;
  }

  awake() {}

  update(dt?: number) {}

  onKeyDown(key: string) {}

  onKeyUp(key: string) {}

  // We can use this loop in the editor to match props to props
  executeOnEditorUpdate() {}
}
