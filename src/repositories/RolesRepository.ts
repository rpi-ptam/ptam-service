import bind from "bind-decorator";

import { Repository } from "../definitions/Repository";

/**
 * Roles Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class RolesRepository extends Repository {

  @bind
  public async getAllRoles(): Promise<Map<number,string>> {
    const statement = "SELECT id, name FROM Roles";
    const rolesResult = await this.postgresDriver.query(statement);

    const rolesMap = new Map<number,string>();
    for (let i = 0; i < rolesResult.rowCount; i++) {
      const roleLiteral: any = rolesResult.rows[i];
      rolesMap.set(roleLiteral.id, roleLiteral.name);
    }

    return rolesMap;
  }

}