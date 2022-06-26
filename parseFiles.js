const fs = require("fs");

const parseConfigurationFile = (filename) => {
  const configurationFileContent = fs.readFileSync(`inputFiles/${filename}`, {
    encoding: "utf-8",
  });
  return JSON.parse(configurationFileContent);
};

const parseInputChangesFile = (filename) => {
  const inputChangesContent = fs.readFileSync(`inputFiles/${filename}`, {
    encoding: "utf-8",
  });

  return inputChangesContent
    .split("\n")
    .filter((line) => line) // Remove empty lines
    .map((modification) => ({
      key: JSON.parse(modification.split(":")[0]),
      newValue: JSON.parse(modification.split(":").slice(1).join(":").trim()),
    }));
};

module.exports = {
  parseConfigurationFile,
  parseInputChangesFile,
};
