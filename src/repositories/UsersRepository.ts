"use strict";

import { Repository } from "../definitions/Repository";
import { DatabaseDriver } from "../definitions/DatabaseDriver";

/**
 * Users Repository
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export class UsersRepository extends Repository {

  constructor(databaseDriver: DatabaseDriver) {
    super(databaseDriver);
  }

}