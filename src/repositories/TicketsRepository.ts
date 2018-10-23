"use strict";

import { Repository } from "../definitions/Repository";
import {PostgresDriver} from "../services/PostgresDriver";

/**
 * Tickets Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class TicketsRepository extends Repository {

  constructor(databaseDriver: PostgresDriver) {
    super(databaseDriver);
  }

}