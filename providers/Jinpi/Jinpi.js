const Inpi = require('./libs/inpi');

(function () {
  let inpi = new Inpi();

  inpi.setDate({ startDate: '01/01/2000', endDate: '01/01/2020' })

  inpi.update();
})()
