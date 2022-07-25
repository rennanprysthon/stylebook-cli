#! /usr/bin/env node

import inquirer from 'inquirer'
import { hideBin } from 'yargs/helpers'
import _yargs from 'yargs'
import { normalizeToken } from './util.js'
import chalk from 'chalk'
import {
	saveJsonToFile,
	loadJsonFromFile,
	generateSassFile,
} from './fileUtils.js'

const log = console.log

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

	fileJson.frontendTokenCategories
		.filter((tokenSet) => tokenSet.name === sectionName)[0]
		.frontendTokenSets.push(tokenSet)

	saveJsonToFile(fileJson)
	log(chalk.blueBright(`Token set ${tokenSetLabel} created!`))
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

	const tokens = fileJson.frontendTokenCategories.filter(
		(tokenSet) => tokenSet.name === sectionName
	)[0].frontendTokenSets

	if (tokens.length === 0) {
		log(chalk.red(`Section '${sectionName}' has no tokenSet`))
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

	let { frontendTokens } = tokens.filter(
		(tokenSet) => tokenSet.name === Object.values(tokenSetAnswer)[0]
	)[0]

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
	log(chalk.blueBright(`Token definition ${label} created!`))
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
