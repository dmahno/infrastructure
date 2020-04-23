const { registerAgent, sendBuildResults } = require('../api');

// if there is no responce from build-server we will keep on asking with short and after that we will try to ask with long intervals

let currentApiErrors = 0; // current errors
const maxApiErrors = 2; // max errros
const shortInterval = 2000; // short interval of requests
const longInterval = 10000; // long interval of requests

const controllersBS = {
  async registerAgent() {
    if (await registerAgent()) {
      currentApiErrors = 0;
    } else {
      currentApiErrors++;
      const interval =
        currentApiErrors <= maxApiErrors ? shortInterval : longInterval;
      console.log(`Next try in an ${interval} ms`);
      setTimeout(controllersBS.registerAgent, interval);
    }
  },

  async sendBuildResults(params) {
    if (await sendBuildResults(params)) {
      currentApiErrors = 0;
    } else {
      currentApiErrors++;
      const interval =
        currentApiErrors <= maxApiErrors ? shortInterval : longInterval;
      console.log(`Next try in an ${interval} ms`);
      setTimeout(controllersBS.sendBuildResults.bind(null, params), interval);
    }
  },
};

module.exports = controllersBS;
