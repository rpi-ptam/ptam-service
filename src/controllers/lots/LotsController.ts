"use strict";

import { Request, Response } from "express";
import { CacheRegistry } from "../../registries/CacheRegistry";
import { Logger } from "../../services/Logger";
import bind from "bind-decorator";

export class LotsController {

  private readonly cacheRegistry: CacheRegistry;

  constructor(cacheRegistry: CacheRegistry) {
    this.cacheRegistry = cacheRegistry;
  }

  @bind
  public getLots(req: Request, res: Response): void {
    void (req);
    try {
      const lots = this.cacheRegistry.lotsCache.values();
      res.status(200).json({ success: true, lots });
    }
    catch (error) {
      Logger.error(error);
      res.status(500).json({ success: false, error: "INTERNAL_ERROR" });
    }
  }

}