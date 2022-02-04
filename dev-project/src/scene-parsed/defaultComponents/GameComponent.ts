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

  setProps(props: any) {
    for (const [key, value] of Object.entries(props)) {
      if (key in this) {
        let a: any = this;
        a[key] = props[key];
        console.log("Found : " + a[key]);
      }
    }
  }

  awake() { }

  update(dt?: number) { }

  onKeyDown(key: string) { }

  onKeyUp(key: string) { }

  destroy() {
    console.warn(`Destroy for ${this.name} has not been implemented`);
  }

  // We can use this loop in the editor to match props to props
  executeOnEditorUpdate() { }
}
