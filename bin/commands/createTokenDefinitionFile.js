import {
	saveJsonToFile,
	INITIAL_VALUE
} from '../fileUtils.js'

import {
	info as infoMessage
} from '../messages.js'

const createTokenDefinitionFile = {
	command: 'create',
	describe: 'create frontendtoken-definition file',
	handler: async () => {
		saveJsonToFile(INITIAL_VALUE)
		infoMessage('frontend-token-definition was created!')
	}
}

export {
	createTokenDefinitionFile
}