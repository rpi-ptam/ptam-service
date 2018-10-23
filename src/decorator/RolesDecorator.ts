"use strict";

import { Request, Response } from "express";

/**
 * Roles Middleware Decorator
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 *
 * Adding this decorator to an express request-handler enforces than an authenticated user must have a matching role
 * in order to access the underlying route
 *
 * @param roles {Array<string>} containing the roles necessary to access the decorated-route.
 * @return {Function}
 */
export function roles(...roles: Array<string>): Function {
  void (roles);
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(req: Request, res: Response) => any>) {
    void (target);
    void (propertyKey);
    let method = descriptor.value;
    descriptor.value = function (req: Request, res: Response) {
      // void (req);
      // res.status(401).json({ success: false, error: "UNAUTHORIZED" });
      // return;

      if (method)
        return method.apply(this, [req,res]);
    };
  }
}