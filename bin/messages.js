import chalk from 'chalk'

const log = console.log
    
function error(msg = '') {
	log(chalk.redBright(msg))
}

function success(msg = '') {
	log(chalk.blueBright(msg))
}

function info(msg = '') {
	log(chalk.yellowBright(msg))
}

export {
	error,
	success,
	info
}
