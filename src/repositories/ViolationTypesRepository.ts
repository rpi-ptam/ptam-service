import bind from "bind-decorator";

import { Repository } from "../definitions/Repository";

/**
 * Violation Types Repository
 * @author Dylan L. Cheung <cheund3@rpi.edu>
 */
export class ViolationTypesRepository extends Repository {

  @bind
  public async getAllViolationTypes(): Promise<Map<number,string>> {
    const statement = "SELECT id, type FROM violation_types";
    const violationTypesResult = await this.postgresDriver.query(statement);

    const violationTypesMap = new Map<number,string>();
    for (let i = 0; i < violationTypesResult.rowCount; i++) {
      const violationTypeLiteral: any = violationTypesResult.rows[i];
      violationTypesMap.set(violationTypeLiteral.id, violationTypeLiteral.type);
    }

    return violationTypesMap;
  }

}