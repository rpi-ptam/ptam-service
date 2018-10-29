"use strict";

import { TwoWayCache } from "../definitions/TwoWayCache";
import { RepositoryRegistry } from "../registries/RepositoryRegistry";

/**
 * Violation Types Cache
 * @author Dylan L. Cheung <cheund3@rpi.edu>
 */
export class ViolationTypesCache extends TwoWayCache<number,string> {

  private readonly repoRegistry: RepositoryRegistry;

  constructor(repoRegistry: RepositoryRegistry) {
    super();
    this.repoRegistry = repoRegistry;
  }

  async fill(): Promise<void> {
    const { violationTypesRepository } = this.repoRegistry;
    this.map = await violationTypesRepository.getAllViolationTypes();
  }

}