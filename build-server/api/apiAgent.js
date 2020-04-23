const axios = require('axios').default;

const apiAgent = {
  // getting the build list
  async startBuild(url, params) {
    return await axios.post(url, params);
  },
};

module.exports = apiAgent;
