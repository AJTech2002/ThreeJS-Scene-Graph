import './App.css';
import { useEffect, useRef, useState } from 'react';
import Scene from './scene-parsed/defaultComponents/Scene';
import GameObject from './scene-parsed/defaultComponents/GameObject';
import GameManager from './game-logic/GameManager';
import CameraComponent from './scene-parsed/defaultComponents/CameraComponent';
import MeshComponent from './scene-parsed/defaultComponents/MeshComponent';
import TransformComponent from './scene-parsed/defaultComponents/TransformComponent';
import { Color, Vector3 } from 'three';
import FreeFlyCamera from './game-logic/FreeFlyCamera';
import Light from './scene-parsed/defaultComponents/Light';
import VisitorTest from './interpreter/VisitorTest';
import UnitSelector from './components/UnitSelector';

function App() {

  const viewportRef = useRef();
  const scene = new Scene();

  const [gameManagerC, setGameManager] = useState(new GameManager("GameManager", null, {}));

  const codeRef = useRef();
  const awakeCodeRef = useRef();

  const [selectedUnit, setSelectedUnit] = useState(undefined);

  //TODO: Convert Scene Camera to Camera Component



  useEffect(() => {
    scene.setup(viewportRef.current);
    //scene.parseScene();

    //Setup Camera & GameManager


    // let meshComponent = new MeshComponent("MeshComponent", gameManager);
    // meshComponent.primitive = true;
    // meshComponent.primitiveShape = "Cube";

    //gameManager.attachComponent(meshComponent);
    let gameManager = GameObject.default("GameManager", new Vector3(0, 0, -10));
    let gameManagerComponent = gameManagerC;

    gameManager.attachComponent(gameManagerComponent);

    let camera = GameObject.default("Camera", new Vector3(0, 5, 0));
    camera.attachComponent(new CameraComponent("CameraComponent", camera, {}));
    camera.attachComponent(new FreeFlyCamera("FreeFlyCamera", camera, {}));

    scene.addGameObject(gameManager);
    scene.addGameObject(camera);

    console.log(scene);

    let indicator = GameObject.default("Indicator", new Vector3(0, 2, 0), new Vector3(0.1, 0.1, 0.1));
    let meshComponent2 = new MeshComponent("MeshComponent", indicator);
    meshComponent2.primitive = true;
    meshComponent2.primitiveShape = "Cube";
    meshComponent2.color = "9342f5";

    indicator.attachComponent(meshComponent2);

    let directionalLight = GameObject.default("DirectionalLight", new Vector3(2, 5, 3));
    directionalLight.attachComponent(new Light("Light", directionalLight, {}));

    let ambientLight = GameObject.default("AmbientLight", new Vector3(2, 5, 3));
    let ambientLightComponent = new Light("Light", ambientLight, {});
    ambientLightComponent.lightType = "Ambient";

    ambientLight.attachComponent(ambientLightComponent);


    scene.addGameObject(directionalLight);
    scene.addGameObject(ambientLight);
    scene.addGameObject(indicator);

    scene.scene.background = new Color(0xa2e6f5);

    scene.render();

    ///let test = new VisitorTest();


  }, []);


  return (
    <div className="App" ref={viewportRef}>
      {selectedUnit === undefined ? <div className="selection-sidebar" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>

        <UnitSelector type={"Ground Unit"} onSelected={(t) => {
          setSelectedUnit(t);
          gameManagerC.unitType = t;
        }}></UnitSelector>
        <UnitSelector type={"Turret Unit"} onSelected={(t) => {
          setSelectedUnit(t);
          gameManagerC.unitType = t;
        }}></UnitSelector>
      </div> : <div className="selection-sidebar" style={{ display: 'flex', alignItems: 'center', color: 'white', flexDirection: 'column' }}>
        <h3>{selectedUnit}</h3>
        <div contentEditable={true} ref={awakeCodeRef} style={{ width: '100%' }}>
          // AWAKE
        </div>
        <div contentEditable={true} ref={codeRef} style={{ width: '100%' }}>
          console.log("Hello World");
        </div>
        <div style={{ height: 50 }} ></div>
        <button onMouseDown={() => { setSelectedUnit(undefined); gameManagerC.unitType = ""; }}>Back</button>
        <button onMouseDown={() => {
          console.log("Saving", codeRef.current.innerText);
          gameManagerC.unitCode = codeRef.current.innerText;
          gameManagerC.unitAwakeCode = awakeCodeRef.current.innerText;
        }}>Save</button>
      </div>}
    </div>
  );
}

export default App;
