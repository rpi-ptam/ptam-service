;

import { ClientConfig } from "logical-cas-client";
import { ControllerRouter } from "../../definitions/ControllerRouter";

import { CacheRegistry } from "../../registries/CacheRegistry";
import { RepositoryRegistry } from "../../registries/RepositoryRegistry";
import { AuthenticationController } from "./AuthenticationController";
import {KeyStore} from "../../stores/KeyStore";


/**
 * Appeals-Controller Router
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class AuthenticationRouter extends ControllerRouter {

  private readonly controller: AuthenticationController;

  constructor(repoRegistry: RepositoryRegistry, cacheRegistry: CacheRegistry, keyStore: KeyStore, casConfig: ClientConfig) {
    super();
    this.controller = new AuthenticationController(repoRegistry, cacheRegistry, keyStore, casConfig);
    this.addRoutes();
  }

  protected addRoutes(): void {
    this.router.get("/login", this.controller.login);
    this.router.get("/logout", this.controller.logout);
    this.router.get("/ticket-verify", this.controller.verifyTicket);
  }

}