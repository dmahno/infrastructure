const { apiDB } = require('../api');
const controllersDB = {
  async getInitialData() {
    try {
      // previous requests for build list
      const [responseSettings, responseBuildsList] = await Promise.all([
        controllersDB.getSettings(),
        controllersDB.getBuildsList(),
      ]);
      if (
        responseBuildsList.data.data.some((build) => build.status === 'Waiting')
      ) {
        console.log('Repo settings and build list successfully got');
        return [responseSettings, responseBuildsList];
      } else {
        console.log(`There are no builds with status Waiting in buildsList`);
        return false;
      }
    } catch (err) {
      console.error(err.message);
      return false;
    }
  },

  // getting settongs of current repo (repoName и buildCommand)
  async getSettings() {
    try {
      return await apiDB.getSettings(); // get the name and build command
    } catch (err) {
      throw new Error(
        `Can't get Repo Settings because of error: ${err.message}`
      );
    }
  },

  // Getting the list of builds
  async getBuildsList() {
    try {
      return await apiDB.getBuildsList();
    } catch (err) {
      throw new Error(`Can't get Builds List because of error: ${err.message}`);
    }
  },

  async startBuild(params) {
    try {
      await apiDB.startBuild(params);
      console.log(
        `Build ${params.buildId} successfully started in DB at ${params.dateTime}`
      );
      return true;
    } catch (err) {
      console.error(
        `Can't start build in DB because of an Error: ${err.message}`
      );
      return false;
    }
  },

  async finishBuild(params) {
    try {
      await apiDB.finishBuild(params);
      console.log(`Build ${params.buildId} successfully finished in DB`);
      return true;
    } catch (err) {
      console.error(
        `Can't finish build in DB because of an Error: ${err.message}`
      );
      return false;
    }
  },
};

module.exports = controllersDB;
