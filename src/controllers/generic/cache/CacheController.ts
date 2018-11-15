import bind from "bind-decorator";
import { Request, Response } from "express";

import { Logger } from "../../../services/Logger";
import { TwoWayCache } from "../../../definitions/TwoWayCache";

export class CacheController {

  private readonly cache: TwoWayCache<any, any>;
  private readonly responseValueLabel: string;

  constructor(cache: TwoWayCache<any,any>, responseValueLabel: string) {
    this.cache = cache;
    this.responseValueLabel = responseValueLabel;
  }

  @bind
  public getValues(req: Request, res: Response): void {
    try {
      const responsePayload: any = {};
      
      responsePayload["success"] = true;
      responsePayload[this.responseValueLabel] = this.cache.values();

      res.status(200).json(responsePayload);
    }
    catch (error) {
      Logger.error(error);
      res.status(500).json({ success: false, error: "INTERNAL_ERROR" });
    }
  }

}