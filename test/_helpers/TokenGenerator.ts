import jwt from "jsonwebtoken";
import request from "request-promise";
import { CookieJar } from "request";

import { User } from "../../src/definitions/types/User";
import { KeyStore } from "../../src/stores/KeyStore";
import { AuthenticationKeyStore } from "../../src/utilties/AuthenticationKeyStore";

export class TokenGenerator {
  
  private readonly keyStore: KeyStore;

  constructor() {
    this.keyStore = AuthenticationKeyStore.getConfiguredStore();
  }

  public async generateToken(user: User): Promise<string> {
    const jwtConfig = { expiresIn: "1h", algorithm: this.keyStore.algorithm };

    const tokenUser = { id: user.id, role_id: user.role_id };
    return await jwt.sign({ user: tokenUser }, this.keyStore.jwtPrivateKey, jwtConfig);
  }

  public async getTokenCookies(apiUrl: string, user: User): Promise<CookieJar> {
    const token = await this.generateToken(user);

    const jar = request.jar();
    const cookie = request.cookie(`x-access-token=${token}`);

    if (!cookie) throw Error("Could not create test-cookie");
    jar.setCookie(cookie, apiUrl);

    return jar;
  }

}