const AdmZip = require('adm-zip');
const fs = require('fs');

/**
 * @description global methods helper
 */
module.exports = {
	/**
	 * @name sleep
	 * @param {number} ms
	 * @description interrupts the process for the specified time.
	 */
	sleep: ms => new Promise((res) => setInterval(res, ms)),

	/**
	 * @name readableBytes
	 * @param {number} bytes
	 * @description Shows human-readable bytes data.
	 */
	readableBytes: bytes => {
		let i = Math.floor(Math.log(bytes) / Math.log(1024));
		let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
	},

	/**
	 * @name unzip
	 * @param {Buffer} zippedFile
	 * @description decompresses zipped data.
	 */
	unzip: (zippedFile) => {
    let buf = new Array,
      ext = null,
			zip = new AdmZip(zippedFile),
			zipEntries = zip.getEntries();

		for (let entry in zipEntries) {
      ext = zipEntries[entry].entryName.substr(-3);
			buf.push(zip.readAsText(zipEntries[entry]));
		}
		
		return { ext: ext, buffer: buf};
	},
	/**
	 * @name log
	 * @param {String} dataLog
	 * @description write a log file.
	 */
	log: (dataLog) => {
		fs.writeFile('tmp/'+new Date().getTime()+'.log', dataLog, err => {
			(err) ? console.log(err) : console.log('saved');
		})
	}
}
