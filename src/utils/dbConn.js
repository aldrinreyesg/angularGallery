// var config = require('config');
var fs = require("fs");

function dbSting(env) {
    var conn;
    var str = "mongodb://angall:WrwNtjEp1RWHENlI@";
    var contents = fs.readFileSync("./app/config/default.json");
    var config = JSON.parse(contents);
    if('development' == env) {
        var dev = config.development;
        for (server in dev.servers)
        {
            str = str + dev.servers[server].host + ':' + dev.servers[server].port + ',';
        }

        str = str.substr(0,str.length-1) + '/' +
            dev.connection.dbName +
            '?ssl=' + dev.connection.ssl +
            '&replicaSet=' + dev.connection.replicaSet +
            '&authSource=' + dev.connection.authSource +
            '&retryWrites=' + dev.connection.retryWrites;
    }else{
        var env = config.local;
        // conn = config.get('local');
    }
    return str;
}

module.exports = dbSting;