import winston from "winston";


 export const logger=winston.createLogger(
    { level:'info',
    format:winston.format.json(),
    defaultMeta:{service:'request-logging'},
    transports:[
        new winston.transports.File({filename:'logs.txt'})
    ]

    }
);

const loggerMiddleware = async (
    req, 
    res, 
    next
) => { 

    console.log("Request Headers:", req.headers);
    // 1. Log request body.
    if (!req.url.includes("signin") && !req.url.includes("signup")) {

        const timeNow = new Date();

        const logData = `${req.url} - ${JSON.stringify(req.body)} - ${timeNow}`;
        console.log("Log Data:", logData);
    
        logger.info(logData);
      }
      next();
};
    
export default loggerMiddleware;
