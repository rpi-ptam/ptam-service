"use strict";

import {TwoWayCache} from "../definitions/TwoWayCache";
import {RepositoryRegistry} from "../registries/RepositoryRegistry";

export class StatesCache extends TwoWayCache<number,string> {

  private readonly repoRegistry: RepositoryRegistry;
  private statesLiteral: any;

  constructor(repoRegistry: RepositoryRegistry) {
    super();
    this.repoRegistry = repoRegistry;
  }

  async fill(): Promise<void> {
    const statesRepository = this.repoRegistry.statesRepository;
    this.map = await statesRepository.getAllStates();

    this.statesLiteral = {};
    for (let id of this.map.keys()) {
      this.statesLiteral[id] = this.map.get(id);
    }
  }

  public toLiteral(): object {
    if (!this.statesLiteral) throw Error("cache has not been instantiated");
    return this.statesLiteral;
  }

}