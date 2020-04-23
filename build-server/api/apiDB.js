const https = require('https');
const axios = require('axios');
const helpers = require('../utils/helpers');

const config = helpers.getConfig();
const axiosAPI = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    Authorization: 'Bearer ' + config.apiToken,
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const apiDB = {
  // getting repo settings - to senf build-agent the name of repo and command of build
  async getSettings() {
    return await axiosAPI.get('/conf');
  },

  // getting the list of buids
  async getBuildsList() {
    return await axiosAPI.get('/build/list');
  },

  // Add the Progress status
  async startBuild(params) {
    return await axiosAPI.post('/build/start', params);
  },

  // Add the Success status
  async finishBuild(params) {
    return await axiosAPI.post('/build/finish', params);
  },
};

module.exports = apiDB;
