import { StatusCode } from "@hono/hono/utils/http-status";

export class HttpError extends Error {
  public status: StatusCode;

  constructor(status: StatusCode, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
