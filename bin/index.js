#! /usr/bin/env node

import _yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { testCommand } from './commands/testCommand.js'
import { createCategory } from './commands/createCategory.js'
import { createTokenSetDefinition } from './commands/createTokenSetDefinition.js'
import { createTokenDefinitionFile } from './commands/createTokenDefinitionFile.js'
import { createToken } from './commands/createToken.js'
import { generateSass } from './commands/generateSass.js'

const yargs = _yargs(hideBin(process.argv))

yargs
	.scriptName('stylebook')
	.usage('$0 <cmd> [args]')
	.command(createCategory)
	.command(createTokenSetDefinition)
	.command(createTokenDefinitionFile)
	.command(createToken)
	.command(generateSass)
	.command(testCommand)
	.help().argv
