const express = require('express');
const { router } = require('./router');
const helpers = require('./utils/heleprs');
const { controllersBS } = require('./controllers');

const app = express();

// middleware functions
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(express.json());
app.use(router);
app.use((err, req, res, next) => {
  console.error(`Server error: ${err.message}`);
  res.status(500).json({
    message: `Server error: ${err.message}`,
  });
  next();
});

// Previous requests to build listst

controllersBS.registerAgent();

const port = helpers.getConfig('port');
app.listen(port, (err) => {
  if (err) console.log(`Server didn't launch because of error: ${err}`);
  else console.log(`Server successfully launched on the port: ${port}`);
});
