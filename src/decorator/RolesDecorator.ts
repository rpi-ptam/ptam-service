"use strict";

import { Response } from "express";
import { CacheRegistry } from "../registries/CacheRegistry";
import { AuthorizedRequest } from "../definitions/AuthorizedRequest";

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
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(req: AuthorizedRequest, res: Response) => any>) {
    void (target);
    void (propertyKey);
    let method = descriptor.value;
    descriptor.value = async function (req: AuthorizedRequest, res: Response) {
      const userRoleId = req.user.role_id;

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