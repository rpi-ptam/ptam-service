"use strict";

import { Repository } from "../definitions/Repository";
import { DatabaseDriver } from "../definitions/DatabaseDriver";

/**
 * States Repository
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export class StatesRepository extends Repository {

  constructor(databaseDriver: DatabaseDriver) {
    super(databaseDriver);
  }

}