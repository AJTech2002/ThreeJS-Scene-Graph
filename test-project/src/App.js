import './App.css';
import { useEffect, useRef } from 'react';
import Scene from './structure/Scene';

function App() {

  const viewportRef = useRef();
  const scene = new Scene();

  //TODO: Convert Scene Camera to Camera Component
  scene.camera.position.z = 5;

  useEffect(() => {
    scene.setup(viewportRef.current);
    scene.parseScene();
    scene.render();
  });

  return (
    <div className="App" ref={viewportRef}>

    </div>
  );
}

export default App;
