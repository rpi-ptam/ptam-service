"use strict";

import { Repository } from "../definitions/Repository";
import { PostgresDriver } from "../services/PostgresDriver";

/**
 * Verdicts Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class VerdictsRepository extends Repository {

  constructor(postgresDriver: PostgresDriver) {
    super(postgresDriver);
  }

  public async getAllVerdicts(): Promise<Map<number,string>> {
    const statement = "SELECT id, value FROM verdicts";
    const verdictsResult = await this.postgresDriver.query(statement);

    const verdictsMap = new Map<number,string>();
    for (let i = 0; i < verdictsResult.rowCount; i++) {
      const verdictLiteral: any = verdictsResult.rows[i];
      verdictsMap.set(verdictLiteral.id, verdictLiteral.value);
    }

    return verdictsMap;
  }

}