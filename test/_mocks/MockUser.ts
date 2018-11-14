import Chance from "chance";

import { User } from "../../src/definitions/types/User";
import { CacheRegistry } from "../../src/registries/CacheRegistry";

export class MockUser {

  private static getRCS(firstName: string, lastName: string): string {
    return `${lastName.substr(0, 5)}${firstName.substr(0, 1)}`;
  }


  public static generateRandomUser(cacheRegistry: CacheRegistry, role: string): User {
    const chance = new Chance();

    const firstName = chance.first();
    const lastName = chance.last();
    const rcsID = this.getRCS(firstName, lastName);

    const roleId = cacheRegistry.rolesCache.getByValue(role);
    if (!roleId) throw Error("Cannot generate random user: role-id not found supplied role");

    return {
      first_name: firstName,
      last_name: lastName,
      rcs_id: rcsID,
      role_id: roleId
    }
  }


}