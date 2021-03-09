const iex = require('iexcloud_api_wrapper');
const fincal = require("fincal");

function searchSecurity() {
  iex.Quote()
}

module.exports = { iex, fincal, searchSecurity};