import { Response } from "express";
import { CacheMissError } from "./errors/CacheMissError";
import { TwoWayCache } from "./TwoWayCache";

/**
 * Request-Accessed Two-Way Cache
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export abstract class ExternalTwoWayCache<K,V> extends TwoWayCache<K,V> {

  private readonly missMessage: string;

  protected map: Map<K,V> | undefined;

  protected constructor(missMessage: string) {
    super();
    this.missMessage = missMessage;
  }

  public handleRequestAccessByKey(response: Response, key: K): V | void {
    const value = this.getByKey(key);
    return value !== null ? value : this.handleRequestAccessMiss(response);
  }

  public handleRequestAccessByValue(response: Response, value: V): K | void {
    const key = this.getByValue(value);
    return key !== null ? key : this.handleRequestAccessMiss(response);
  }

  private handleRequestAccessMiss(response: Response): void {
    response.status(400).json({ success: false, error: this.missMessage });
    throw new CacheMissError();
  }

}