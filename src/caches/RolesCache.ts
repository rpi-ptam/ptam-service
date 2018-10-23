"use strict";

import { TwoWayCache } from "../definitions/TwoWayCache";
import { RepositoryRegistry } from "../registries/RepositoryRegistry";

import {
  ADMINISTRATOR,
  JUDICIAL_BOARD_CHAIR,
  JUDICIAL_BOARD_MEMBER,
  PARKING_OFFICE_OFFICIAL
} from "../contants/Roles";

/**
 * Role Cache
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class RolesCache extends TwoWayCache<number,string> {

  private readonly repoRegistry: RepositoryRegistry;

  constructor(repoRegistry: RepositoryRegistry) {
    super();
    this.repoRegistry = repoRegistry;
  }

  async fill(): Promise<void> {
    const rolesRepository = this.repoRegistry.rolesRepository;
    this.map = await rolesRepository.getAllRoles();
  }

}