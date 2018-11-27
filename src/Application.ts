;

import config from "config";
import { Runnable } from "./definitions/Runnable";

import { Logger } from "./services/Logger";
import { WebServer } from "./services/WebServer";
import { CacheRegistry } from "./registries/CacheRegistry";
import { RepositoryRegistry } from "./registries/RepositoryRegistry";
import { AuthenticationKeyStore } from "./utilties/AuthenticationKeyStore";

const WEB_SERVER_PORT: number = config.get("port");


/**
 * Outer Application Wrapper
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class Application implements Runnable {

  private readonly repoRegistry: RepositoryRegistry;
  private readonly cacheRegistry: CacheRegistry;
  private readonly webServer: WebServer;

  constructor() {
    this.repoRegistry = new RepositoryRegistry();
    this.cacheRegistry = new CacheRegistry(this.repoRegistry);
    this.webServer = new WebServer(WEB_SERVER_PORT, this.repoRegistry, this.cacheRegistry, AuthenticationKeyStore.getConfiguredStore());
  }

  public async start(): Promise<void> {
    await this.repoRegistry.start();
    Logger.info("Connected to remote repository, tested connection!");
    await this.cacheRegistry.start();
    Logger.info("Caches filled!");
    this.webServer.start();
    Logger.info(`WebServer listening on port ${WEB_SERVER_PORT}`);
  }

  public async stop(): Promise<void> {
    this.webServer.stop();
    await this.repoRegistry.stop();
    this.cacheRegistry.stop();
  }

}