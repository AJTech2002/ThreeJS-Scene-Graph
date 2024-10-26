
        using UnityEngine;
        using Newtonsoft.Json;
        using Newtonsoft.Json.Linq;
        using Razor;

        public class RotateCube : ThreeJSBehaviour {
            public float speed;
public float rotationSpeed;
public Vector3 offset;

            

            public override JObject ToJSON() {
                JObject data = new JObject();
                data["name"] = "RotateCube";
                data["props"] = Parser.Properties("speed", "rotationSpeed", "offset");
                data["default"] = new JObject();
                
            data["speed"] = Parser.ParseType(speed);
            

            data["rotationSpeed"] = Parser.ParseType(rotationSpeed);
            

            data["offset"] = Parser.ParseType(offset);
            
                return data;
            }

        }
        