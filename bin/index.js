#! /usr/bin/env node

import inquirer from 'inquirer'
import _yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import {
	getCategory,
	getTokenSet
} from './frontendTokenManipulator.js'

import { normalizeToken } from './util.js'
import {
	saveJsonToFile,
	loadJsonFromFile,
	generateSassFile,
} from './fileUtils.js'

import {
	info as infoMessage,
	success as successMessage
} from './messages.js'

const yargs = _yargs(hideBin(process.argv))

async function createSection() {
	const { name: sectionName } = await inquirer.prompt(
		Object.values({
			name: {
				message: 'Section label?',
				name: 'name',
				demandOption: true,
				describe: 'Section label',
				type: 'string',
			},
		})
	)

	if (sectionName) {
		let name = normalizeToken(sectionName)
		let label = sectionName

		const fileJson = loadJsonFromFile()
		const section = {
			name,
			label,
			frontendTokenSets: [],
		}

		fileJson.frontendTokenCategories.push(section)

		saveJsonToFile(fileJson)
	}
}

async function createTokenSetDefinition() {
	const fileJson = loadJsonFromFile()

	const choices = fileJson.frontendTokenCategories.reduce((prev, next) => {
		prev.push(next.name)
		prev.push(new inquirer.Separator())
		return prev
	}, [])

	const section = await inquirer.prompt({
		type: 'list',
		name: 'Which section?',
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
	
	const sectionName = Object.values(section)[0]
	let sectionJson = getCategory(sectionName, fileJson)

	sectionJson.frontendTokenSets.push(tokenSet) 

	saveJsonToFile(fileJson)
	successMessage(`Token set ${tokenSetLabel} created!`)
}

async function createTokenDefinition() {
	const fileJson = loadJsonFromFile()

	const choices = fileJson.frontendTokenCategories.reduce((prev, next) => {
		prev.push(next.name)
		prev.push(new inquirer.Separator())
		return prev
	}, [])

	const section = await inquirer.prompt({
		type: 'list',
		name: 'Which section?',
		choices,
	})

	const sectionName = Object.values(section)[0]

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
		name: 'Which token set?',
		choices: choicesTokens,
	})

	const tokenSetName = Object.values(tokenSetAnswer)[0]

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
				value: label,
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

async function generateSass() {
	const { name: sassName } = await inquirer.prompt(
		Object.values({
			name: {
				message: 'SASS file name:',
				name: 'name',
				demandOption: true,
				describe: 'SASS file name',
				type: 'string',
			},
		})
	)
	generateSassFile(`${sassName}.scss`)
}

yargs
	.scriptName('stylebook')
	.usage('$0 <cmd> [args]')
	.command(
		'create:category',
		'Create a section on token definition',
		createSection
	)
	.command(
		'create:token-set',
		'Create token set definition into one section',
		createTokenSetDefinition
	)
	.command(
		'create:token',
		'Create token definition into one token set',
		createTokenDefinition
	)
	.command('create', 'Create token definition json file', () =>
		saveJsonToFile(null, true)
	)
	.command('generate', 'Create sass file', generateSass)
	.help().argv
