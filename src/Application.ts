"use strict";

import { Runnable } from "./definitions/Runnable";
import { RepositoryRegistry } from "./registries/RepositoryRegistry";

export class Application implements Runnable {

  private readonly repoRegistry: RepositoryRegistry;

  constructor() {
    this.repoRegistry = new RepositoryRegistry();
  }

  public async start(): Promise<void> {
    await this.repoRegistry.start();
  }

  public async stop(): Promise<void> {
    await this.repoRegistry.stop();
  }

}