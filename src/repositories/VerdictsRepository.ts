"use strict";

import { Repository } from "../definitions/Repository";
import { DatabaseDriver } from "../definitions/DatabaseDriver";

/**
 * Verdicts Repository
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export class VerdictsRepository extends Repository {

  constructor(databaseDriver: DatabaseDriver) {
    super(databaseDriver);
  }

}