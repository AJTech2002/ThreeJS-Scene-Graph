using UnityEditor;
using UnityEngine;
using System.IO;

public class TypeScriptFileCreator
{
    [MenuItem("Assets/Create/TypeScript Script", false, 80)]
    private static void CreateTypeScriptScript()
    {
        string path = "Assets/NewScript.ts";
        path = AssetDatabase.GenerateUniqueAssetPath(path);

        string scriptContent = "// Your TypeScript code here";
        File.WriteAllText(path, scriptContent);
        
        AssetDatabase.Refresh();
        EditorUtility.FocusProjectWindow();
        Selection.activeObject = AssetDatabase.LoadAssetAtPath<Object>(path);
    }
}