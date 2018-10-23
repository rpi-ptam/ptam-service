"use strict";

import http from "http";
import express from "express";

import { Runnable } from "../definitions/Runnable";
import { StatesRouter } from "../controllers/states/StatesRouter";
import { CacheRegistry } from "../registries/CacheRegistry";

export class WebServer implements Runnable {

  private readonly port: number;
  private readonly cacheRegistry: CacheRegistry;

  private readonly application: express.Application;
  private httpInstance: http.Server | undefined;

  constructor(port: number, cacheRegistry: CacheRegistry) {
    this.port = port;
    this.cacheRegistry = cacheRegistry;
    this.application = express();
  }

  public addRouters() {
    const statesRouter = new StatesRouter(this.cacheRegistry);
    this.application.use("/states", statesRouter.router);
  }

  public start(): void {
    this.addRouters();
    this.httpInstance = this.application.listen(this.port);
  }

  public stop() {
    if (this.httpInstance) this.httpInstance.close();
  }

}