
import {transports, createLogger, format} from 'winston';

const logLevel = process.env.LOG_LEVEL || 'debug';


export const logger = createLogger({
    format: format.combine(
        format.timestamp({format:'MMMM DD, YYYY HH:mm:ss'}),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console({
            stderrLevels: ['error', 'critical','info','warn','debug'],
            level: logLevel
        })
    ]
});

export default logger
