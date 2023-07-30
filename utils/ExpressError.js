class ExpressError extends Error {
  constructor(message, status = 401) {
    super();
    this.message = message;
    this.status = status;
  }
}

module.exports = ExpressError;
