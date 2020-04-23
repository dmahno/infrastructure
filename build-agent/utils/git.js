const path = require('path');
const helpers = require('./heleprs');

const localRepos = '_localRepos';

const cloneRepo = async (repoName) => {
  const repoUrl = `git@github.com:${repoName}.git`;
  const repoLocalDir = path.resolve(process.cwd(), localRepos, repoName);
  // checking if there is mentioned repo on github
  try {
    await helpers.exec(`git ls-remote ${repoUrl}`);
    console.log(`Git repo ${repoUrl} exist`);
  } catch (err) {
    console.error(
      `Can't check if repo ${repoUrl} exists because of error: `,
      err.message
    );
  }
  // checking if there is a local folder with cloned repo
  if (await isLocalRepoExist(repoLocalDir)) {
    // if it's true we pull updates
    try {
      await helpers.exec(`git pull origin master`, { cwd: repoLocalDir });
      console.log(`Changes for git repo ${repoUrl} successfully pulled`);
    } catch (err) {
      console.error(
        `Can't pull changes for git  repo ${repoUrl} because of error: `,
        err.message
      );
    }
  } else {
    // if it's false we clone repo to local folder on the server
    try {
      await helpers.exec(`git clone ${repoUrl} ${repoLocalDir}`);
      console.log(`Git repo ${repoUrl} successfully cloned`);
    } catch (err) {
      console.error(
        `Can't clone repository ${repoUrl} because of error: `,
        err.message
      );
    }
  }
};

const isLocalRepoExist = async (dir) => {
  try {
    const stat = await helpers.stat(dir);
    return stat.isDirectory();
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      console.error(e);
    }
  }
};

const makeBuild = async (repoName, commitHash, buildCommand) => {
  const repoLocalDir = path.resolve(process.cwd(), localRepos, repoName);

  try {
    await helpers.exec(`git checkout ${commitHash}`, { cwd: repoLocalDir });
    console.log(`Successfully checkout to commit with hash ${commitHash}`);
  } catch (err) {
    console.log(
      `Can't checkout to commit with hash ${commitHash} because of error: `,
      err.message
    );
  }

  try {
    await helpers.exec(`npm i`, { cwd: repoLocalDir });
    console.log(
      `Successfully installed npm-dependencies for commit with hash ${commitHash}`
    );
  } catch (err) {
    console.log(
      `Can't install npm-dependencies for commit with hash ${commitHash} because of error: `,
      err.message
    );
  }

  try {
    const result = await helpers.exec(`${buildCommand}`, { cwd: repoLocalDir });
    console.log(`Successfully apply build command ${buildCommand}`);
    return result;
  } catch (err) {
    console.log(
      `Can't apply build command ${buildCommand} because of error: `,
      err.message
    );
  }
};

module.exports = { cloneRepo, makeBuild };
