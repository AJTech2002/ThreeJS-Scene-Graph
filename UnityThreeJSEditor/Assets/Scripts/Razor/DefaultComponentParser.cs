using Newtonsoft.Json.Linq;
using UnityEngine;

namespace Razor
{
    public class DefaultComponentParser
    {
        
        public static Vector3 CorrectedPosition(Vector3 rotation)
        {
            return new Vector3(rotation.x, rotation.y, -rotation.z);
        }
        
        public static Vector3 CorrectedRotation(Vector3 rotation)
        {
            Vector3 rotationInRadians = rotation * Mathf.Deg2Rad;
            return new Vector3(-rotationInRadians.x, -rotationInRadians.y, rotationInRadians.z);
        }

        public static JObject TransformParser(Transform transform)
        {
            JObject transformData = new JObject();

            transformData["name"] = "TransformComponent";
            
            transformData["props"] = Parser.Properties("position", "rotation", "scale", "default");
            
            transformData["position"] = Parser.Vector3Parser(CorrectedPosition(transform.position));
            
            
            transformData["rotation"] = Parser.Vector3Parser(CorrectedRotation(transform.eulerAngles));
            transformData["scale"] = Parser.Vector3Parser(transform.localScale);
            
            transformData["default"] = new JObject();
            
            return transformData;
        }
        
        public static JObject CameraParser(Camera camera)
        {
            JObject cameraData = new JObject();
            
            cameraData["name"] = "CameraComponent";
            cameraData["props"] = Parser.Properties("default");
            cameraData["default"] = new JObject();
            
            return cameraData;
        }
        
        public static JObject MeshRendererParser(MeshRenderer meshRenderer)
        {
            JObject meshRendererData = new JObject();
            
            meshRendererData["name"] = "MeshComponent";

            
            meshRendererData["props"] = Parser.Properties("default", "primitive", "color", "primitiveShape");
            meshRendererData["default"] = new JObject();
            
            bool primitive = false || meshRenderer.GetComponent<MeshFilter>().sharedMesh.name.Contains("Cube");
            
            // Check if mesh is a primitive

            meshRendererData["primitive"] = primitive;
            meshRendererData["color"] = "fff";
                //new JArray(meshRenderer.sharedMaterial.color.r, meshRenderer.sharedMaterial.color.g, meshRenderer.sharedMaterial.color.b, meshRenderer.sharedMaterial.color.a);
            meshRendererData["primitiveShape"] = meshRenderer.GetComponent<MeshFilter>().sharedMesh.name;
       
            
            return meshRendererData;
        }
    }
}