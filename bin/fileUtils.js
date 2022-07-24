import fs from "fs";
import chalk from "chalk";

const FILE_NAME = "frontend-token-definition.json";
const FILE_PATH = `./${FILE_NAME}`;

const log = console.log;

const INITIAL_VALUE = {
  frontendTokenCategories: [],
};

function checkIfFileExists() {
  return fs.existsSync(FILE_PATH);
}

function saveJsonToFile(jsonValue, isFirstTime = false) {
  const json = isFirstTime ? INITIAL_VALUE : jsonValue;

  fs.writeFile(FILE_NAME, JSON.stringify(json, null, 4), function (error) {
    if (error) {
      throw error;
    }
    if (isFirstTime) {
      log(chalk.blueBright(`${FILE_NAME} created!`));
    }
  });
}

function loadJsonFromFile() {
  if (!checkIfFileExists()) {
    saveJsonToFile(INITIAL_VALUE);
  }

  const fileContent = fs.readFileSync(FILE_PATH, "utf8");
  const fileJson = JSON.parse(fileContent);

  return fileJson;
}

function generateSassFile(fileName = "export.scss") {
  let finalFile = "";
  let json = loadJsonFromFile();

  json.frontendTokenCategories.forEach((tokenSet) => {
    console.log(tokenSet.name.toLocaleUpperCase());
    finalFile += `//# ${tokenSet.name.toLocaleUpperCase()} \n`;

    tokenSet.frontendTokenSets.forEach((frontendTokenSet) => {
      finalFile += `\t //${tokenSet.name} \n`;

      frontendTokenSet.frontendTokens.forEach((frontendToken) => {
        finalFile += `\t $${frontendToken.name}:  var(--${frontendToken.label}); \n`;
      });
      finalFile += `\n`;
    });
  });

  fs.writeFile(`./${fileName}`, finalFile, function (error) {
    if (error) {
      throw error;
    }
    log(chalk.blueBright(`${fileName} created!`));
  });
}
export { saveJsonToFile, loadJsonFromFile, generateSassFile };
