import { GameObject } from "@razor/core";
import Scene from "./EditorScene";
import * as dat from "dat.gui";

export default class Editor {
  public selectedGameObject: GameObject | null = null;
  public scene: Scene;
  public gui: dat.GUI = new dat.GUI();

  constructor(scene: Scene) {
    this.scene = scene;
  }

  editorLoop() {
    let mousePosition = this.scene.inputSystem.getAdjustedMousePosition();
    let pressed = this.scene.inputSystem.getMouseButton(0);

    if (pressed) {
      let intersections = this.scene.screenRaycast(mousePosition);
      if (intersections.length > 0) {
        let foundGO = (intersections[0].object as any).gameObject as GameObject;
        if (foundGO !== this.selectedGameObject) {
          this.selectedGameObject = foundGO;
          this.setupEditorGUI();
          console.log("Inspecting " + this.selectedGameObject.name);
        }
      }
    }
  }

  addComponentPropToFolder(
    folder: any,
    comp: any,
    propName: string,
    type: string
  ) {
    if (type === "string" || type === "float") {
      folder.add(comp, propName);
    } else if (type === "vec3" || type === "eul3") {
      let vecFolder = folder.addFolder(propName);
      vecFolder.add(comp[propName], "x", -100, 100);
      vecFolder.add(comp[propName], "y", -100, 100);
      vecFolder.add(comp[propName], "z", -100, 100);
    }
  }

  setupEditorGUI() {
    if (this.selectedGameObject) {
      this.gui = new dat.GUI();

      this.gui.add(this.selectedGameObject, "name");
      this.gui.add(this.selectedGameObject, "parentName");

      let compFolder = this.gui.addFolder("Component");

      this.selectedGameObject.components.forEach((comp) => {
        if (comp) {
          let currentCompFolder = compFolder.addFolder(comp.name);
          let objComp = this.scene.parsedComponents[comp.name];

          for (const [k, v] of Object.entries(objComp)) {
            if (k in comp && (comp as any)[k] !== null) {
              this.addComponentPropToFolder(
                currentCompFolder,
                comp,
                k,
                (v as any).type
              );
            } else if (k in comp.props) {
              this.addComponentPropToFolder(
                currentCompFolder,
                comp.props,
                k,
                (v as any).type
              );
            }
          }
        }
      });

      compFolder.show();
      this.gui.show();
      this.gui.updateDisplay();
    }
  }
}
