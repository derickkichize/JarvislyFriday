const Debug = require('../../../../libs/Dialogs/Debug/Debug');
const h = require('../../../../libs/helpers');
const InpiDbTools = require('../libs/inpiDbTools');
const moment = require('moment');

module.exports = async function (txt, magazineDate, magazineNumber) {
  const debug = new Debug();
  for (let doc of txt.split(/\r?\n/)) {

    let data = {
      magazineNumber: magazineNumber,
      magazineDate:  moment(magazineDate,'DD/MM/YYYY').format('YYYY/MM/DD'),
      processNumber: '',
      brand: new Object
    };

    if (doc.match(/\W*(No[.])\W*/)) {
      let sp = doc.split(" ");
      let depositDate = sp[2];
      let processNumber = await sp[0].replace(/\D+/g, '');
      let dispatchCode = sp[4];
      data.depositDate =  moment(depositDate,'DD/MM/YYYY').format('YYYY/MM/DD');
      data.processNumber = await processNumber.toString();
      data.dispatch = { code: dispatchCode };
    }

    if (doc.match(/\W*(Tit[.])\W*/)) {
      let sp = doc.split(" ");
      sp.splice(0, 1);
      data.holders = { holder: sp.join(' ') }
    }

    if (doc.match(/\W*(Marca)\W*/)) {
      let sp = doc.split(" ");
      sp.splice(0, 1);
      data.brand.name = sp.join(' ');
    }

    if (doc.match(/\W*(Apres[.])\W*/)) {
      let sp = doc.split(';');
      data.brand.presentation = sp[0].replace(/\W*(Apres.:)\W*/g, '');
      data.brand.nature = sp[1].replace(/\W*(Nat.:)\W*/g, '');
    }

    if (doc.match(/\W*(CFE[(])\W*/)) {
      let sp = doc.split(" "),
        vienna = { edition: sp[0].match(/[0-9]/)[0] };

      sp.splice(0, 1);

      if (sp.length < 2) {
        vienna.viennaClass = { code: sp.toString() };
      } else {
        vienna.viennaClass = [];
        for (let i of sp) {
          vienna.viennaClass.push({ code: i });
        }
      }
      data.viennaClass = vienna;
    }

    if (doc.match(/\W*(NCL[(])\W*/)) {
      let sp = doc.split(' ');
      sp.splice(0, 1);
      let code = sp[0];
      sp.splice(0, 1);
      let especification = sp.join(' ');

      data.listNiceClass = { niceClass: { code: code, especification: especification } };
    }

    if (doc.match(/\W*(Clas.Prod\/Serv:)\W*/)) {
      let formatedItem = doc.replace(/[^A-Za-z0-9. ]/g, ''),

        sp = formatedItem.split(' ').filter(n => n !== '');
      sp.splice(0, 1);

      let _natCode = sp.join('.').split('.');
      let code = _natCode[0];
      let subNatCode = _natCode.filter(n => n != code)

      if (subNatCode.length < 2) {
        subNatCode = { code: subNatCode[0] }
      } else {
        let _subNat = [];

        for (let sub of subNatCode) {
          _subNat.push({ code: sub })
        }

        subNatCode = _subNat;
      }

      data.nationalClass = {
        code: code,
        subNationalClass: subNatCode
      };
    }

    if (doc.match(/\W*(Procurador[:])\W*/)) {
      data.attorney = doc.replace(/\W*(Procurador[:])\W*/g, '');
    }

    if (doc.match(/\W*(Prior[.][:])\W*/)) {
      let sp = doc.split(' ').filter(n => n !== ''),

        requestNumber = sp[0].replace(/[a-zA-z.:]/g, '');
      requestDate = sp[1];
      country = sp[2];

      let unionistPriority = {
        RequestDate: requestDate,
        RequestNumber: requestNumber,
        Country: country
      };

      data.unionistPriority = unionistPriority;
    }

    if (doc.match(/\W*(Apostila[:])\W*/)) {
      data.handout = doc.replace(/\W*(Apostila:)\W*/g, '');
    }

    await InpiDbTools().createBrand(data);
    debug.info(`processo ${doc.numero} migrado`);
  }

  await InpiDbTools().createPublication({
    magazineNumber: magazineNumber,
    magazineDate: moment(magazineDate, 'DD/MM/YYYY').format('YYYY/MM/DD'),
  });
}