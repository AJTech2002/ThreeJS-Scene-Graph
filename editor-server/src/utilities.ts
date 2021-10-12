import file, { fstat, readFile, readFileSync, stat, statSync } from "fs";

export const isComponent = (file: string): boolean => {
  let text = readFileSync(file);

  if (text.includes("extends GameComponent")) {
    return true;
  }

  return false;
};

export const findJSFilesInFolder = (folder: string): string[] => {
  let foundFiles: string[] = [];
  let files = file.readdirSync(folder);
  if (files === undefined) return [];
  files.forEach((element: string) => {
    let statistic = statSync(folder + "/" + element);
    if (statistic.isFile()) {
      if (element.endsWith(".js") || element.endsWith(".ts")) {
        foundFiles.push(folder + "/" + element);
      }
    } else {
      foundFiles = foundFiles.concat(
        findJSFilesInFolder(folder + "/" + element)
      );
    }
  });

  return foundFiles;
};
