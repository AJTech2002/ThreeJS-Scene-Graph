import { GameComponent } from "@razor/core";

export default class HelloComponent extends GameComponent {
  //[prop openText string]
  public openText: string = "Test";

  override awake() {
    console.log(this.openText);
  }

  override onKeyDown(key: string) {}

  override update(dt: number) {}
}
