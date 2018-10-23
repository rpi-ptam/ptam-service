"use strict";

import {RepositoryRegistry} from "../../src/registries/RepositoryRegistry";
import {LotsCache} from "../../src/caches/LotsCache";

describe("LotsRepository", () => {

  let repoRegistry: RepositoryRegistry;

  beforeAll(async () => {
    repoRegistry = new RepositoryRegistry();
    await repoRegistry.start();
  });

  afterAll(async () => {
    await repoRegistry.stop();
  });

  test("LotsCache Population", async () => {
    const lotsCache = new LotsCache(repoRegistry);
    await lotsCache.fill();
    console.log(lotsCache);
  });

});