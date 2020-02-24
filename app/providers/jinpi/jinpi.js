const path = require('path');

module.exports = (initDate, finalDate) => {
	const childProcess = require('child_process')
		.spawn('python3',[__dirname+'/scrap.py',initDate, finalDate],{stdio:'inherit'});

	childProcess.on('data', function(data) {
		process.stdout.write(data);
	});

	childProcess.on('close', function(code) {
		if(code === 1) {
			process.stderr.write('error occured', code);
			return process.exit(1);
		}
		return process.stdout.write('migration done code: ',code)
	});
}
