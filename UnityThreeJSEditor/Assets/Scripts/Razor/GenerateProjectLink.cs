using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using UnityEditor;
using UnityEngine;

public class GenerateProjectLink
{

    private static string CreatePropString (string name, string type)
    {
        if (type == "string")
        {
            return $"public string {name};";
        }
        else if (type == "int")
        {
            return $"public int {name};";
        }
        else if (type == "float")
        {
            return $"public float {name};";
        }
        else if (type == "bool")
        {
            return $"public bool {name};";
        }
        else if (type == "vec3")
        {
            return $"public Vector3 {name};";
        }
        else if (type == "eul3")
        {
            return $"public Vector3 {name};";
        }
        else if (type == "boolean") // For the typo
        {
            return $"public bool {name};";
        }
        else
        {
            return $"public {type} {name};";
        }
    }
    
    private static string GenerateCSharpFile(string text, string fileName)
    {
              
        // go line by line 
        // if line contains "class" then get the class name
        string[] lines = text.Split('\n');
        string className = "";
        
        List<string> props = new List<string>();
        List<string> propNames = new List<string>();
        List<string> propTypes = new List<string>();
        
        foreach (string line in lines)
        {
            if (line.Contains("class"))
            {
                try
                {
                    // Break into words
                    string[] words = line.Trim().Split(' ');
                    // Find the index of class
                    int index = Array.IndexOf(words, "class");
                    // Next word is the class name
                    className = words[index + 1];
                }
                catch (Exception e)
                {
                    Debug.LogError($"Could not find class name in {fileName} " + e);
                }
            }

            if (line.Contains("prop"))
            {
                // Remove comments and brackets
                try
                {
                    string cleanedLine = line.Trim();
                    cleanedLine = cleanedLine.Replace("//", "");
                    cleanedLine = cleanedLine.Replace("[", "");
                    cleanedLine = cleanedLine.Replace("]", "");
                    
                    string[] words = cleanedLine.Trim().Split(' ');
                    string propName = words[1];
                    string propType = words[2];
                    props.Add(CreatePropString(propName, propType));
                    propNames.Add(propName);
                    propTypes.Add(propType);
                }
                catch (Exception e)
                {
                    Debug.LogError($"Incorrect prop syntax in {fileName} : {line} " + e);
                }
            }
        }

        
        List<string> appendProperties = new List<string>();
        
        // This will append the properties to the JSON
        for (int i = 0; i < propNames.Count; i++)
        {
            string propName = propNames[i];
            string propType = propTypes[i];
            
            appendProperties.Add($@"
            data[""{propName}""] = Parser.ParseType({propName});
            ");
        }

        string output = $@"
        using UnityEngine;
        using Newtonsoft.Json;
        using Newtonsoft.Json.Linq;
        using Razor;

        public class {className} : ThreeJSBehaviour {{
            {string.Join("\n", props)}

            

            public override JObject ToJSON() {{
                JObject data = new JObject();
                data[""name""] = ""{className}"";
                data[""props""] = Parser.Properties({string.Join(", ", propNames.Select(x => $@"""{x}"""))});
                data[""default""] = new JObject();
                {string.Join("\n", appendProperties)}
                return data;
            }}

        }}
        ";
        
        JObject componentProps = new JObject();
        
        for (int i = 0; i < propNames.Count; i++)
        {
            string propName = propNames[i];
            string propType = propTypes[i];
            componentProps[propName] = new JObject()
            {
                {"type", propType}
            };
        }
        
        string propsPath = "/Users/ajayvenkat/Desktop/Development/ThreeJS-Scene-Graph/dev-project/src/scene-parsed/component-props/" + className + ".props.json";
        
        System.IO.File.WriteAllText(propsPath, componentProps.ToString());
        
        // Filename but with .cs extension
        string path = fileName.Replace(".ts", ".cs");
        
        // Write the output to the file with overwrite
        string javaScriptPath = "/Users/ajayvenkat/Desktop/Development/ThreeJS-Scene-Graph/dev-project/src/scene-parsed/game-logic/" + className + ".ts";
                
        // Write the output to the file with overwrite

        string typeScriptText = text;
        
        // Change the imports to be relative again
        typeScriptText = typeScriptText.Replace("./@types/", "");
        
        System.IO.File.WriteAllText(javaScriptPath, typeScriptText);
        
        
        // Write the output to the file with overwrite
        System.IO.File.WriteAllText(path, output);

        return className;
    }

    [MenuItem("Razor/Parse Files")]
    private static void ParseFiles()
    {
        // Find all files of extension .ts in the Assets folder and its subfolders
        string[] files = System.IO.Directory.GetFiles(Application.dataPath, "*.ts", System.IO.SearchOption.AllDirectories);
        
        List<string> components = new List<string>();
        List<string> props = new List<string>();
        List<string> imports = new List<string>();
        
        foreach (string file in files)
        {
            if (file.Contains(".d.ts")) continue;
            
            //TODO: Generate the .props.json in scene-parsed/component-props
            //TODO: Generate the C# File from the props & name of the TS File & Auto JSON Parsing
            Debug.Log(file);
            string text = System.IO.File.ReadAllText(file);
            string name = GenerateCSharpFile(text, file);
            
            components.Add(name);
            props.Add(name+"Props");
            
            imports.Add($"import {name} from './game-logic/{name}';");
            imports.Add($"import * as {name}Props from './component-props/{name}.props.json';");
        }
        
        string componentDefinition = $@"
            {string.Join("\n", imports)}
            import {{ DefaultComponentProps, DefaultComponents }} from '@razor/core';

            export const Components = {{{string.Join("\n", components)}, ...DefaultComponents}};
           export const ComponentProperties = {{ {string.Join("\n", props)}, ...DefaultComponentProps }};

            export const returnProperty = (component, property) => {{
                return ComponentProperties[component + ""Props""].default[property];
            }}

            export const getPropertiesOfComponent = (component) => {{
                // Get the keys
                var obj = ComponentProperties[component + ""Props""].default;
                return Object.keys(obj);
            }}
        ";

        string componentJSPath =
            "/Users/ajayvenkat/Desktop/Development/ThreeJS-Scene-Graph/dev-project/src/scene-parsed/components.js";
        
        System.IO.File.WriteAllText(componentJSPath, componentDefinition);
    }

}

public class ThreeJSBehaviour : MonoBehaviour
{
    public virtual JObject ToJSON()
    {
        return new JObject();
    }
}