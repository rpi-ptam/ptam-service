"use strict";

import { Runnable } from "./Runnable";

export abstract class DatabaseDriver implements Runnable {
  abstract start(): Promise<void> | void;
  abstract stop(): Promise<void> | void;
  protected abstract async testConnection(): Promise<void>;
  public abstract async query(statement: string, values?: Array<string|number|null>): Promise<any>;
}