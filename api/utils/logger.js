const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

// Fonction de filtrage pour n'inclure que les niveaux "info" et inférieurs
const infoFilter = format((info) => {
    return info.level === 'info' ? info : false;
});

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message, ...meta }) => {
            const metaString = Object.keys(meta).length ? JSON.stringify(meta) :  '';
            return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaString}`;
        })
    ),
    transports: [
        new DailyRotateFile({
            filename: path.join(__dirname, '../logs/error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            //maxFiles: 
        }),
        new DailyRotateFile({
            filename: path.join(__dirname, '../logs/success-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            format: format.combine(infoFilter())
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.printf(({ level, message }) => `[${level.toUpperCase()}]: ${message}`)
        )
    }));
}

module.exports = logger;