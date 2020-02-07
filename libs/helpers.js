const AdmZip = require('adm-zip');

/**
 * @description global methods helper
 */
module.exports = {

	/**
	 * @param {number} ms
	 * @description interrupts the process for the specified time.
	 */
	sleep: ms => new Promise((res) => setInterval(res,ms)),

	/**
	 * @param {number} bytes
	 * @description Shows human-readable bytes data.
	 */
	readableBytes: bytes => {
		let i = Math.floor(Math.log(bytes) / Math.log(1024)),
		sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
	},

	/**
	 * @param {Buffer} zippedFile
	 * @description decompresses zipped data.
	 */
	unzip: (zippedFile) => {
		let buf    		 = new Array,
				zip    		 = new AdmZip(zippedFile),
			  zipEntries = zip.getEntries();

		for ( let entry in zipEntries ) {
			if(zipEntries[entry].entryName.substr(-3) === 'xml') {
				buf.push(zip.readAsText(zipEntries[entry]));
			}
		}
		return buf;
	}
}
