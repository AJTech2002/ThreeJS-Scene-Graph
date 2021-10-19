import {
    DefaultComponentProps,
    DefaultComponents,
} from "@razor/core";
import { Handler } from "express";
import {
    createFolderStructure,
    writeComponentsJS,
    writeFileInFolder,
} from "../essentialFiles";
import { findJSFilesInFolder, isComponent } from "../utilities";
import { readFileSync } from "fs";


// Handle Saving Project
export const projectSaveHandler: Handler = (req, res) => {
    let data: any = req.body;
    let location = data.directory;
    let scene = data.data;

    // Recieve Parsed Scene Data -> Dev Project
    writeFileInFolder(location + "/src/scene-parsed", "scene.json", scene, true);
}

// Initialise a Dev Project or Sync it
export const projectInitializeHandler: Handler = (req, res) => {
    let data: any = req.body;
    let location: string | undefined = data?.project?.directory;

    let allJSFiles = [];

    // Create Folders
    createFolderStructure(location + "/src", "scene-parsed");

    // Parse and create Component Configurations
    if (location) {
        let files = findJSFilesInFolder(location + "/src");
        let components: string[] = [];
        files.forEach((file) => {
            if (isComponent(file)) components.push(file);
        });

        writeComponentsJS(
            location + "/src/scene-parsed",
            components,
            location + "/src"
        );
    }

    res.send("Done.");
}

// Get Scene JSON from Dev
export const getSceneJSON: Handler = (req, res) => {
    let json = readFileSync(req.query.root + "/src/scene-parsed/scene.json");
    res.send(json.toString());
}

// Return JSON Props of Component
export const getComponentJSON: Handler = (req, res) => {

    // If Query is Default Component return Default Props JSON
    if (Object.keys(DefaultComponents).includes(req.query.component as string)) {
        let propNames: string[] = Object.keys(DefaultComponentProps);

        let queryComponentProp: string = req.query.component + "Props";

        let jsonObjects = DefaultComponentProps as any;

        if (propNames.includes(queryComponentProp)) {
            let jsonObj: any = jsonObjects[queryComponentProp];
            let jsonStr: string = JSON.stringify(jsonObj);
            res.send(jsonStr);
            return;
        }
    }

    // Otherwise read generated props file from dev project
    let json = readFileSync(
        req.query.root +
        `/src/scene-parsed/component-props/${req.query.component}.props.json`
    );
    res.send(json.toString());
}