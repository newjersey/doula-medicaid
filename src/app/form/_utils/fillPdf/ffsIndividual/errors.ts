export class UnexpectedFormDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnexpectedFormDataError";
  }
}
