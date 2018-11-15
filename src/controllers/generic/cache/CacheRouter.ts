import { ControllerRouter } from "../../../definitions/ControllerRouter";
import { TwoWayCache } from "../../../definitions/TwoWayCache";
import { CacheController } from "./CacheController";

export class CacheRouter extends ControllerRouter {
  
  private readonly controller: CacheController;

  constructor(cache: TwoWayCache<any,any>, responseValueLabel: string) {
    super();
    
    this.controller = new CacheController(cache, responseValueLabel);
    this.addRoutes();
  }
  
  protected addRoutes(): void {
    this.router.get("/get", this.controller.getValues);
  }

}