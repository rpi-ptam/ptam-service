"use strict";

import { Repository } from "../definitions/Repository";
import { PostgresDriver } from "../services/PostgresDriver";

/**
 * Roles Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class RolesRepository extends Repository {

  constructor(postgresDriver: PostgresDriver) {
    super(postgresDriver);
  }

  public async getAllRoles(): Promise<Map<number,string>> {
    const statement = "SELECT id, name FROM roles";
    const rolesResult = await this.postgresDriver.query(statement);

    const rolesMap = new Map<number,string>();
    for (let i = 0; i < rolesResult.rowCount; i++) {
      const roleLiteral: any = rolesResult.rows[i];
      rolesMap.set(roleLiteral.id, roleLiteral.name);
    }

    return rolesMap;
  }

}