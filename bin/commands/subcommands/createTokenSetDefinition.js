import inquirer from 'inquirer'

import { normalizeToken } from '../../util.js'
import {
	getCategory,
} from '../../frontendTokenManipulator.js'

import {
	saveJsonToFile,
	loadJsonFromFile,
} from '../../fileUtils.js'

import {
	error,
	success as successMessage,
} from '../../messages.js'


const createTokenSetDefinition = {
	command: 'create:token-set',
	describe: 'create a token set inside frontendtoken-definition',
	handler: async () => {
		const fileJson = loadJsonFromFile()

		if (fileJson.frontendTokenCategories.length === 0) {
			error('There\'s no category added yey')
			return
		}

		const choices = fileJson.frontendTokenCategories.reduce((prev, next) => {
			prev.push(next.name)
			prev.push(new inquirer.Separator())
			return prev
		}, [])
  
		const section = await inquirer.prompt({
			type: 'list',
			name: 'sectionName',
			message: 'Which section?',
			choices,
		})
  
		const { name: label } = await inquirer.prompt(
			Object.values({
				name: {
					message: 'Token set label?',
					name: 'name',
					demandOption: true,
					describe: 'Token set label',
					type: 'string',
				},
			})
		)
  
		const tokenSetLabel = normalizeToken(label)
  
		const tokenSet = {
			name: tokenSetLabel,
			label,
			frontendTokens: [],
		}
    
		const { sectionName } = section
		let sectionJson = getCategory(sectionName, fileJson)
  
		sectionJson.frontendTokenSets.push(tokenSet) 
  
		saveJsonToFile(fileJson)
		successMessage(`Token set ${tokenSetLabel} created!`)
	}
}

export { createTokenSetDefinition }
