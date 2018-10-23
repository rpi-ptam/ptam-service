"use strict";

import { TwoWayCache } from "../definitions/TwoWayCache";
import { RepositoryRegistry } from "../registries/RepositoryRegistry";

export class VerdictsCache extends TwoWayCache<number,string> {

  private readonly repoRegistry: RepositoryRegistry;

  constructor(repoRegistry: RepositoryRegistry) {
    super();
    this.repoRegistry = repoRegistry;
  }

  async fill(): Promise<void> {
    const verdictsRepository = this.repoRegistry.verdictsRepository;
    this.map = await verdictsRepository.getAllVerdicts();
  }

}