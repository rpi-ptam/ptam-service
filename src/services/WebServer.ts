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

import { LotsRouter } from "../controllers/lots/LotsRouter";
import { StatesRouter } from "../controllers/states/StatesRouter";
import { AppealsRouter } from "../controllers/appeals/AppealsRouter";
import { AuthenticationRouter } from "../controllers/authentication/AuthenticationRouter";
import {AuthorizationMiddleware} from "../middleware/AuthorizationMiddleware";
import {UsersRouter} from "../controllers/users/UsersRouter";


const SERVICE_HOST: string = config.get("host");
const SERVICE_SECURE: boolean = config.get("secure");

const CAS_HOST: string = config.get("cas.host");
const CAS_SECURE: boolean = config.get("cas.secure");

const JWT_PRIVATE_KEY: string = config.get("auth.privateKey");
const JWT_PUBLIC_KEY: string = config.get("auth.publicKey");
const JWT_ALGO: string = config.get("auth.algorithm");

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
    this.addAuthenticationRouter();
    const lotsRouter = new LotsRouter(this.cacheRegistry);
    const statesRouter = new StatesRouter(this.cacheRegistry);

    this.application.use("/lots", lotsRouter.router);
    this.application.use("/states", statesRouter.router);
  }

  public addAuthorizedRouters() {
    const appealsRouter = new AppealsRouter(this.repoRegistry, this.cacheRegistry);
    const usersRouter = new UsersRouter(this.repoRegistry, this.cacheRegistry);
    this.application.use("/appeals", appealsRouter.router);
    this.application.use("/users", usersRouter.router);
  }

  public addAuthorizationMiddleware() {
    const authMiddleware = new AuthorizationMiddleware(this.keyStore);
    this.application.use(authMiddleware.verifyToken);
  }

  public addMiddleware() {
    this.application.use(helmet());
    this.application.use(bodyParser.json());
    this.application.use(cookieParser());
  }

  public addGlobals() {
    this.application.set("cacheRegistry", this.cacheRegistry);
    this.application.set("keyStore", this.keyStore);
  }

  public start(): void {
    this.addMiddleware();
    this.addRouters();

    this.addAuthorizationMiddleware();
    this.addAuthorizedRouters();

    this.addGlobals();

    this.httpInstance = this.application.listen(this.port);
  }

  public stop(): void {
    if (this.httpInstance) this.httpInstance.close();
  }

}