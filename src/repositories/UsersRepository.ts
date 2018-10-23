"use strict";

import { Repository } from "../definitions/Repository";
import {PostgresDriver} from "../services/PostgresDriver";

/**
 * Users Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class UsersRepository extends Repository {

  constructor(databaseDriver: PostgresDriver) {
    super(databaseDriver);
  }

}