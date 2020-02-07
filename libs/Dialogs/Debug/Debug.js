const colors = require('../Colors');

/**
 * @param {String} $msg
 * @description helper for testing and printing messages on the debug console.
 */
const Debug = function(){
  return {
    /**
     * @param {String} $msg
     * @description print debug log messages on console.
     */
    log : (msg) => console.log(`[-] ${colors.fg.green}${msg}${colors.reset}`),
    /**
     * @param {String} $msg
     * @description print debug warning messages on the console.
     */
    warn : (msg) => console.log(`[!] ${colors.fg.green}${msg}${colors.reset}`),
    /**
     * @param {String} $msg
     * @description print debug informative messages on the console.
     */
    info: (msg) => console.log(`[#] ${colors.fg.cyan}${msg}${colors.reset}`),
  };
};

module.exports = Debug;