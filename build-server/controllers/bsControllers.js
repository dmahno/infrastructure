const storage = require('../storage');
const bsControllers = {
  // Получения настроек текущего репозитория (repoName и buildCommand)
  async registerAgent(req, res) {
    const message = storage.registerAgent(req.body)
      ? 'Build agent successfully registered'
      : 'Can not register build agent with such url. It already exists';
    res.status(200).json({
      message: message,
    });
  },
};

module.exports = bsControllers;
