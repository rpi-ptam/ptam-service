"use strict";

import http from "http";
import express from "express";

import { Runnable } from "../definitions/Runnable";
import { CacheRegistry } from "../registries/CacheRegistry";

import { LotsRouter } from "../controllers/lots/LotsRouter";
import { StatesRouter } from "../controllers/states/StatesRouter";
import {AppealsRouter} from "../controllers/appeals/AppealsRouter";
import {RepositoryRegistry} from "../registries/RepositoryRegistry";

/**
 * Express Web-Server Wrapper
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class WebServer implements Runnable {

  private readonly port: number;
  private readonly cacheRegistry: CacheRegistry;
  private readonly repoRegistry: RepositoryRegistry;

  private readonly application: express.Application;
  private httpInstance: http.Server | undefined;

  constructor(port: number, repoRegistry: RepositoryRegistry, cacheRegistry: CacheRegistry) {
    this.port = port;
    this.repoRegistry = repoRegistry;
    this.cacheRegistry = cacheRegistry;
    this.application = express();
  }

  public addRouters() {
    const appealsRouter = new AppealsRouter(this.repoRegistry, this.cacheRegistry);
    const lotsRouter = new LotsRouter(this.cacheRegistry);
    const statesRouter = new StatesRouter(this.cacheRegistry);

    this.application.use("/appeals", appealsRouter.router);
    this.application.use("/lots", lotsRouter.router);
    this.application.use("/states", statesRouter.router);
  }

  public start(): void {
    this.addRouters();
    this.application.set("cacheRegistry", this.cacheRegistry);
    this.httpInstance = this.application.listen(this.port);
  }

  public stop() {
    if (this.httpInstance) this.httpInstance.close();
  }

}