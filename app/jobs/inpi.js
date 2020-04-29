const Jinpi = require('../providers/jinpi/Jinpi');
const moment = require('moment');

/**
 * @description Inpi bigdata update routine.
 * @return {void}
 */
module.exports = () => {
  let jinpi = new Jinpi();

  jinpi.setDate({
    startDate: '01/04/2020',
    endDate: moment().format('DD/MM/YYYY').toString(),
  });

  return jinpi.update();
};
