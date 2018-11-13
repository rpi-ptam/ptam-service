import {KeyStore} from "../../src/stores/KeyStore";
import {CacheRegistry} from "../../src/registries/CacheRegistry";

export class TokenGenerator {

  private readonly keyStore: KeyStore;
  private readonly cacheRegistry: CacheRegistry;

  constructor(keyStore: KeyStore, cacheRegistry: CacheRegistry) {
    this.keyStore = keyStore;
    this.cacheRegistry = cacheRegistry;
  }

  public generateToken(userId: number, role: string) {
    const { rolesCache } = this.cacheRegistry;
    const roleId = rolesCache.getByValue(role);
    
    const tokenPayload = { role_id: roleId, id: userId };
  }

}