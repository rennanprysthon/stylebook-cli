import inquirer from 'inquirer'
import {
	createJsonFile
} from '../fileUtils.js'
import { createCategory } from './subcommands/createCategory.js'
import { createToken } from './subcommands/createToken.js'
import { createTokenSetDefinition } from './subcommands/createTokenSetDefinition.js'

const commandChoices = [
	{
		name: 'create category', 
		value: 'category'
	},
	new inquirer.Separator(),
	{
		name: 'create token set',
		value: 'tokenSet'
	},
	new inquirer.Separator(),
	{
		name: 'create token',
		value: 'token'
	},
	new inquirer.Separator(),
	{
		name: 'quit',
		value: 'quit'
	}
]

const actions = {
	category: createCategory,
	tokenSet: createTokenSetDefinition,
	token: createToken
}

async function commandHandler() {
	createJsonFile()

	const { command } = await inquirer.prompt({
		type: 'list',
		name: 'command',
		message: 'Which command?',
		choices: commandChoices,
	})

	const action = actions[command]

	if (command === 'quit') return

	if (action) {
		console.clear()
		await action.handler()
		commandHandler()
	}
}

const createCommand = {
	command: 'create',
	describe: 'create stylebook frontend-token-definition file',
	handler: commandHandler
}

export { createCommand }
