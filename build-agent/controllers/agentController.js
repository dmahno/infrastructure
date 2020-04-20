const agentControllers = {
  async startBuild(req, res) {
    const message = `Build agent successfully got the build ${req.body.buildId}`;
    console.log(message);
    res.status(200).json({
      message: message,
    });
  },
};

module.exports = agentControllers;
