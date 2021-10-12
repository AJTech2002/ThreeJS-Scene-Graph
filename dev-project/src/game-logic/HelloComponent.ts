import GameComponent from "../scene-parsed/defaultComponents/GameComponent";
import MeshComponent from "../scene-parsed/defaultComponents/MeshComponent";

export default class HelloComponent extends GameComponent {
  //[prop openText string]
  public openText: string = "Test";

  override awake() {
    console.log(this.openText);
  }

  override onKeyDown(key: string) {}

  override update(dt: number) {}
}
