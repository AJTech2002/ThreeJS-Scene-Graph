var fs = require('fs');
var defaultComponentName = require('./dist/components/index');


const writeFileInFolder = (
  folder,
  filename,
  data,
  force
) => {
  if (!fs.existsSync(folder + "/" + filename) || force) {
    console.log("Created : " + folder + "/" + filename);
    fs.writeFileSync(folder + "/" + filename, data);
  }
};

const writeComponentsJSON = (
  root,
  components,
  componentFiles,
  force = false
) => {
  //Gets prop for a component (inheritance not supported yet)
  for (let c = 0; c < componentFiles.length; c++) {
    let file = componentFiles[c];
    let componentJSON = {};
    let text = fs.readFileSync(file).toString();

    if (text.includes("extends GameComponent")) {
      let lines = text.split("\n");
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes("//")) {
          if (line.includes("[") && line.includes("]") && line.includes("prop")) {
            let propRaw = line
              .replace("[", "")
              .replace("]", "")
              .replace("//", "")
              .replace("prop", "")
              .trim();
            let propRawSplit = propRaw.split(" ");
            if (propRawSplit.length === 2) {
              componentJSON[propRawSplit[0]] = {
                type: propRawSplit[1],
              };
            }
          }
        }
      }
      writeFileInFolder(
        root + "/" + "component-props",
        components[c] + ".props.json",
        JSON.stringify(componentJSON),
        force
      );
    }
  }
};

let root = __dirname + "/src";
let components = defaultComponentName.DefaultComponentNames;
let componentFiles = defaultComponentName.DefaultComponentNames.map(
  (s) => __dirname + `/src/components/${s}.ts`
);

writeComponentsJSON(root, components, componentFiles, true);
