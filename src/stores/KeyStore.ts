export class KeyStore {

  public readonly jwtPublicKey: string;
  public readonly jwtPrivateKey: string;
  public readonly algorithm: string;

  constructor(jwtPublicKey: string, jwtPrivateKey: string, algorithm: string) {
    this.jwtPublicKey = jwtPublicKey;
    this.jwtPrivateKey = jwtPrivateKey;
    this.algorithm = algorithm;
  }

}