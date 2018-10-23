"use strict";

import { ControllerRouter } from "../../definitions/ControllerRouter";

import { CacheRegistry } from "../../registries/CacheRegistry";
import { RepositoryRegistry } from "../../registries/RepositoryRegistry";

import { AppealsController } from "./AppealsController";

/**
 * Appeals-Controller Router
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class AppealsRouter extends ControllerRouter {

  private readonly controller: AppealsController;

  constructor(repoRegistry: RepositoryRegistry, cacheRegistry: CacheRegistry) {
    super();
    this.controller = new AppealsController(repoRegistry, cacheRegistry);
    this.addRoutes();
  }

  protected addRoutes(): void {
    this.router.post("/create", this.controller.createAppeal);
  }

}