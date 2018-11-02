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

import { LotsRouter } from "../controllers/lots/LotsRouter";
import { UsersRouter } from "../controllers/users/UsersRouter";
import { StatesRouter } from "../controllers/states/StatesRouter";
import { AppealsRouter } from "../controllers/appeals/AppealsRouter";
import { AuthenticationRouter } from "../controllers/authentication/AuthenticationRouter";
import {CorsMiddleware} from "../middleware/CorsMiddleware";
import {ViolationTypesRouter} from "../controllers/violation_types/ViolationTypesRouter";
import {VerdictsRouter} from "../controllers/verdicts/VerdictsRouter";
import {TicketsRouter} from "../controllers/tickets/TicketsRouter";

const DEBUG: boolean = config.get("debug");

const SERVICE_HOST: string = config.get("host");
const SERVICE_SECURE: boolean = config.get("secure");

const CAS_HOST: string = config.get("cas.host");
const CAS_SECURE: boolean = config.get("cas.secure");

const JWT_PRIVATE_KEY: string = config.get("auth.privateKey");
const JWT_PUBLIC_KEY: string = config.get("auth.publicKey");
const JWT_ALGO: string = config.get("auth.algorithm");

const ALLOWED_CLIENT_DOMAINS: Array<string> = config.get("client.allowedDomains");

/**
 * Express Web-Server Wrapper
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class WebServer implements Runnable {

  private readonly port: number;
  private readonly cacheRegistry: CacheRegistry;
  private readonly repoRegistry: RepositoryRegistry;

  private readonly keyStore: KeyStore;

  private readonly application: express.Application;
  private httpInstance: http.Server | undefined;

  constructor(port: number, repoRegistry: RepositoryRegistry, cacheRegistry: CacheRegistry) {
    this.port = port;
    this.repoRegistry = repoRegistry;
    this.cacheRegistry = cacheRegistry;

    this.keyStore = new KeyStore(JWT_PUBLIC_KEY, JWT_PRIVATE_KEY, JWT_ALGO);

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
    const authRouter = new AuthenticationRouter(this.repoRegistry, this.cacheRegistry, this.keyStore, casConfig);
    this.application.use("/authentication", authRouter.router);
  }

  public addRouters() {
    const appealsRouter = new AppealsRouter(this.repoRegistry, this.cacheRegistry);
    this.application.use("/appeals", appealsRouter.router);

    const usersRouter = new UsersRouter(this.repoRegistry, this.cacheRegistry);
    this.application.use("/users", usersRouter.router);

    const lotsRouter = new LotsRouter(this.cacheRegistry);
    this.application.use("/lots", lotsRouter.router);

    const statesRouter = new StatesRouter(this.cacheRegistry);
    this.application.use("/states", statesRouter.router);

    const violationTypesRouter = new ViolationTypesRouter(this.cacheRegistry);
    this.application.use("/violation-types", violationTypesRouter.router);

    const verdictsRouter = new VerdictsRouter(this.cacheRegistry);
    this.application.use("/verdicts", verdictsRouter.router);

    const ticketsRouter = new TicketsRouter(this.repoRegistry, this.cacheRegistry);
    this.application.use("/tickets", ticketsRouter.router);
  }

  public addAuthorizationMiddleware() {
    const authMiddleware = new AuthorizationMiddleware(this.keyStore);
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
    this.application.set("keyStore", this.keyStore);
  }

  public start(): void {
    this.addMiddleware();
    /* Authentication Router must be added before Authorization Middleware, otherwise it will be inaccessible */
    this.addAuthenticationRouter();

    this.addAuthorizationMiddleware();
    this.addRouters();

    this.addGlobals();

    this.httpInstance = this.application.listen(this.port);
  }

  public stop(): void {
    if (this.httpInstance) this.httpInstance.close();
  }

}