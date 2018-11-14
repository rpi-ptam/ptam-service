import config from "config";

import { KeyStore } from "../stores/KeyStore";

const CONFIG_AUTH_USE_ENV: boolean = config.get("auth.useEnv");
const CONFIG_AUTH_PRIVATE_KEY: string = config.get("auth.privateKey");
const CONFIG_AUTH_PUBLIC_KEY: string = config.get("auth.publicKey");
const CONFIG_AUTH_ALGORITHM: string = config.get("auth.algorithm");

/**
 * Authentication KeyStore Handler
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 * 
 * This class is used to instantiate the Auth/JWT KeyStore properly in all testing/development/production environments.
 * 
 */
export class AuthenticationKeyStore {

  /**
   * Get the Auth/JWT KeyStore based on environment variables.
   * @returns {KeyStore}
   */
  private static getEnvironmentBasedKeyStore(): KeyStore {
    const { AUTH_PRIVATE_KEY, AUTH_PUBLIC_KEY, AUTH_ALGORITHM } = process.env;

    if (!AUTH_PRIVATE_KEY || !AUTH_PUBLIC_KEY || !AUTH_ALGORITHM) {
      throw Error("Authentication environment variables are undefined!");      
    }
    
    const privateKey = Buffer.from(AUTH_PRIVATE_KEY, "base64").toString("utf8");
    const publicKey = Buffer.from(AUTH_PUBLIC_KEY, "base64").toString("utf8");
    const algorithm = AUTH_ALGORITHM;
    
    return new KeyStore(publicKey, privateKey, algorithm);
  }

  private static getConfigBasedKeyStore(): KeyStore {
    return new KeyStore(CONFIG_AUTH_PUBLIC_KEY, CONFIG_AUTH_PRIVATE_KEY, CONFIG_AUTH_ALGORITHM);
  }

  /**
   * Outer handler for agnostically retrieving a configured KeyStore.
   * @returns {KeyStore}
   */
  public static getConfiguredStore(): KeyStore {
    return CONFIG_AUTH_USE_ENV ? this.getEnvironmentBasedKeyStore() : this.getConfigBasedKeyStore();
  }

}