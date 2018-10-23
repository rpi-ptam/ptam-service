"use strict";

import { Pool, PoolConfig, QueryResult } from "pg";
import { DatabaseDriver } from "../definitions/DatabaseDriver";

/**
 * Postgres Driver Implementation
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export class PostgresDriver extends DatabaseDriver {

  private readonly host: string;
  private readonly port: number;
  private readonly username: string;
  private readonly password: string;
  private readonly database: string;

  private instance: Pool | undefined;

  public constructor(host: string, port: number, username: string, password: string, database: string) {
    super();

    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
    this.database = database;
  }

  public async query(statement: string, values?: Array<string | number | null>): Promise<QueryResult> {
    if (!this.instance) throw Error("postgres client has not been instantiated");
    const client = await this.instance.connect();

    let result;

    try {
      result = await client.query(statement, values || []);
    }
    catch (error) {
      throw error;
    }
    finally {
      client.release();
    }

    return result;
  }

  protected async testConnection(): Promise<void> {
    await this.query("SELECT NOW()");
  }

  private getPoolConfig(): PoolConfig {
    return {
      host: this.host,
      port: this.port,
      user: this.username,
      password: this.password,
      database: this.database
    };
  }

  async start(): Promise<void> {
    this.instance = new Pool(this.getPoolConfig());
    await this.testConnection();
  }

  async stop(): Promise<void> {
    if (this.instance) await this.instance.end();
  }

}