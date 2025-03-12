class Logger {
  info(message) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  }

  error(message, error) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  }

  warning(message) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  }

  debug(message) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`);
    }
  }
}

module.exports = new Logger(); 