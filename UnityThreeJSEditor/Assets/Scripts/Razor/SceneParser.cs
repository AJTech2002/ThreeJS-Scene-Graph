using System;
using System.Collections.Generic;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Razor
{
    [InitializeOnLoad]
    public static class SceneSaveCallback
    {
        static SceneSaveCallback()
        {
            EditorSceneManager.sceneSaved += OnSceneSaved;
        }

    
    
        private static void OnSceneSaved(Scene scene)
        {
            JObject sceneData = new JObject();
            
            var sceneArray = new JArray();
            
        
            // Loop through all the GameObjects in the scene
            var gameObjects = scene.GetRootGameObjects();

            foreach (var gO in gameObjects)
            {
                //TODO: Handle Children Later
            
                Component[] components = gO.GetComponents<Component>();
            
                JObject gameObjectData = new JObject();
                gameObjectData["name"] = gO.name;
                gameObjectData["parent"] = "null";
                
                JArray componentsArray = new JArray();
                
        
                foreach (var component in components)
                {
                    JObject componentData = new JObject();
                    
                    Debug.Log(component.ToString());
                    
                    if (component is Transform) componentData = DefaultComponentParser.TransformParser(component as Transform);
                    else if (component is Camera) componentData = DefaultComponentParser.CameraParser(component as Camera);
                    else if (component is MeshRenderer) componentData = DefaultComponentParser.MeshRendererParser(component as MeshRenderer);
                    else
                    {
                        if (component is ThreeJSBehaviour)
                        {
                            componentData = (component as ThreeJSBehaviour).ToJSON();
                        }
                        else
                        {
                            continue;
                        }
                    }
                    
                    // check that the componentData is not empty
                    if (componentData.Count == 0) continue;
                    componentsArray.Add(componentData);
                }
                
                gameObjectData["components"] = componentsArray;
                sceneArray.Add(gameObjectData);
                
            }
            
            sceneData["gameObjects"] = sceneArray;
            
            Debug.Log(sceneData);

            string path =
                "/Users/ajayvenkat/Desktop/Development/ThreeJS-Scene-Graph/dev-project/src/scene-parsed/scene.json";
            System.IO.File.WriteAllText(path, sceneData.ToString());
        }
    }
}