import jwt from "jsonwebtoken";

import { AuthorizedRequest } from "../definitions/AuthorizedRequest";

import { KeyStore } from "../stores/KeyStore";
import { NextFunction, Response } from "express";
import bind from "bind-decorator";

export class AuthorizationMiddleware {

  private readonly keyStore: KeyStore;

  constructor(keyStore: KeyStore) {
    this.keyStore = keyStore;
  }

  @bind
  public async verifyToken(req: AuthorizedRequest, res: Response, next: NextFunction): Promise<void> {
    if (!req.cookies.hasOwnProperty("x-access-token")) {
      res.status(401).json({ success: false, error: "UNAUTHORIZED" });
      return;
    }
    try {
      const token = req.cookies["x-access-token"];
      const verifiedToken: any = await jwt.verify(token, this.keyStore.jwtPublicKey, {algorithms: [this.keyStore.algorithm]});
      req.user = verifiedToken.user;
      next();
    }
    catch (error) {
      console.error(error);
      res.clearCookie("x-access-token");
      res.status(401).json({ success: false, error: "UNAUTHORIZED" });
    }
  }


}