// Defining Express Error Class

class ExpressError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.statusCode = status;
    }
}

module.exports = ExpressError;

