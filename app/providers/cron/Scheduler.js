const moment = require('moment');
const cron = require('node-cron');

const ABSPATH = '../../jobs/';
/**
 * @description :
 * Include cron routines in this scope using the following format:
 * cron.schedule("[cron-time]", require(ABSPATH+[routine-name]);)
 */
module.exports = (() => {
  cron.schedule('* * * * TUE', require(ABSPATH + 'inpi'));
})();
