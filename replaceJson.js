// input: "a.b.c[1]"
// output: [a, b, c, 1]
const splitJsonPath = (path) => path.match(/[^.\[\]]+/g);

const setPath = (object, path, value) => {
  const splittedPath = splitJsonPath(path);
  let isInvalidChange = false;
  splittedPath.reduce((subObject, property, index) => {
    if (isInvalidChange) return;

    if (subObject[property] === undefined) {
      console.warn(
        `Transformation failed : setting value ${value} at path ${path}`
      );
      isInvalidChange = true;
      return {};
    }

    if (splittedPath.length === index + 1) {
      return (subObject[property] = value);
    }

    return subObject[property];
  }, object);
};

const replaceJson = (inputJson, modifications) => {
  // deep copy the input object to avoid modifying the input
  const resultJson = JSON.parse(JSON.stringify(inputJson));
  for (let modification of modifications) {
    setPath(resultJson, modification.key, modification.newValue);
  }

  return resultJson;
};

module.exports = replaceJson;
