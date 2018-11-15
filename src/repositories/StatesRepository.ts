import bind from "bind-decorator";

import { Repository } from "../definitions/Repository";

/**
 * States Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class StatesRepository extends Repository {

  @bind
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