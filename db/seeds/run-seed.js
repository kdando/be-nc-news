//Runs the seed functions with DEV DATABASE specifically. To seed with test data require and invoke seed() with it elsewhere.

const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
