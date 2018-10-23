"use strict";

import { Runnable } from "../definitions/Runnable";
import { RepositoryRegistry } from "./RepositoryRegistry";

import { LotsCache } from "../caches/LotsCache";
import { RolesCache } from "../caches/RolesCache";
import { StatesCache } from "../caches/StatesCache";
import { VerdictsCache } from "../caches/VerdictsCache";

/**
 * Cache Registry (mappings)
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
export class CacheRegistry implements Runnable {

  public readonly lotsCache: LotsCache;
  public readonly rolesCache: RolesCache;
  public readonly statesCache: StatesCache;
  public readonly verdictsCache: VerdictsCache;

  constructor(repoRegistry: RepositoryRegistry) {
    this.lotsCache = new LotsCache(repoRegistry);
    this.rolesCache = new RolesCache(repoRegistry);
    this.statesCache = new StatesCache(repoRegistry);
    this.verdictsCache = new VerdictsCache(repoRegistry);
  }

  async start(): Promise<void> {
    await this.lotsCache.fill();
    await this.rolesCache.fill();
    await this.statesCache.fill();
    await this.verdictsCache.fill();
  }

  async stop(): Promise<void> {
    this.lotsCache.flush();
    this.rolesCache.flush();
    this.statesCache.flush();
    this.verdictsCache.flush();
  }

}