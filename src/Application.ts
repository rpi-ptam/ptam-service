"use strict";

import config from "config";
import { Runnable } from "./definitions/Runnable";

import { Logger } from "./services/Logger";
import { WebServer } from "./services/WebServer";
import { CacheRegistry } from "./registries/CacheRegistry";
import { RepositoryRegistry } from "./registries/RepositoryRegistry";
import { KeyStore } from "./stores/KeyStore";

const WEB_SERVER_PORT: number = config.get("port");

const AUTH_USE_ENV: boolean = config.get("auth.useEnv");
const AUTH_PRIVATE_KEY: string = config.get("auth.privateKey");
const AUTH_PUBLIC_KEY: string = config.get("auth.publicKey");
const AUTH_ALGORITHM: string = config.get("auth.algorithm");

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
    this.webServer = new WebServer(WEB_SERVER_PORT, this.repoRegistry, this.cacheRegistry, this.getAuthenticationKeyStore());
  }

  private getAuthenticationKeyStore(): KeyStore {
    if (AUTH_USE_ENV) {
      const { AUTH_PRIVATE_KEY, AUTH_PUBLIC_KEY, AUTH_ALGORITHM } = process.env;
      if (!AUTH_PRIVATE_KEY || !AUTH_PUBLIC_KEY || !AUTH_ALGORITHM) throw Error("Authentication environment variables are undefined!");
      const privateKey = Buffer.from(AUTH_PRIVATE_KEY, "base64").toString("utf8");
      const publicKey = Buffer.from(AUTH_PUBLIC_KEY, "base64").toString("utf8");
      const algorithm = AUTH_ALGORITHM;
      return new KeyStore(privateKey, publicKey, algorithm);
    }
    return new KeyStore(AUTH_PRIVATE_KEY, AUTH_PUBLIC_KEY, AUTH_ALGORITHM);
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