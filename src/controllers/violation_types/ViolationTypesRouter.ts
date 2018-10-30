"use strict";

import { CacheRegistry } from "../../registries/CacheRegistry";

import { ViolationTypesController } from "./ViolationTypesController";
import { ControllerRouter } from "../../definitions/ControllerRouter";

/**
 * States Controller Router
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class ViolationTypesRouter extends ControllerRouter {

  private readonly controller: ViolationTypesController;

  constructor(cacheRegistry: CacheRegistry) {
    super();
    this.controller = new ViolationTypesController(cacheRegistry);
    this.addRoutes();
  }

  protected addRoutes(): void {
    this.router.get("/get", this.controller.getViolationTypes);
  }

}