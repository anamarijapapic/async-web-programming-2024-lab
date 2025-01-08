class CustomError extends Error {
  constructor(status, message, ...params) {
    super(...params);
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;
  }
}
module.exports = CustomError;
