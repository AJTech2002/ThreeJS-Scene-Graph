import GameComponent from "./GameComponent";

export default class MoveObject extends GameComponent {
  public time: any;

  awake() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
    this.gameObject.transform.position.x = Math.sin(
      this.time * this.props.speed
    );
    this.gameObject.transform.rotation.x += dt;
  }
}
