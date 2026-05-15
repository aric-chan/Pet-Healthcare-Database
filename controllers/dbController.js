const { testOracleConnection } = require('../services/db');

async function checkDbConnection(req, res) {
    const isConnect = await testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
}

module.exports = { checkDbConnection };