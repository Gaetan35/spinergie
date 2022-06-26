const replaceJson = require("./replaceJson");

const firstData = {
  coordinates: [10, 12],
  color: "white",
};

const unusualNameData = {
  column: "name",
  sort: "desc",
};

const objectsArrayData = [
  {
    x: 10,
    value: 100,
  },
  {
    x: 20,
    value: 200,
  },
];

const inputJson = {
  page1: {
    firstData,
    "unusual-name-data": unusualNameData,
    objectsArrayData,
  },
};

describe("ReplaceJson", () => {
  it("works with a string replacement", () => {
    const modifications = [{ key: "page1.firstData.color", newValue: "green" }];

    const expectedOutput = {
      page1: {
        firstData: { ...firstData, color: "green" },
        "unusual-name-data": unusualNameData,
        objectsArrayData,
      },
    };

    expect(replaceJson(inputJson, modifications)).toEqual(expectedOutput);
  });

  it("works with a number replacement", () => {
    const modifications = [{ key: "page1.firstData.color", newValue: 5 }];

    const expectedOutput = {
      page1: {
        firstData: { ...firstData, color: 5 },
        "unusual-name-data": unusualNameData,
        objectsArrayData,
      },
    };

    expect(replaceJson(inputJson, modifications)).toEqual(expectedOutput);
  });

  it("works with a boolean replacement", () => {
    const modifications = [{ key: "page1.firstData.color", newValue: true }];

    const expectedOutput = {
      page1: {
        firstData: { ...firstData, color: true },
        "unusual-name-data": unusualNameData,
        objectsArrayData,
      },
    };

    expect(replaceJson(inputJson, modifications)).toEqual(expectedOutput);
  });

  it("works with unusualNameData", () => {
    const modifications = [
      { key: "page1.unusual-name-data.column", newValue: "modifiedColumn" },
    ];

    const expectedOutput = {
      page1: {
        firstData,
        "unusual-name-data": { ...unusualNameData, column: "modifiedColumn" },
        objectsArrayData,
      },
    };

    expect(replaceJson(inputJson, modifications)).toEqual(expectedOutput);
  });

  it("works with several modifications", () => {
    const modifications = [
      { key: "page1.unusual-name-data.sort", newValue: "modifiedSort" },
      { key: "page1.unusual-name-data.column", newValue: "modifiedColumn" },
      { key: "page1.firstData.color", newValue: "green" },
    ];

    const expectedOutput = {
      page1: {
        firstData: { ...firstData, color: "green" },
        "unusual-name-data": { column: "modifiedColumn", sort: "modifiedSort" },
        objectsArrayData,
      },
    };

    expect(replaceJson(inputJson, modifications)).toEqual(expectedOutput);
  });

  it("works when modifying the same value several times", () => {
    const modifications = [
      { key: "page1.unusual-name-data.sort", newValue: "modifiedSort" },
      { key: "page1.unusual-name-data.column", newValue: "modifiedColumn" },
      { key: "page1.unusual-name-data.sort", newValue: "modifiedTwice" },
    ];

    const expectedOutput = {
      page1: {
        firstData,
        "unusual-name-data": {
          column: "modifiedColumn",
          sort: "modifiedTwice",
        },
        objectsArrayData,
      },
    };

    expect(replaceJson(inputJson, modifications)).toEqual(expectedOutput);
  });

  it("works when newValue is an array", () => {
    const modifications = [
      { key: "page1.firstData.coordinates", newValue: [15, 20, 30] },
    ];

    const expectedOutput = {
      page1: {
        firstData: { ...firstData, coordinates: [15, 20, 30] },
        "unusual-name-data": unusualNameData,
        objectsArrayData,
      },
    };

    expect(replaceJson(inputJson, modifications)).toEqual(expectedOutput);
  });

  it("works when newValue is an object", () => {
    const modifications = [
      { key: "page1.firstData", newValue: { new1: "new1", new2: 42 } },
    ];

    const expectedOutput = {
      page1: {
        firstData: { new1: "new1", new2: 42 },
        "unusual-name-data": unusualNameData,
        objectsArrayData,
      },
    };

    expect(replaceJson(inputJson, modifications)).toEqual(expectedOutput);
  });

  it("handles arrays selecting at the end of the path correctly", () => {
    const modifications = [
      {
        key: "page1.firstData.coordinates[0]",
        newValue: { value: "Wow JSON injected" },
      },
    ];

    const expectedOutput = {
      page1: {
        firstData: {
          ...firstData,
          coordinates: [
            { value: "Wow JSON injected" },
            ...firstData.coordinates.slice(1),
          ],
        },
        "unusual-name-data": unusualNameData,
        objectsArrayData,
      },
    };

    expect(replaceJson(inputJson, modifications)).toEqual(expectedOutput);
  });

  it("handles arrays in the middle of the path correctly", () => {
    const modifications = [
      {
        key: "page1.objectsArrayData[1].value",
        newValue: 400,
      },
    ];

    const expectedOutput = {
      page1: {
        firstData,
        "unusual-name-data": unusualNameData,
        objectsArrayData: [
          objectsArrayData[0],
          { ...objectsArrayData[1], value: 400 },
        ],
      },
    };

    expect(replaceJson(inputJson, modifications)).toEqual(expectedOutput);
  });

  it("does nothing if path is incorrect", () => {
    const modifications = [
      {
        key: "page1.wrongPath",
        newValue: 400,
      },
    ];

    const expectedOutput = inputJson;

    expect(replaceJson(inputJson, modifications)).toEqual(expectedOutput);
  });

  it("applies valid modifications and ignores incorrect ones", () => {
    const modifications = [
      { key: "page1.wrongPath", newValue: 400 },
      { key: "page1.firstData.color", newValue: 400 },
      { key: "page1.firstData.wrongPathAgain", newValue: false },
    ];

    const expectedOutput = {
      page1: {
        firstData: { ...firstData, color: 400 },
        "unusual-name-data": unusualNameData,
        objectsArrayData,
      },
    };

    expect(replaceJson(inputJson, modifications)).toEqual(expectedOutput);
  });
});
