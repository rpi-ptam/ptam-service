"use strict";

import { Request, Response } from "express";
import {CacheRegistry} from "../registries/CacheRegistry";

/**
 * Roles Middleware Decorator
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 *
 * Adding this decorator to an express request-handler enforces than an authenticated user must have a matching role
 * in order to access the underlying route
 *
 * @param roles {Array<string>} containing the Roles necessary to access the decorated-route.
 * @return {Function}
 */
export function Roles(...roles: Array<string>): Function {
  void (roles);
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(req: Request, res: Response) => any>) {
    void (target);
    void (propertyKey);
    let method = descriptor.value;
    descriptor.value = function (req: Request, res: Response) {
      /* TODO: Verify Actual User Role! */
      const userRoleId = 3;

      const cacheRegistry: CacheRegistry = req.app.get("cacheRegistry");
      const userRoleName = cacheRegistry.rolesCache.getByKey(userRoleId);

      /* If the user's role is not defined or not in the specified in the array, they are not authorized */
      if (!userRoleName || !roles.includes(userRoleName)) {
        res.status(401).json({ success: false, error: "UNAUTHORIZED" });
        return;
      }

      /* Otherwise, continue executing the method */
      if (method)
        return method.apply(this, [req,res]);
    };
  }
}