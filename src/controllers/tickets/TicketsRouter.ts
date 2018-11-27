;

import { CacheRegistry } from "../../registries/CacheRegistry";

import { ControllerRouter } from "../../definitions/ControllerRouter";
import { RepositoryRegistry } from "../../registries/RepositoryRegistry";
import { TicketsController } from "./TicketsController";

/**
 * Tickets Controller Router
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class TicketsRouter extends ControllerRouter {

  private readonly controller: TicketsController;

  constructor(repoRegistry: RepositoryRegistry, cacheRegistry: CacheRegistry) {
    super();
    this.controller = new TicketsController(repoRegistry, cacheRegistry);
    this.addRoutes();
  }

  protected addRoutes(): void {
    this.router.post("/create", this.controller.createTicket);
  }

}