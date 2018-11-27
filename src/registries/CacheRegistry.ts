;

import { Runnable } from "../definitions/Runnable";
import { RepositoryRegistry } from "./RepositoryRegistry";

import { DatabaseEnumCache } from "../caches/DatabaseEnumCache";

/**
 * Cache Registry (mappings)
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class CacheRegistry implements Runnable {

  public readonly lotsCache: DatabaseEnumCache;
  public readonly rolesCache: DatabaseEnumCache;
  public readonly statesCache: DatabaseEnumCache;
  public readonly verdictsCache: DatabaseEnumCache;
  public readonly violationTypesCache: DatabaseEnumCache;

  constructor(repoRegistry: RepositoryRegistry) {
    this.lotsCache = new DatabaseEnumCache(repoRegistry.lotsRepository.getAllLots);
    this.rolesCache = new DatabaseEnumCache(repoRegistry.rolesRepository.getAllRoles);
    this.statesCache = new DatabaseEnumCache(repoRegistry.statesRepository.getAllStates);
    this.verdictsCache = new DatabaseEnumCache(repoRegistry.verdictsRepository.getAllVerdicts);
    this.violationTypesCache = new DatabaseEnumCache(repoRegistry.violationTypesRepository.getAllViolationTypes);
  }

  async start(): Promise<void> {
    await this.lotsCache.fill();
    await this.rolesCache.fill();
    await this.statesCache.fill();
    await this.verdictsCache.fill();
    await this.violationTypesCache.fill();
  }

  stop(): void {
    this.lotsCache.flush();
    this.rolesCache.flush();
    this.statesCache.flush();
    this.verdictsCache.flush();
    this.violationTypesCache.flush();
  }

}