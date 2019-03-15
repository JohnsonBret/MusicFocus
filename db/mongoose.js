var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose: mongoose
}

// MongoDB - local server running info - get into below directory
// D:\Program Files\MongoDB\Server\4.0\bin
// Run mongod command with the path below - port optional
// mongod --dbpath /data/<path> --port <port no> 
// D:\mongo-data