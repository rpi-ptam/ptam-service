"use strict";

import { CacheRegistry } from "../../registries/CacheRegistry";
import { ControllerRouter } from "../../definitions/ControllerRouter";

import { VerdictsController } from "./VerdictsController";

/**
 * Verdicts Controller Router
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class VerdictsRouter extends ControllerRouter {

  private readonly controller: VerdictsController;

  constructor(cacheRegistry: CacheRegistry) {
    super();
    this.controller = new VerdictsController(cacheRegistry);
    this.addRoutes();
  }

  protected addRoutes(): void {
    this.router.get("/get", this.controller.getVerdicts);
  }

}