import config from "config";
import jwt from "jsonwebtoken";
import bind from "bind-decorator";

import { Request, Response } from "express";
import { CASClientV2, ClientConfig } from "logical-cas-client";

import { RepositoryRegistry } from "../../registries/RepositoryRegistry";
import { CacheRegistry } from "../../registries/CacheRegistry";
import { KeyStore } from "../../stores/KeyStore";

const SERVICE_SECURE: boolean = config.get("secure");
const CLIENT_FRIENDLY_URL: string = config.get("client.friendlyUrl");
const TOKEN_EXPIRATION_HOURS: number = config.get("auth.tokenDurationHours");

export class AuthenticationController {

  private readonly repoRegistry: RepositoryRegistry;
  private readonly cacheRegistry: CacheRegistry;
  private readonly keyStore: KeyStore;

  private readonly centralAuthClient: CASClientV2;

  constructor(repoRegistry: RepositoryRegistry, cacheRegistry: CacheRegistry, keyStore: KeyStore, casConfig: ClientConfig) {
    this.repoRegistry = repoRegistry;
    this.cacheRegistry = cacheRegistry;
    this.keyStore = keyStore;

    this.centralAuthClient = new CASClientV2(casConfig, this.authenticationSuccess, this.authenticationFailure);
  }

  public fixUnused() {
    void (this.cacheRegistry);
  }

  /**
   * CAS-Client Successful-Callback
   * @author Aaron J. Shapiro <shapia4@rpi.edu>
   *
   * When a user successfully authenticates with CAS we need to generate/fetch an account for them.
   * Regardless, we will generate a JWT for them and set the corresponding cookie.
   *
   * @param req {Express.Request}
   * @param res {Express.Response}
   * @param rcsId {string}
   *
   */
  @bind
  private async authenticationSuccess(req: Request, res: Response, rcsId: string) {
    void (req);
    const { usersRepository } = this.repoRegistry;
    try {
      const user = await usersRepository.getByRcsId(rcsId);
      console.log(user);
      if (user === null) {
        /* TODO Insert User + Get First/Last Name */
        res.json({ success: false });
        return;
      }
      const jwtConfig = { expiresIn: `${TOKEN_EXPIRATION_HOURS}h`, algorithm: this.keyStore.algorithm };
      const token = await jwt.sign({ user }, this.keyStore.jwtPrivateKey, jwtConfig);
      res.cookie("x-access-token", token, { httpOnly: true, secure: SERVICE_SECURE });
      res.redirect(CLIENT_FRIENDLY_URL + "/login-success");
    }
    catch (error) {
      console.log(error);
      res.json({ success: false, error: "INTERNAL_ERROR" });
    }
  }

  @bind
  private async authenticationFailure(req: Request, res: Response, error: any) {
    void (req);
    res.json({ success: false });
    console.error(error);
  }

  @bind
  public async verifyTicket(req: Request, res: Response) {
    await this.centralAuthClient.verifyTicket(req, res);
  }

  @bind
  public async login(req: Request, res: Response) {
    await this.centralAuthClient.redirectToCASLogin(req, res);
  }

  public logout(req: Request, res: Response) {
    void (req);
    res.clearCookie("x-access-token");
    res.redirect("/logout-success");
  }

}