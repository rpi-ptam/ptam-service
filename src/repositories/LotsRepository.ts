"use strict";

import { Repository } from "../definitions/Repository";
import { PostgresDriver } from "../services/PostgresDriver";

/**
 * Lots Repository
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export class LotsRepository extends Repository {

  constructor(databaseDriver: PostgresDriver) {
    super(databaseDriver);
  }

  public async getAllLots(): Promise<Map<number,string>> {
    const statement = "SELECT id, name FROM lots";
    const lotsResult = await this.postgresDriver.query(statement);

    const lotsMap = new Map<number,string>();
    for (let i = 0; i < lotsResult.rowCount; i++) {
      const lotLiteral: any = lotsResult.rows[i];
      lotsMap.set(lotLiteral.id, lotLiteral.name);
    }

    return lotsMap;
  }

}