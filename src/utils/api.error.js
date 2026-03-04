class ApiError extends Error {
  constructor({ statusCode, message = "Something went wrong", errors = [] }) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.data = null;
  }
  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      success: this.success,
      errors: this.errors,
    };
  }
}
export { ApiError };
