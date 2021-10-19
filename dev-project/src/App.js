import './App.css';
import { useEffect, useRef } from 'react';
import { Scene } from '@razor/core';

import * as Components from './scene-parsed/components'
import * as SceneJSON from './scene-parsed/scene.json';

function App() {

  const viewportRef = useRef();
  const scene = new Scene();

  //TODO: Convert Scene Camera to Camera Component

  useEffect(() => {
    scene.setup(viewportRef.current);
    scene.parseScene(Components, JSON.stringify(SceneJSON));
    scene.render();
  });

  return (
    <div className="App" ref={viewportRef}>

    </div>
  );
}

export default App;
