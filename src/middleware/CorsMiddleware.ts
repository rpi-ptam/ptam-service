import cors from "cors";

import { Application } from "express";

/**
 * CORS Protection Middleware
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class CorsMiddleware {

  private readonly allowedDomains: Array<string>;
  private readonly debug: boolean;

  constructor(debug: boolean, allowedDomains: Array<string>) {
    this.debug = debug;
    this.allowedDomains = allowedDomains;
  }

  private getCorsOptions() {
    const debug = this.debug;
    const allowedDomains = this.allowedDomains;
    return {
      origin: function (domain: string, next: Function) {
        if (allowedDomains.includes(domain) || (debug && !domain)) {
          next(null, true);
        }
        else {
          next(new Error("CORS Policy Violation"))
        }
      }
    }
  }

  public addOriginProtection(app: Application) {
    app.use(cors(this.getCorsOptions()));
  }

}
