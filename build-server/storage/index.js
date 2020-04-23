const controllersDB = require('../controllers/controllersDB');
const controllersAgent = require('../controllers/controllersAgent');

// the information which is keeping in builds

class Storage {
  constructor() {
    this.buildsList = [];
    this.waitingBuilds = null;
    this.agents = [];
    this.interval = 5000; // the interval of repeating for searching free build agents
  }

  async getInitialData() {
    const response = await controllersDB.getInitialData();
    if (response) {
      this.updateStore(response);
      await this.searchAgent();
    } else {
      console.log('Next try in an 10000 ms');
      setTimeout(this.getInitialData.bind(this), 10000);
    }
  }

  updateStore([responseSettings, responseBuildsList]) {
    this.settings = responseSettings.data.data;
    this.buildsList = responseBuildsList.data.data.filter((build) =>
      ['Waiting', 'InProgress'].includes(build.status)
    );
    this.waitingBuilds = responseBuildsList.data.data.filter(
      (build) => build.status === 'Waiting'
    ).length;
  }

  registerAgent({ host, port }) {
    const url = `${host}:${port}`;
    // if there is no such agent we register it
    if (this.agents.some((agent) => agent.url === url)) {
      return false;
    } else {
      this.agents.push({
        url: `${host}:${port}/build`,
        isFree: true,
      });
      console.log(
        'Build agent: ',
        `${host}:${port}`,
        'successfully registered'
      );
      return true;
    }
  }

  // looking for buildId
  updateAgentStatus(buildId, isFree) {
    const agent = this.agents.find(
      (agent) => (agent.buildId = String(buildId))
    );
    agent.isFree = isFree;
    agent.duration = new Date() - agent.dateTime;
    agent.buildId = null;
    agent.dateTime = null;
    return agent.duration;
  }

  updateBuildStatus(buildId, status) {
    const build = this.buildsList.find((build) => build.id === buildId);
    build.status = status;
    status === 'InProgress' && this.waitingBuilds--; // reducing quantity of builds
  }

  async searchAgent(agentNum = 0) {
    // Searching for agents with Free status
    const freeAgents = this.agents.filter((agent) => agent.isFree);
    // If it's true we are trying to set the build
    if (freeAgents.length) {
      console.log('There are free build-agents');
      // if there is no any responce try one more time
      agentNum = agentNum < freeAgents.length ? agentNum : 0;
      const assignedBuild = await this.assignBuildToAgent(freeAgents[agentNum]);
      if (assignedBuild) {
        console.log(
          `Build successfully assigned to build-agent ${freeAgents[agentNum].url}`
        );
        this.startBuildInDB(assignedBuild, freeAgents[agentNum]);
      } else {
        console.log(`Build-agents didn't assigned. Try next free build-agent`);
        // If there is no responce from build - trying to set build to the second agent
        this.searchAgent.bind(this)(agentNum + 1);
      }
    } else {
      // if there is no agents we repeat the search via some interval
      console.log('There is no free build-agents');
      setTimeout(this.searchAgent.bind(this), this.interval);
    }
  }

  async assignBuildToAgent(agent) {
    const builds = this.buildsList.filter(
      (build) => build.status === 'Waiting'
    );
    const build = builds[builds.length - 1]; // take the old one commit
    const params = {
      buildId: build.id,
      commitHash: build.commitHash,
      repoName: this.settings.repoName,
      buildCommand: this.settings.buildCommand,
    };
    agent.buildId = String(build.id); // Safe the agent build id
    agent.isFree = false; // change the status to buisy

    return (await controllersAgent.startBuild(agent.url, params))
      ? build
      : false;
  }

  async startBuildInDB(build, agent) {
    agent.dateTime = new Date();
    this.updateBuildStatus(build.id, 'InProgress');
    const isStarted = await controllersDB.startBuild({
      buildId: agent.buildId,
      dateTime: agent.dateTime.toISOString(),
    });
    if (isStarted) {
      if (this.waitingBuilds) {
        this.searchAgent();
      } else {
        this.getInitialData();
      }
    } else {
      // Trying to receive the answer till the data Base will answer
      setTimeout(this.startBuildInDB.bind(this, build, agent), 2000);
    }
  }

  async finishBuild(params) {
    const isFinish = await controllersDB.finishBuild(params);
    if (!isFinish) setTimeout(this.finishBuild.bind(this, params), 2000);
  }
}

module.exports = new Storage();
