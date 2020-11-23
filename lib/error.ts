const ERROR_NAME = 'ParsingError';
export class ParsingError extends Error {
  private date: Date;
  constructor(...params: any[]) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParsingError);
    }

    this.name = ERROR_NAME;
    // Custom debugging information
    this.date = new Date();
  }
}
