import inquirer from 'inquirer'
import { normalizeToken } from '../util.js'
import {
	saveJsonToFile,
	loadJsonFromFile,
} from '../fileUtils.js'

const createCategory = {
	command: 'create:category',
	describe: 'create a category section on frontendtoken-definition.json file',
	handler: async () => {
		const { name: categoryName } = await inquirer.prompt(
			Object.values({
				name: {
					message: 'Category label?',
					name: 'name',
					demandOption: true,
					describe: 'Category label',
					type: 'string',
				},
			})
		)

		if (categoryName) {
			let name = normalizeToken(categoryName)
			let label = categoryName

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
}

export { createCategory }
