import jwt from "jsonwebtoken";
import request from "request-promise";

import { CookieJar } from "request";

import { CacheRegistry } from "../../src/registries/CacheRegistry";
import { AuthenticationKeyStore } from "../../src/utilties/AuthenticationKeyStore";
import { KeyStore } from "../../src/stores/KeyStore";

export class TokenGenerator {
  
  private readonly cacheRegistry: CacheRegistry;
  private readonly keyStore: KeyStore;

  constructor(cacheRegistry: CacheRegistry) {
    this.cacheRegistry = cacheRegistry;
    this.keyStore = AuthenticationKeyStore.getConfiguredStore();
  }

  public async generateToken(userId: number, role: string): Promise<string> {
    const { rolesCache } = this.cacheRegistry;
    const roleId = rolesCache.getByValue(role);

    const jwtConfig = { expiresIn: "1h", algorithm: this.keyStore.algorithm };

    const tokenUser = { id: userId, role_id: roleId };
    return await jwt.sign({ user: tokenUser }, this.keyStore.jwtPrivateKey, jwtConfig);
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