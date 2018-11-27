;

import { PostgresDriver } from "../services/PostgresDriver";

/**
 * Repository Base-Class
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class Repository {

  protected readonly postgresDriver: PostgresDriver;

  public constructor(postgresDriver: PostgresDriver) {
    this.postgresDriver = postgresDriver;
  }

}