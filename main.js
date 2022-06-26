const {
  parseConfigurationFile,
  parseInputChangesFile,
} = require("./parseFiles");

const writeFile = require("./writeFile");

const replaceJson = require("./replaceJson");

const main = () => {
  const configurationFile = parseConfigurationFile("configurationFile.json");
  const inputChanges = parseInputChangesFile("inputChanges.txt");

  const output = replaceJson(configurationFile, inputChanges);

  writeFile("output.json", output);
};

main();
