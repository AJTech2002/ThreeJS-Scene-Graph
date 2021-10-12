import {
  DefaultComponents,
  GameComponent,
  GameObject,
  parseType,
  returnDefaultValue,
  returnValidatedProperty,
} from "@razor/core";
import { getData, projectRoot } from "../server-utilities/serverHandler";
import EditorScene from "./EditorScene";

//Given a component name, return the JSON of that component from the server

function returnComponentJSON(componentName: string): Promise<any> {
  //found JSON
  return getData(
    "componentJSON",
    `?root=${projectRoot}&component=${componentName}`
  ).then((d: string): any => {
    try {
      let json = JSON.parse(d);
      return json;
    } catch (e: any) {
      return {};
    }
  });
}

//Get the current properties of the component (to save after being changed)

function getComponentProperties(comp: GameComponent, parsedComponents: any) {
  let template: any = {
    name: comp.name,
    props: [],
  };

  let objComp = parsedComponents[comp.name];
  for (const [k, v] of Object.entries(objComp)) {
    template.props.push(k as string);
    if (k in comp) template[k] = parseType((v as any).type, (comp as any)[k]);
    else if (k in comp.props)
      template[k] = parseType((v as any).type, (comp.props as any)[k]);
  }

  return template;
}

// Save all the values of the components on every game object back into Scene.json

export function serialize(this: EditorScene): string {
  let sceneJSON: any = {
    gameObjects: [],
  };

  this.gameObjects.forEach((go) => {
    let goTemplate: any = {
      name: go.name,
      parent: go.parentName,
      components: [],
    };

    go.components.forEach((comp) => {
      goTemplate.components.push(
        getComponentProperties(comp, this.parsedComponents)
      );
    });

    sceneJSON.gameObjects.push(goTemplate);
  });

  return JSON.stringify(sceneJSON);
}

// Parse all components in the scene.json (queries need to be sent to server)
export function parseComponents(
  parsedComponents: any,
  json: string
): Promise<void>[] {
  const SceneJSON = JSON.parse(json);
  let promises: Promise<void>[] = [];

  const gameObjects = SceneJSON.gameObjects;

  if (!gameObjects) return [];

  // Loop through each of the game objects in the JSON list
  for (const jsonObject of gameObjects) {
    for (const jsonComponent of jsonObject.components) {
      promises.push(
        returnComponentJSON(jsonComponent.name).then((d) => {
          parsedComponents[jsonComponent.name] = d;
        })
      );
    }
  }
  return promises;
}

//Parse the Scene.JSON when loading in
export function parseSerializedJSON(this: EditorScene, json: string) {
  this.parsedComponents = {};
  this.gameObjects = [];
  this.activeCamera = null;

  //Wait for all components to parse
  Promise.all(parseComponents(this.parsedComponents, json)).then(() => {
    const SceneJSON = JSON.parse(json);
    const gameObjects = SceneJSON.gameObjects;

    if (!gameObjects) return;

    // Loop through each of the game objects in the JSON list
    for (const jsonObject of gameObjects) {
      const gameObject = new GameObject(jsonObject.name);
      gameObject.parentName = jsonObject.parent;

      // Attach all the components in the JSON to the game object
      for (const jsonComponent of jsonObject.components) {
        const componentProps: Record<string, any> = {};

        if (jsonComponent.name in this.parsedComponents)
          for (const [k, v] of Object.entries(
            (this.parsedComponents as any)[jsonComponent.name]
          )) {
            const innerCo = jsonComponent as Record<string, any>;
            let foundProp = returnDefaultValue((v as any).type);

            if (k in innerCo) {
              foundProp = returnValidatedProperty(innerCo[k], (v as any).type);
            }

            componentProps[k] = foundProp;
          }

        type ComponentName = keyof typeof DefaultComponents;

        //By default let it be GameComponent, unless it is a DefaultComponent
        let ComponentClass = GameComponent;

        if (jsonComponent.name in DefaultComponents)
          ComponentClass =
            DefaultComponents[jsonComponent.name as ComponentName];

        const component: any = new ComponentClass(
          jsonComponent.name,
          gameObject,
          componentProps //still pass in if needed
        );

        //pre-assign component properties (only validated props)
        for (const [k, v] of Object.entries(componentProps)) {
          if (k in component) component[k] = v;
        }

        gameObject.attachComponent(component);
      }

      this.addGameObject(gameObject);
    }

    //Attach GameObjects to their parents
    for (const gameObject of this.gameObjects) {
      if (gameObject.parentName !== "") {
        const foundParent = this.findGameObject(gameObject.parentName);
        if (foundParent) gameObject.setParent(foundParent);
      }
    }
  });
}
