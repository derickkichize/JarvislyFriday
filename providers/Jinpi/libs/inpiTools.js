const request = require('request');

/**
 * @class InpiTools
 * @description inpi support tools
 */
const InpiTools = function () {

  /**
   * @constant _vm
   * @type  {Object}
   * @description stores global scope data
   */
  const _vm = this;

  /**
   * @param {Object} 
   * @return {Promise}
   * @description download data from external urls.
   */
  _vm.get = (config) => {
    const { url, encoding } = config;
    return new Promise(function (resolve, reject) {
      request.get({ url: config.url, encoding: config.encoding },
        function (error, response, body) {
          if (error)
            return reject(error);
          if (response.statusCode != 200)
            return reject(response.statusCode);
          return resolve(body);
        })
    })
  };

  return {

    /**
     * @param {String} 
     * @return {JSON}
     * @description downloads a list of inpi magazines.
     */
    getList: async (url) => { 
      let data = await _vm.get({ url: url, encoding: 'utf-8' });
      return await JSON.parse(data);
    },

    /**
     * @param {String} 
     * @return {Buffer}
     * @description downloads a zipped file magazine archive.
     */
    getFile: async (url) => await _vm.get({ url: url, encoding: null })
  }
}

module.exports = InpiTools;