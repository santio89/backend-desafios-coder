const winston = require("winston");
const config = require("../config")

const buildProdLogger = () => {
    const prodLogger = winston.createLogger({
      transports: [
        new winston.transports.File({ filename: "src/logs/debug.log", level: "debug" }),
        new winston.transports.File({ filename: "src/logs/error.log", level: "error" }),
      ],
    });
  
    return prodLogger;
  };
  
  const buildDevLogger = () => {
    const devLogger = winston.createLogger({
      transports: [new winston.transports.Console({ level: "info" })],
    });
  
    return devLogger;
  };
  
  let logger;
  
  if (config.node_env && config.node_env.toLocaleUpperCase() === "PROD") {
    logger = buildProdLogger();
  } else {
    logger = buildDevLogger();
  }
  
 module.exports = logger;