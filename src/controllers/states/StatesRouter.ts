"use strict";

import { CacheRegistry } from "../../registries/CacheRegistry";

import { StatesController } from "./StatesController";
import { ControllerRouter } from "../../definitions/ControllerRouter";

/**
 * States Controller Router
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export class StatesRouter extends ControllerRouter {

  private readonly controller: StatesController;

  constructor(cacheRegistry: CacheRegistry) {
    super();
    this.controller = new StatesController(cacheRegistry);
    this.addRoutes();
  }

  protected addRoutes(): void {
    this.router.get("/get", this.controller.getStates);
  }

}