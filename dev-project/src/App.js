import './App.css';
import { useEffect, useRef } from 'react';
import Scene from './scene-parsed/defaultComponents/Scene';

function App() {

  const viewportRef = useRef();
  const scene = new Scene();

  //TODO: Convert Scene Camera to Camera Component

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
