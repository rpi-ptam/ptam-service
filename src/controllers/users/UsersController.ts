import { Response } from "express";

import { CacheRegistry } from "../../registries/CacheRegistry";
import { RepositoryRegistry } from "../../registries/RepositoryRegistry";
import { AuthorizedRequest } from "../../definitions/AuthorizedRequest";
import {Logger} from "../../services/Logger";
import bind from "bind-decorator";

export class UsersController {

  private readonly repoRegistry: RepositoryRegistry;
  private readonly cacheRegistry: CacheRegistry;

  constructor(repoRegistry: RepositoryRegistry, cacheRegistry: CacheRegistry) {
    this.repoRegistry = repoRegistry;
    this.cacheRegistry = cacheRegistry;
  }

  @bind
  public async getOwnInfo(req: AuthorizedRequest, res: Response) {
    const { usersRepository } = this.repoRegistry;
    try {
      if (!req.user) throw Error("token mismatch");

      const user = await usersRepository.getById(req.user.id);
      if (!user) {
        Logger.error("Breach Detected: Non-existent user with valid token", req.user);
        res.status(401).json({ success: false, error: "UNAUTHORIZED" });
        req.clearCookie("x-access-token");
        return;
      }
      const role = this.cacheRegistry.rolesCache.getByKey(user.role_id);
      const friendlyUser = {
        ...user,
        role,
        id: undefined,
        role_id: undefined
       };
      res.status(200).json( { success: true, user: friendlyUser })
    }
    catch (error) {
      res.status(500).json({ success: false, error: "INTERNAL_ERROR" });
    }
  }

}