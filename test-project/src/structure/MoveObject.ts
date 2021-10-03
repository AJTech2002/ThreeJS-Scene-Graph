import GameComponent from "./GameComponent";

export default class MoveObject extends GameComponent {
  public time: number = 0;

  override awake() {
    this.time = 0;
  }

  override update(dt: number) {
    this.time += dt;
    if (this.gameObject.transform) {
      this.gameObject.transform.position.x = Math.sin(
        this.time * this.props.speed
      );
      this.gameObject.transform.rotation.x += dt;
    }
  }
}
