import { ControllerRouter } from "../../../definitions/ControllerRouter";
import { TwoWayCache } from "../../../definitions/TwoWayCache";
import { CacheRouter } from "./CacheRouter";

export class CacheControllerFactory {

  public static createCacheControllerRouter(cache: TwoWayCache<any,any>, responseValueLabel: string): ControllerRouter {
    return new CacheRouter(cache, responseValueLabel);
  }

}