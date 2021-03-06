const Debug = require('../../../../libs/Dialogs/Debug/Debug');
const h = require('../../../../libs/helpers');
const InpiDbTools = require('../libs/inpiDbTools');
const moment = require('moment');

/**
 * @param {brand} magazine
 * @description configure and save data in the bank
 * @return {void}
 */

module.exports = async function (magazine) {
  const number = magazine['numero'];
  const date = magazine['data'];

  const process = magazine['processo'];
  const debug = new Debug();

  debug.log(`magazine ${number}, ${date}`);

  for (let doc of process) {
    let data = {
      magazineNumber: number,
      magazineDate: moment(date, 'DD/MM/YYYY').format('YYYY/MM/DD'),
      processNumber: doc.numero,
      attorney: doc.procurador,
    };

    if (doc.hasOwnProperty('data-deposito')) {
      data.depositDate = moment(doc['data-deposito'], 'DD/MM/YYYY').format(
        'YYYY/MM/DD'
      );
    }

    if (doc.hasOwnProperty('data-concessao')) {
      data.grantDate = moment(doc['data-concessao'], 'DD/MM/YYYY').format(
        'YYYY/MM/DD'
      );
    }

    if (doc.hasOwnProperty('data-vigencia')) {
      data.effectiveDate = moment(doc['data-vigencia'], 'DD/MM/YYYY').format(
        'YYYY/MM/DD'
      );
    }

    if (doc.hasOwnProperty('marca')) {
      let brand = doc.marca,
        _brand = {};

      if (brand.hasOwnProperty('nome')) _brand.name = brand.nome;

      if (brand.hasOwnProperty('apresentacao'))
        _brand.presentation = brand.apresentacao;

      if (brand.hasOwnProperty('natureza')) _brand.nature = brand.natureza;
      data.brand = _brand;
    }

    if (doc.hasOwnProperty('lista-classe-nice')) {
      let _nice = doc['lista-classe-nice'];

      data.listNiceClass = {};

      if (Array.isArray(_nice['classe-nice'])) {
        data.listNiceClass.niceClass = [];

        for (let nice of _nice['classe-nice']) {
          data.listNiceClass.niceClass.push({
            code: nice.codigo,
            especification: nice.especificacao,
            status: nice.status,
          });
        }
      } else {
        data.listNiceClass.niceClass = {
          code: _nice['classe-nice'].codigo,
          especification: _nice['classe-nice'].especificacao,
          status: _nice['classe-nice'].status,
        };
      }
    }

    if (doc.hasOwnProperty('classes-vienna')) {
      let _vienna = Object.values(doc['classes-vienna']);

      data.viennaClasses = {};
      data.viennaClasses.edition = _vienna[0];

      if (Array.isArray(_vienna[1])) {
        data.viennaClasses.viennaClass = [];
        for (let code of _vienna[1]) {
          data.viennaClasses.viennaClass.push({ code: code['codigo'] });
        }
      } else {
        data.viennaClasses.viennaClass = { code: _vienna[1]['codigo'] };
      }
    }

    if (doc.hasOwnProperty('despachos')) {
      let _dispatch = Object.values(doc['despachos']);

      data.dispatches = {};
      data.dispatches.code = _dispatch[0]['codigo'];
      data.dispatches.name = _dispatch[0]['nome'];

      if (_dispatch[0].hasOwnProperty('texto-complementar')) {
        data.dispatches.description = _dispatch[0]['texto-complementar'];
      }

      if (_dispatch[0].hasOwnProperty('protocolo')) {
        data.dispatches.protocol = {
          number: _dispatch[0].protocolo.numero,
          date: new Date(
            moment(_dispatch[0].protocolo.data, 'DD/MM/YYYY').format(
              'YYYY/MM/DD'
            )
          ),
          serviceCode: _dispatch[0].protocolo.codigoServico,
          attorney: _dispatch[0].protocolo.procurador,
        };

        if (_dispatch[0].protocolo.hasOwnProperty('requerente')) {
          data.dispatches.protocol.applicant = {};

          if (
            _dispatch[0].protocolo.requerente.hasOwnProperty(
              'nome-razao-social'
            )
          ) {
            let _companyName =
              _dispatch[0].protocolo.requerente['nome-razao-social'];
            if (
              typeof _companyName != null &&
              typeof _companyName != 'undefined'
            ) {
              data.dispatches.protocol.applicant.companyName = _companyName;
            }
          }

          if (_dispatch[0].protocolo.requerente.hasOwnProperty('pais')) {
            data.dispatches.protocol.applicant.country =
              _dispatch[0].protocolo.requerente.pais;
          }

          if (_dispatch[0].protocolo.requerente.hasOwnProperty('uf')) {
            data.dispatches.protocol.applicant.state =
              _dispatch[0].protocolo.requerente.uf;
          }
        }
      }
    }

    if (doc.hasOwnProperty('titulares')) {
      if (doc['titulares'].hasOwnProperty('titular')) {
        let _holders = doc['titulares'];
        let holder = new Object();

        if (_holders.titular.hasOwnProperty('nome-razao-social'))
          holder.companyName = _holders.titular['nome-razao-social'];

        if (_holders.titular.hasOwnProperty('pais'))
          holder.country = _holders.titular['pais'];

        if (_holders.titular.hasOwnProperty('uf'))
          holder.state = _holders.titular['uf'];

        data.holders = { holder: holder };
      }
    }

    if (doc.hasOwnProperty('sobrestadores')) {
      let _overstands = doc.sobrestadores;

      data.overstands = {};

      if (Array.isArray(_overstands.sobrestador)) {
        data.overstands.overstand = [];

        for (let _overstand of _overstands.sobrestador) {
          data.overstands.overstand.push({
            process: _overstand.processo,
            brand: _overstand.marca,
          });
        }
      } else {
        data.overstands.overstand = {
          process: _overstands.sobrestador.processo,
          brand: _overstands.sobrestador.marca,
        };
      }
    }

    if (doc.hasOwnProperty('prioridade-unionista')) {
      let _priority = doc['prioridade-unionista'];
      data.unionistPriority = {};

      if (Array.isArray(_priority.prioridade)) {
        data.unionistPriority.priority = [];
        for (let priority of _priority.prioridade) {
          data.unionistPriority.priority.push({
            date: new Date(
              moment(priority.data, 'DD/MM/YYYY').format('YYYY/MM/DD')
            ),
            number: priority.numero,
            country: priority.pais,
          });
        }
      } else {
        data.unionistPriority.priority = {
          date: new Date(
            moment(_priority.prioridade.data, 'DD/MM/YYYY').format('YYYY/MM/DD')
          ),
          number: _priority.prioridade.numero,
          country: _priority.prioridade.pais,
        };
      }
    }

    if (doc.hasOwnProperty('apostila')) {
      data.handout = doc.apostila;
    }

    if (doc.hasOwnProperty('classe-nacional')) {
      let _national = {};
      if (doc['classe-nacional'].hasOwnProperty('codigo')) {
        _national.code = doc['classe-nacional'].codigo;
      }

      if (doc['classe-nacional'].hasOwnProperty('especificacao')) {
        _national.especification = doc['classe-nacional'].especificacao;
      }

      if (doc['classe-nacional'].hasOwnProperty('sub-classes-nacional')) {
        let subNatClass = Object.values(
          doc['classe-nacional']['sub-classes-nacional']
        );

        if (Array.isArray(subNatClass[0])) {
          _national.subNationalClass = [];
          for (let sub of subNatClass[0]) {
            _national.subNationalClass.push({ code: sub.codigo });
          }
        } else {
          _national.subNationalClass = { code: subNatClass[0].codigo };
        }
      }

      data.nationalClass = _national.subNationalClass;
    }

    await InpiDbTools().createBrand(data);
    debug.info(`processo ${doc.numero} migrado`);
  }

  await InpiDbTools().createPublication({
    magazineNumber: number,
    magazineDate: moment(date, 'DD/MM/YYYY').format('YYYY/MM/DD'),
  });

  debug.info(`revista ${number} publicada`);
};
