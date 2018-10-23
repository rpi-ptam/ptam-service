"use strict";

import { PostgresDriver } from "../services/PostgresDriver";

/**
 * Abstract Repository Class
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export abstract class Repository {

  protected readonly postgresDriver: PostgresDriver;

  protected constructor(postgresDriver: PostgresDriver) {
    this.postgresDriver = postgresDriver;
  }

}