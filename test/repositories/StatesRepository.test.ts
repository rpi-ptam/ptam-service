"use strict";

import { DatabaseEnumCache } from "../../src/caches/DatabaseEnumCache";
import { RepositoryRegistry } from "../../src/registries/RepositoryRegistry";

/**
 * StatesRepository - Test Suite
 * @author Dylan L. Cheung <cheund3@rpi.edu>
 */
describe("StatesRepository", () => {

  let repoRegistry: RepositoryRegistry;

  beforeAll(async () => {
    repoRegistry = new RepositoryRegistry();
    await repoRegistry.start();
  });

  afterAll(async () => {
    await repoRegistry.stop();
  });

  test("StatesCache Population", async () => {
    const statesCache = new DatabaseEnumCache(repoRegistry.statesRepository.getAllStates);
    await statesCache.fill();
    expect(statesCache.length).toBeGreaterThanOrEqual(0);
  });

});