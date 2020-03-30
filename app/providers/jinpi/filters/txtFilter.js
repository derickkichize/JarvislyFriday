const Debug = require('../../../../libs/Dialogs/Debug/Debug');
const h = require('../../../../libs/helpers');
const InpiDbTools = require('../libs/inpiDbTools');
const trap = require('./traps/textFileTrap');
const moment = require('moment');

module.exports = async function (txt, magazineDate, magazineNumber) {
  const debug = new Debug();
  
  let data = new Object;
  let brand = new Object;
  const processList = [];

  for (line of txt.split(/\r?\n/)) {
    
    if (line.match(/\W*(No[.])\W*/)) {
      let json = await trap.headerTrap(line);
      Object.assign(data, json); 
    }

    if (line.match(/\W*(Tit[.])\W*/)) {
      let json = await trap.holderTrap(line);
      Object.assign(data, json); 
    }
    
    if (line.match(/\W*(Marca)\W*/)) {
      let json = await trap.brandTrap(line);
      brand.name = json;
    }

    if (line.match(/\W*(Procurador[:])\W*/)) {
      let json = await trap.attorneyTrap(line);
      Object.assign(data, json); 
    }

    if (line.match(/\W*(Apres[.])\W*/)) {
      let json = await trap.presentationTrap(line);
      brand.presentation = json.presentation;
      brand.name = json.name;
    }

    if (line.match(/\W*(CFE[(])\W*/)) {
      
      let json = await trap.classViennaTrap(line)
      Object.assign(data,json);
    }

    if (line.match(/\W*(NCL[(])\W*/)) {
      
      let json = await trap.listNiceClassTrap(line)
      Object.assign(data,json);
    }
    
    if (line.match(/\W*(Clas.Prod\/Serv:)\W*/)) {
      let json = await trap.nationalClassTrap(line);
      Object.assign(data,json);
    }

    if (line.match(/\W*(Prior[.][:])\W*/)) {
      let json = await trap.unionistPriorityTrap(line);
      Object.assign(data,json);
    }

    if (line.match(/\W*(Apostila[:])\W*/)) {
      let json = await trap.handoutTrap(line);
      Object.assign(data,json);
    }

    if (line.length === 0 && data.hasOwnProperty('processNumber')) {
      data.magazineDate = moment(magazineDate, 'DD/MM/YYYY').format('YYYY/MM/DD');
      data.magazineNumber = magazineNumber;
      data.brand = brand;

      processList.push(data);
      data = new Object;
    }
  }

  for ( let proc of processList) {
    await InpiDbTools().createBrand(proc);
    debug.info(`processo ${proc.processNumber} migrado`);
  }

  await InpiDbTools().createPublication({
    magazineNumber: magazineNumber,
    magazineDate: moment(magazineDate, 'DD/MM/YYYY').format('YYYY/MM/DD'),
  });
  debug.info(`revista ${magazineNumber} publicada`);
};

