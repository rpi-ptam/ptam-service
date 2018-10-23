"use strict";

import { Repository } from "../definitions/Repository";
import { PostgresDriver } from "../services/PostgresDriver";

/**
 * Appeals Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class AppealsRepository extends Repository {

  constructor(databaseDriver: PostgresDriver) {
    super(databaseDriver);
  }

}