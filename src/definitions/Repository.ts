"use strict";

import { PostgresDriver } from "../services/PostgresDriver";

/**
 * Abstract Repository Class
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export abstract class Repository {

  protected readonly postgresDriver: PostgresDriver;

  protected constructor(postgresDriver: PostgresDriver) {
    this.postgresDriver = postgresDriver;
  }

}