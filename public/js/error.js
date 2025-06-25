class NotImplementedException extends Error {
    constructor(message = "Method or function not implemented") {
        super(message);
        this.name = "NotImplementedError"
    }
}