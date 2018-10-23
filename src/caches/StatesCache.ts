"use strict";

import { TwoWayCache } from "../definitions/TwoWayCache";
import { RepositoryRegistry } from "../registries/RepositoryRegistry";

export class StatesCache extends TwoWayCache<number,string> {

  private readonly repoRegistry: RepositoryRegistry;

  constructor(repoRegistry: RepositoryRegistry) {
    super();
    this.repoRegistry = repoRegistry;
  }

  async fill(): Promise<void> {
    const statesRepository = this.repoRegistry.statesRepository;
    this.map = await statesRepository.getAllStates();
  }

}