import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { consoleFormat } from 'winston-console-format'

const daily_rotate_error_file_transport = new DailyRotateFile({
	level: 'error',
	filename: 'logs/%DATE%-error.log',
	datePattern: 'YYYY-MM-DD',
	// zippedArchive: true,
	maxSize: '20m',
	maxFiles: '14d',
})

const daily_rotate_file_transport = new DailyRotateFile({
	level: 'http',
	filename: 'logs/%DATE%.log',
	datePattern: 'YYYY-MM-DD',
	// zippedArchive: true,
	maxSize: '20m',
	maxFiles: '14d',
})

const console_transport = new transports.Console({
	format: format.combine(
		format.colorize({ all: true }),
		// format.timestamp(),
		format.padLevels(),
		consoleFormat({
			showMeta: true,
			metaStrip: ['timestamp', 'service'],
			inspectOptions: {
				depth: Infinity,
				colors: true,
				maxArrayLength: Infinity,
				breakLength: 120,
				compact: Infinity,
			},
		})
	),
})

export const logger = createLogger({
	level: 'debug',
	format: format.combine(
		// format.timestamp(),
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss.SSS',
		}),
		// format.ms(),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	defaultMeta: { service: 'talk' },
	transports: [
		daily_rotate_error_file_transport,
		daily_rotate_file_transport,
		// new transports.File({ filename: 'error.log', level: 'error' }),
		// new transports.File({ filename: 'combined.log' }),
		console_transport,
	],
})
