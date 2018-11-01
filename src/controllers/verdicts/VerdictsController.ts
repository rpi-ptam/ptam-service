"use strict";

import bind from "bind-decorator";
import { Request, Response } from "express";

import { Logger } from "../../services/Logger";
import { CacheRegistry } from "../../registries/CacheRegistry";

export class VerdictsController {

  private readonly cacheRegistry: CacheRegistry;

  constructor(cacheRegistry: CacheRegistry) {
    this.cacheRegistry = cacheRegistry;
  }

  @bind
  public getVerdicts(req: Request, res: Response): void {
    void (req);
    try {
      const verdicts = this.cacheRegistry.verdictsCache.values();
      res.status(200).json({ success: true, verdicts });
    }
    catch (error) {
      Logger.error(error);
      res.status(500).json({ success: false, error: "INTERNAL_ERROR" });
    }
  }

}