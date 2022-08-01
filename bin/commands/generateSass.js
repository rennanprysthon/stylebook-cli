import inquirer from 'inquirer'
import {
	generateSassFile,
} from '../fileUtils.js'

const generateSass = {
	command: 'generate',
	describe: 'generate a .scss file',
	handler: async () => {
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
}

export { generateSass }