const winston = require("winston");
const config = require("../config")

const buildProdLogger = () => {
    const prodLogger = winston.createLogger({
      transports: [
        new winston.transports.File({ filename: "src/logs/warn.log", level: "warn", format: winston.format.combine(winston.format.timestamp(), winston.format.json()) }),
        new winston.transports.File({ filename: "src/logs/error.log", level: "error", format: winston.format.combine(winston.format.timestamp(), winston.format.json()) }),
      ],
    });
  
    return prodLogger;
  };
  
  const buildDevLogger = () => {
    const devLogger = winston.createLogger({
      transports: [
        new winston.transports.File({ filename: "src/logs/warn.log", level: "warn", format: winston.format.combine(winston.format.timestamp(), winston.format.json()) }),
        new winston.transports.File({ filename: "src/logs/error.log", level: "error", format: winston.format.combine(winston.format.timestamp(), winston.format.json()) }),
        new winston.transports.Console({ level: "info", format: winston.format.combine(winston.format.timestamp(), winston.format.json()) })
      ],
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