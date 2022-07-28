const testCommand = {
	command: 'test <source> [proxy]',
	describe: 'just print hello world on the screen',
	handler: (argv) => {
		console.log('worked')
		console.log(argv)
	}
}

export { testCommand }
