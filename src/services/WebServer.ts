"use strict";

import http from "http";
import helmet from "helmet";
import config from "config";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { ClientConfig } from "logical-cas-client";

import { KeyStore } from "../stores/KeyStore";
import { Runnable } from "../definitions/Runnable";
import { CacheRegistry } from "../registries/CacheRegistry";
import { RepositoryRegistry } from "../registries/RepositoryRegistry";
import { AuthorizationMiddleware } from "../middleware/AuthorizationMiddleware";

import { UsersRouter } from "../controllers/users/UsersRouter";
import { AppealsRouter } from "../controllers/appeals/AppealsRouter";
import { AuthenticationRouter } from "../controllers/authentication/AuthenticationRouter";
import { CorsMiddleware } from "../middleware/CorsMiddleware";
import { TicketsRouter } from "../controllers/tickets/TicketsRouter";
import { CacheControllerFactory } from "../controllers/generic/cache/CacheControllerFactory";

const DEBUG: boolean = config.get("debug");

const SERVICE_HOST: string = config.get("host");
const SERVICE_SECURE: boolean = config.get("secure");

const CAS_HOST: string = config.get("cas.host");
const CAS_SECURE: boolean = config.get("cas.secure");

const ALLOWED_CLIENT_DOMAINS: Array<string> = config.get("client.allowedDomains");

/**
 * Express Web-Server Wrapper
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class WebServer implements Runnable {

  private readonly port: number;
  private readonly cacheRegistry: CacheRegistry;
  private readonly repoRegistry: RepositoryRegistry;

  private readonly authKeyStore: KeyStore;

  private readonly application: express.Application;
  private httpInstance: http.Server | undefined;

  constructor(port: number, repoRegistry: RepositoryRegistry, cacheRegistry: CacheRegistry, authKeyStore: KeyStore) {
    this.port = port;
    this.repoRegistry = repoRegistry;
    this.cacheRegistry = cacheRegistry;
    this.authKeyStore = authKeyStore;

    this.application = express();
  }

  /**
   * Configure CAS
   */
  public addAuthenticationRouter() {
    const casConfig: ClientConfig = {
      host: SERVICE_HOST,
      port: this.port,
      secure: SERVICE_SECURE,
      endpoints: {
        ticketVerificationPath: "/authentication/ticket-verify"
      },
      server: {
        host: CAS_HOST,
        secure: CAS_SECURE,
        version: "2.0"
      }
    };
    const authRouter = new AuthenticationRouter(this.repoRegistry, this.cacheRegistry, this.authKeyStore, casConfig);
    this.application.use("/authentication", authRouter.router);
  }

  private addCacheRouters() {
    const { lotsCache, statesCache, violationTypesCache, verdictsCache } = this.cacheRegistry;

    const lotsRouter = CacheControllerFactory.createCacheControllerRouter(lotsCache, "lots");
    this.application.use("/lots", lotsRouter.router);

    const statesRouter = CacheControllerFactory.createCacheControllerRouter(statesCache, "states");
    this.application.use("/states", statesRouter.router);

    const violationTypesRouter = CacheControllerFactory.createCacheControllerRouter(violationTypesCache, "violation_types");
    this.application.use("/violation-types", violationTypesRouter.router);

    const verdictsRouter = CacheControllerFactory.createCacheControllerRouter(verdictsCache, "verdicts");
    this.application.use("/verdicts", verdictsRouter.router);
  }

  public addRouters() {
    const appealsRouter = new AppealsRouter(this.repoRegistry, this.cacheRegistry);
    this.application.use("/appeals", appealsRouter.router);

    const usersRouter = new UsersRouter(this.repoRegistry, this.cacheRegistry);
    this.application.use("/users", usersRouter.router);

    const ticketsRouter = new TicketsRouter(this.repoRegistry, this.cacheRegistry);
    this.application.use("/tickets", ticketsRouter.router);    
  }

  public addAuthorizationMiddleware() {
    const authMiddleware = new AuthorizationMiddleware(this.authKeyStore);
    this.application.use(authMiddleware.verifyToken);
  }

  public addMiddleware() {
    this.application.use(helmet());
    this.application.use(bodyParser.json());
    this.application.use(cookieParser());

    const cors = new CorsMiddleware(DEBUG, ALLOWED_CLIENT_DOMAINS);
    cors.addOriginProtection(this.application);
  }

  public addGlobals() {
    this.application.set("cacheRegistry", this.cacheRegistry);
    this.application.set("keyStore", this.authKeyStore);
  }

  public start(): void {
    this.addMiddleware();
    /* Authentication Router must be added before Authorization Middleware, otherwise it will be inaccessible */
    this.addAuthenticationRouter();

    this.addAuthorizationMiddleware();
    this.addCacheRouters();
    this.addRouters();

    this.addGlobals();

    this.httpInstance = this.application.listen(this.port);
  }

  public stop(): void {
    if (this.httpInstance) this.httpInstance.close();
  }

}