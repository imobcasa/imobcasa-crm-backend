const { default: axios } = require("axios");

const { isAxiosError } = require('axios').default


const AxiosException = (err) => {
  return isAxiosError(err)
}

module.exports = AxiosException