"use strict";

import { Repository } from "../definitions/Repository";
import {PostgresDriver} from "../services/PostgresDriver";

/**
 * Tickets Repository
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export class TicketsRepository extends Repository {

  constructor(databaseDriver: PostgresDriver) {
    super(databaseDriver);
  }

}