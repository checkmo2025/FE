export class ApiError extends Error {
  code: string;
  response?: any;

  constructor(message: string, code: string = "UNKNOWN_ERROR", response?: any) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.response = response;
  }
}
