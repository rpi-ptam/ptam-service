"use strict";

import { Repository } from "../definitions/Repository";
import { PostgresDriver } from "../services/PostgresDriver";

/**
 * States Repository
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export class StatesRepository extends Repository {

  constructor(postgresDriver: PostgresDriver) {
    super(postgresDriver);
  }

  public async getAllStates(): Promise<Map<number,string>> {
    const statement = "SELECT id, abbreviation FROM states";
    const statesResult = await this.postgresDriver.query(statement);

    const statesMap = new Map<number,string>();
    for (let i = 0; i < statesResult.rowCount; i++) {
      const stateLiteral: any = statesResult.rows[i];
      statesMap.set(stateLiteral.id, stateLiteral.abbreviation);
    }

    return statesMap;
  }

}