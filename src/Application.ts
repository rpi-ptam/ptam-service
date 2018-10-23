"use strict";

import { Runnable } from "./definitions/Runnable";

import { CacheRegistry } from "./registries/CacheRegistry";
import { RepositoryRegistry } from "./registries/RepositoryRegistry";
import {Logger} from "./services/Logger";

/**
 * Outer Application Wrapper
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export class Application implements Runnable {

  private readonly repoRegistry: RepositoryRegistry;
  private readonly cacheRegistry: CacheRegistry;

  constructor() {
    this.repoRegistry = new RepositoryRegistry();
    this.cacheRegistry = new CacheRegistry(this.repoRegistry);
  }

  public async start(): Promise<void> {
    await this.repoRegistry.start();
    Logger.info("Connected to remote repository, tested connection!");
    await this.cacheRegistry.start();
    Logger.info("Caches filled!");
  }

  public async stop(): Promise<void> {
    await this.repoRegistry.stop();
    await this.cacheRegistry.stop();
  }

}