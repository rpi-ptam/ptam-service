"use strict";

import { Repository } from "../definitions/Repository";
import { DatabaseDriver } from "../definitions/DatabaseDriver";

/**
 * Lots Repository
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export class LotsRepository extends Repository {

  constructor(databaseDriver: DatabaseDriver) {
    super(databaseDriver);
  }

}