"use strict";

import { Router } from "express";

export abstract class ControllerRouter {

  public readonly router: Router;

  protected constructor() {
    this.router = Router();
  }

  protected abstract addRoutes(): void;

}
