const Debug = require('../../../../libs/Dialogs/Debug/Debug');
const h = require('../../../../libs/helpers');
const InpiDbTools = require('./inpiDbTools');
const moment = require('moment');
/**
 * @param {brand} magazine
 * @description configure and save data in the bank
 * @return {void}
 */
module.exports = async function(magazine) {
  const number = magazine['numero'];
  const date = magazine['data'];
  const process = magazine['processo'];
  const debug = new Debug();

  // debug.log(`magazine ${number}, ${date}`);

  console.warn('PROCESSO:', process[0]);

  let i = 0;
  for (const doc of process) {
    if (Array.isArray(doc.despachos)) {
      console.warn('despachos em ARRAY!!! ------>:', doc.despachos);
      return;
    }
  }

  return;

  for (let i in process) {

    let data = {
      magazineNumber: number,
      magazineDate: moment(date, 'DD/MM/YYYY').format('YYYY/MM/DD'),

      processNumber: process[i]['numero'],
      dispatches: process[i]['despachos'],
      holders: process[i]['titulares'],
      attorney: process[i]['procurador'],
      overstands: process[i]['sobrestadores'],
      depositDate: process[i]['data-deposito'],
      grantDate: process[i]['data-concessao'],
      effectiveDate: process[i]['data-vigencia'],
      viennaClasses: process[i]['classes-vienna'],
      brand: process[i]['marca'],
      handout: process[i]['apostila'],
      unionistPriority: process[i]['prioridade-unionista'],
      listNiceClass: process[i]['lista-classe-nice'],
    };

    if (process[i].hasOwnProperty('lista-classe-nice')) {
      let listNiceClass = process[i]['lista-classe-nice'];
      data.listNiceClass = Array.isArray(listNiceClass)
          ? listNiceClass
          : [listNiceClass['classe-nice']];
    } else {
      data.listNiceClass = undefined;
    }

    // await InpiDbTools().createBrand(data);
    //debug.info(`processo ${brand['revista']['processo'][i]['numero']} migrado`);
  }

  // await InpiDbTools().createPublication({
  //   magazineNumber: number,
  //   magazineDate: date,
  // });

  debug.info(`revista ${number} publicada`);
};