import config from "config";
import jwt from "jsonwebtoken";
import request from "request-promise";

import { CacheRegistry } from "../../src/registries/CacheRegistry";
import {CookieJar} from "request";

const JWT_PRIVATE_KEY: string = config.get("auth.privateKey");
const JWT_ALGO: string = config.get("auth.algorithm");

export class TokenGenerator {

  private readonly cacheRegistry: CacheRegistry;

  constructor(cacheRegistry: CacheRegistry) {
    this.cacheRegistry = cacheRegistry;
  }

  public async generateToken(userId: number, role: string): Promise<string> {
    const { rolesCache } = this.cacheRegistry;
    const roleId = rolesCache.getByValue(role);

    const jwtConfig = { expiresIn: "1h", algorithm: JWT_ALGO };

    const tokenUser = { id: userId, role_id: roleId };
    return await jwt.sign({ user: tokenUser }, JWT_PRIVATE_KEY, jwtConfig);
  }

  public async getTokenCookies(apiUrl: string, userId: number, role: string): Promise<CookieJar> {
    const token = await this.generateToken(userId, role);

    const jar = request.jar();
    const cookie = request.cookie(`x-access-token=${token}`);

    if (!cookie) throw Error("Could not create test-cookie");
    jar.setCookie(cookie, apiUrl);

    return jar;
  }

}