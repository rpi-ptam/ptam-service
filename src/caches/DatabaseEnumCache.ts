"use strict";

import { TwoWayCache } from "../definitions/TwoWayCache";

export class DatabaseEnumCache extends TwoWayCache<number,string> {

  private readonly databaseFillFunction: () => Promise<Map<number,string>>;

  constructor(databaseFillFunction: () => Promise<Map<number,string>>) {
    super();
    this.databaseFillFunction = databaseFillFunction;
  }

  async fill(): Promise<void> {
    this.map = await this.databaseFillFunction();
  }

}