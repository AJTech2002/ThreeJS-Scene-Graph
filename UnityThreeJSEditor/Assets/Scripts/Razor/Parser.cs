using UnityEngine;
using Newtonsoft.Json.Linq;

namespace Razor
{
    public class Parser
    {
        public static JArray Vector3Parser(Vector3 vector3)
        {
            JArray vector3Data = new JArray();
            vector3Data.Add(vector3.x);
            vector3Data.Add(vector3.y);
            vector3Data.Add(vector3.z);
            return vector3Data;
        }
        
        // take in a list of arg strings
        public static JArray Properties(params string[] args)
        {
            JArray arrayData = new JArray();
            foreach (var arg in args)
            {
                arrayData.Add(arg);
            }
            return arrayData;
        }
    
        
        public static JToken ParseType(object t)
        {
            if (t is Vector3)
            {
                return Vector3Parser((Vector3)t);
            }

            return new JValue(t);
        }

    }
}