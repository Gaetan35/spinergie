const fs = require("fs");

const writeOutputFile = (filename, fileContent) => {
  fs.writeFileSync(`outputFiles/${filename}`, JSON.stringify(fileContent));
};

module.exports = writeOutputFile;
