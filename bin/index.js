#! /usr/bin/env node

import _yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { testCommand } from './commands/testCommand.js'
import { generateSass } from './commands/generateSass.js'
import { createCommand } from './commands/createCommand.js'

const yargs = _yargs(hideBin(process.argv))

yargs
	.scriptName('stylebook')
	.usage('$0 <cmd> [args]')
	.command(createCommand)
	.command(generateSass)
	.command(testCommand)
	.help().argv
