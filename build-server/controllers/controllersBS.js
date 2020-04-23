const storage = require('../storage');
// const controllersDB = require('./controllersDB');

const controllersOfBuildServer = {
  // Gettign settings of (repoName и buildCommand)
  async registerAgent(req, res) {
    const message = storage.registerAgent(req.body)
      ? 'Build agent successfully registered'
      : 'Can not register build agent with such url. It already exists';
    res.status(200).json({
      message: message,
    });
  },

  // Getting the build list
  async getBuildResult(req, res) {
    let { buildId, status, log } = req.body;

    console.log(
      `Result of build ${buildId} successfully got with status ${status}`
    );
    res.status(200).json({
      message: 'Result of build successfully got',
    });

    const buildDuration = storage.updateAgentStatus(buildId, true); // clear agent
    storage.updateBuildStatus(buildId, status ? 'Success' : 'Fail'); // updating the status in local storage
    await storage.finishBuild({
      buildId,
      success: status,
      buildLog: log,
      duration: buildDuration,
    }); // updating status in api dataBase
  },
};

module.exports = controllersOfBuildServer;
