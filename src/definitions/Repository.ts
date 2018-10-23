"use strict";

import { DatabaseDriver } from "./DatabaseDriver";

/**
 * Abstract Repository Class
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export abstract class Repository {

  protected readonly databaseDriver: DatabaseDriver;

  protected constructor(databaseDriver: DatabaseDriver) {
    this.databaseDriver = databaseDriver;
  }

}