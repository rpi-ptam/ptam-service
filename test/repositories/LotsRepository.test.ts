"use strict";

import { DatabaseEnumCache } from "../../src/caches/DatabaseEnumCache";
import { RepositoryRegistry } from "../../src/registries/RepositoryRegistry";

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
    const lotsCache = new DatabaseEnumCache(repoRegistry.lotsRepository.getAllLots);
    await lotsCache.fill();
    expect(lotsCache.length).toBeGreaterThanOrEqual(0);
  });

});