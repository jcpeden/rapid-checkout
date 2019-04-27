import { logger } from './logger'
import { env } from './env'
import mongoose from 'mongoose'

const connString = env.MONGODB
let retry = 0

export function createDatabase() {
  logger.debug('Creating database...')

  mongoose.connect(
    connString,
    {
      useCreateIndex: true,
      autoIndex: true,
      reconnectTries: 100
    }
  )

  // callback after MongoDB was connected, we just show a log message here
  mongoose.connection.on('connected', function() {
    logger.debug('Mongoose default connection open to ' + connString)
  })

  // callback after any error occurred by MongoDB, we just show a log message here
  mongoose.connection.on('error', function(err) {
    logger.debug('Mongoose default connection error: ' + err)
    if (retry <= 5) {
      setTimeout(() => {
        createDatabase();
        retry++
      }, 5000)
    }
  })

  // callback after MongoDB was disconnected, we just show a log message here
  mongoose.connection.on('disconnected', function() {
    logger.debug('Mongoose default connection disconnected')
  })

  // close MongoDB connection after current server process was terminated
  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      logger.debug('Mongoose default connection closed through app termination')
      process.exit(0)
    })
  })
}
