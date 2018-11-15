import bind from "bind-decorator";

import { Repository } from "../definitions/Repository";

/**
 * Lots Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class LotsRepository extends Repository {

  @bind
  public async getAllLots(): Promise<Map<number,string>> {
    const statement = "SELECT id, name FROM lots ORDER BY name ASC";
    const lotsResult = await this.postgresDriver.query(statement);

    const lotsMap = new Map<number,string>();
    for (let i = 0; i < lotsResult.rowCount; i++) {
      const lotLiteral: any = lotsResult.rows[i];
      lotsMap.set(lotLiteral.id, lotLiteral.name);
    }

    return lotsMap;
  }

}