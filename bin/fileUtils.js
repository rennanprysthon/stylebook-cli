import fs from 'fs'

import { 
	error as errorMessage,
	success as successMessage
} from './messages.js'

const FILE_NAME = 'frontend-token-definition.json'
const FILE_PATH = `./${FILE_NAME}`

export const INITIAL_VALUE = {
	frontendTokenCategories: [],
}

function checkIfFileExists() {
	return fs.existsSync(FILE_PATH)
}

function createJsonFile() {
	if (!checkIfFileExists()) {
		saveJsonToFile(INITIAL_VALUE)
	}
}
 
function saveJsonToFile(jsonValue) {
	fs.writeFile(FILE_NAME, JSON.stringify(jsonValue, null, 4), function (error) {
		if (error) {
			errorMessage(`Something went wrong: ${error}`)
			throw error
		}
	})
}

function loadJsonFromFile() {
	createJsonFile()
	const fileContent = fs.readFileSync(FILE_PATH, 'utf8')
	const fileJson = JSON.parse(fileContent)

	return fileJson
}

function generateSassFile(fileName = 'export.scss') {
	let finalFile = ''
	let json = loadJsonFromFile()

	json.frontendTokenCategories.forEach((tokenSet) => {
		finalFile += `//# ${tokenSet.name.toLocaleUpperCase()} \n`

		tokenSet.frontendTokenSets.forEach((frontendTokenSet) => {
			finalFile += `\t //${frontendTokenSet.name} \n`

			frontendTokenSet.frontendTokens.forEach((frontendToken) => {
				finalFile += `\t $${frontendToken.label}:  var(--${frontendToken.label}); \n`
			})
			finalFile += '\n'
		})
	})

	fs.writeFile(`./${fileName}`, finalFile, function (error) {
		if (error) {
			errorMessage(`Something went wrong: ${error}`)
			throw error
		}
		successMessage(`${fileName} created!`)
	})
}

export { saveJsonToFile, loadJsonFromFile, generateSassFile, createJsonFile, checkIfFileExists }
