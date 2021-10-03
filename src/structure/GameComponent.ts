export default class GameComponent {
  public name: any;
  public gameObject: any;
  public props: any;

  constructor(name, gameObject, componentProps) {
    this.name = name;
    this.gameObject = gameObject;
    this.props = componentProps;
  }

  awake() {}

  update(dt?) {}
}
