"use strict";

import { CacheRegistry } from "../../registries/CacheRegistry";

import { LotsController } from "./LotsController";
import { ControllerRouter } from "../../definitions/ControllerRouter";

/**
 * States Controller Router
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class LotsRouter extends ControllerRouter {

  private readonly controller: LotsController;

  constructor(cacheRegistry: CacheRegistry) {
    super();
    this.controller = new LotsController(cacheRegistry);
    this.addRoutes();
  }

  protected addRoutes(): void {
    this.router.get("/get", this.controller.getLots);
  }

}