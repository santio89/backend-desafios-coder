require('dotenv').config()
const args = require("yargs/yargs")(process.argv.slice(2)).alias({
    u: 'user',
    p: 'password'
}).default({
    port: 8080
}).argv

module.exports = {
    port: args.port, 
    sessionsecret: process.env.SESSIONSECRET || 'coderproject',
    mongoconnect: process.env.MONGOCONNECT || `mongodb+srv://santi:santi12test@cluster0.pcdnxq9.mongodb.net/ecommerce-node-project?retryWrites=true&w=majority`,
}