"use strict";

import { Repository } from "../definitions/Repository";
import { PostgresDriver } from "../services/PostgresDriver";

import { User } from "../definitions/types/User";

/**
 * Users Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class UsersRepository extends Repository {

  constructor(databaseDriver: PostgresDriver) {
    super(databaseDriver);
  }

  public async getById(id: number): Promise<User|null> {
    const statement = "SELECT id, first_name, last_name, rcs_id, role_id "
      + "FROM users WHERE id = $1";
    const result = await this.postgresDriver.query(statement, [id]);
    if (result.rowCount < 1) return null;
    return result.rows[0];
  }

  public async getByRcsId(rcsId: string): Promise<User|null> {
    const statement = "SELECT id, first_name, last_name, rcs_id, role_id "
      + "FROM users WHERE rcs_id = $1";
    const result = await this.postgresDriver.query(statement, [rcsId]);
    if (result.rowCount < 1) return null;
    return result.rows[0];
  }

}