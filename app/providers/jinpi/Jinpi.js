const qs = require('querystring');
const InpiTools = require('./libs/inpiTools');
const InpiDbTools = require('./libs/inpiDbTools');
const Dialog = require('./JinpiDialog');
const Debug = require('../../../libs/Dialogs/Debug/Debug');
const parser = require('xml2json');
const h = require('../../../libs/helpers');
const iconv = require('iconv');
const xmlFilter = require('./filters/xmlFilter');
const txtFilter = require('./filters/txtFilter');

const Jinpi = function () {

  /**
   * @constant _vm
   * @type  {Object}
   * @description stores global scope data
   */
  const _vm = this;

  return {

    /**
     * @param {Object} config
     * @return {Object} _vm.url
     * @description set the date to download the inpi data list.
     */
    setDate: (config) => {

      /**
       * @constant config
       * @type {Object}
       * @description stores date data in an argument list
       */
      const { startDate, endDate } = config;

      return _vm.url = {
        host: 'http://revistas.inpi.gov.br',
        path: '/rpi/busca/data?',
        startDate: 'revista.dataInicial=' + qs.escape(config.startDate) + '&',
        endDate: 'revista.dataFinal=' + qs.escape(config.endDate) + '&',
        type: 'revista.tipoRevista.id=5',
      };
    },

    /**
     * @param {void}
     * @description update inpi brand magazines.
     */
    update: async function () {
      const inpiTools = new InpiTools();
      const inpiDb = new InpiDbTools();
      const debug = new Debug;
      const list = await inpiTools.getList(Object.values(_vm.url).join(''));
      try {

        if (!_vm.hasOwnProperty('url')) throw new Error('url is not set');

        Dialog();

        for (let prop in list) {
          if (list[prop].hasOwnProperty('nomeArquivoEscritorio')) {
            if (!await inpiDb.has(list[prop].numero)) {

              let zippedFile = await inpiTools.getFile(
                _vm.url.host + '/txt/' + list[prop].nomeArquivoEscritorio);
              let file = await h.unzip(zippedFile);

              switch (file.ext) {
                case 'xml':
                  let xmlMagazine = JSON.parse(
                    parser.toJson(file.buffer.toString()));
                  await xmlFilter(xmlMagazine.revista);
                  break;
                case 'txt':
                  let txtMagazine = file.buffer.toString('utf-8');
                  await txtFilter(txtMagazine, list[prop].dataPublicacao,
                    list[prop].numero);
                  break;
              }

            } else {
              debug.warn('ignorando revista ' + list[prop].numero +
                ' revista ja esta publicada');
            }
          }
        }

        debug.info('big data atualizado');
      } catch (error) {
        debug.warn(error);
      }
    },
  };
};

module.exports = Jinpi;