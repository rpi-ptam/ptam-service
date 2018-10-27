"use strict";

import { CacheRegistry } from "../../registries/CacheRegistry";

import { ControllerRouter } from "../../definitions/ControllerRouter";
import {RepositoryRegistry} from "../../registries/RepositoryRegistry";
import {UsersController} from "./UsersController";

/**
 * Users Controller Router
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class UsersRouter extends ControllerRouter {

  private readonly controller: UsersController;

  constructor(repoRegistry: RepositoryRegistry, cacheRegistry: CacheRegistry) {
    super();
    this.controller = new UsersController(repoRegistry, cacheRegistry);
    this.addRoutes();
  }

  protected addRoutes(): void {
    this.router.get("/self/get", this.controller.getOwnInfo);
  }

}