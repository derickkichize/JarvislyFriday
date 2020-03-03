const Debug = require('../../../../libs/Dialogs/Debug/Debug');
const h = require('../../../../libs/helpers');
const InpiDbTools = require('./inpiDbTools');
const moment = require('moment');
/**
 * @param {brand} brand
 * @description configure and save data in the bank
 * @return {void}
 */
module.exports = async function (brand) {
  const magazineNumber = brand['revista']['numero'];
  const magazineDate = brand['revista']['data'];
  const debug = new Debug();

  debug.log(`revista ${magazineNumber}`);
  console.log('--------------------------------------------------');

  let _process = brand['revista']['processo']

  for (let i in _process) {

    let data = {
      magazineNumber    : magazineNumber,
      magazineDate      : moment(magazineDate, 'DD/MM/YYYY').format('YYYY/MM/DD'),
      processNumber     : _process[i]['numero'],
      dispatches        : _process[i]['despachos'],
      holders           : _process[i]['titulares'],
      attorney          : _process[i]['procurador'],
      overstands        : _process[i]['sobrestadores'],
      depositDate       : _process[i]['data-deposito'],
      grantDate         : _process[i]['data-concessao'],
      effectiveDate     : _process[i]['data-vigencia'],
      viennaClasses     : _process[i]['classes-vienna'],
      brand             : _process[i]['marca'],
      handout           : _process[i]['apostila'],
      unionistPriority  : _process[i]['prioridade-unionista'],
      listNiceClass     : _process[i]['lista-classe-nice']
    };

    if(_process[i].hasOwnProperty('lista-classe-nice')) {
      let listNiceClass = _process[i]['lista-classe-nice'];
      data.listNiceClass = Array.isArray(listNiceClass) ? listNiceClass : [listNiceClass['classe-nice']];
    } else {
      data.listNiceClass = undefined;
    }

    await InpiDbTools().createBrand(data);
    //debug.info(`processo ${brand['revista']['processo'][i]['numero']} migrado`);
  }

  await InpiDbTools().createPublication({
    magazineNumber: magazineNumber,
    magazineDate: magazineDate
  });
  debug.info(`revista ${magazineNumber} publicada`);
}