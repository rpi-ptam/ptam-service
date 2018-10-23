"use strict";

import { Repository } from "../definitions/Repository";
import { DatabaseDriver } from "../definitions/DatabaseDriver";

/**
 * Tickets Repository
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export class TicketsRepository extends Repository {

  constructor(databaseDriver: DatabaseDriver) {
    super(databaseDriver);
  }

}