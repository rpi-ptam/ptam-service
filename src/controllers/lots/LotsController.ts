import bind from "bind-decorator";
import { Request, Response } from "express";

import { Logger } from "../../services/Logger";
import { CacheRegistry } from "../../registries/CacheRegistry";

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