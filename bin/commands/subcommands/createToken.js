import inquirer from 'inquirer'

import {
	normalizeToken
} from '../../util.js'

import {
	loadJsonFromFile,
	saveJsonToFile
} from '../../fileUtils.js'

import {
	error,
	info as infoMessage
} from '../../messages.js'

import { getCategory, getTokenSet } from '../../frontendTokenManipulator.js'

const createToken = {
	command: 'create:token',
	describe: 'create a token inside frontendtoken-definition file',
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
  
		const { sectionName } = section
  
		let {frontendTokenSets: tokens} = getCategory(sectionName, fileJson)
  
		if (tokens.length === 0) {
			infoMessage(`Section '${sectionName}' has no tokenSet`)
			return
		}
  
		const choicesTokens = tokens.reduce((prev, next) => {
			prev.push(next.name)
			prev.push(new inquirer.Separator())
			return prev
		}, [])
  
		const tokenSetAnswer = await inquirer.prompt({
			type: 'list',
			name: 'tokenSetName',
			message: 'Which token set?',
			choices: choicesTokens,
		})
  
		const { tokenSetName } = tokenSetAnswer
  
		let { frontendTokens} = getTokenSet(sectionName, tokenSetName, fileJson)
  
		const { name: label } = await inquirer.prompt(
			Object.values({
				name: {
					message: 'Token label?',
					name: 'name',
					demandOption: true,
					describe: 'Token label',
					type: 'string',
				},
			})
		)
  
		const { name: defaultValue } = await inquirer.prompt(
			Object.values({
				name: {
					message: 'Token default value?',
					name: 'name',
					demandOption: true,
					describe: 'Token default value',
					type: 'string',
				},
			})
		)
  
		const { name: cssVariable } = await inquirer.prompt(
			Object.values({
				name: {
					message: 'Css variable name?',
					name: 'name',
					demandOption: true,
					describe: 'Css variable name',
					type: 'string',
				},
			})
		)

		const { name: tokenType } = await inquirer.prompt(
			Object.values({
				name: {
					message: 'Token type?',
					name: 'name',
					type: 'list',
					choices: ['color', new inquirer.Separator(), 'text'],
				},
			})
		)
		
		const frontendToken = {
			defaultValue,
			label,
			mappings: [
				{
					type: 'cssVariable',
					value: cssVariable,
				},
			],
			name: normalizeToken(label),
			type: 'String',
		}
  
		if (tokenType === 'color') {
			frontendToken.editorType = 'ColorPicker'
		}
		frontendTokens.push(frontendToken)
  
		saveJsonToFile(fileJson)
		infoMessage(`Token definition ${label} created!`)
	}
}

export {
	createToken
}