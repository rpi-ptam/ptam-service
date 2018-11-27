"use strict";

import { DatabaseEnumCache } from "../../src/caches/DatabaseEnumCache";
import { RepositoryRegistry } from "../../src/registries/RepositoryRegistry";

/**
 * ViolationTypesRepository - Test Suite
 * @author Dylan L. Cheung <cheund3@rpi.edu>
 */
describe("ViolationTypesRepository", () => {

  let repoRegistry: RepositoryRegistry;

  beforeAll(async () => {
    repoRegistry = new RepositoryRegistry();
    await repoRegistry.start();
  });

  afterAll(async () => {
    await repoRegistry.stop();
  });

  test("LotsCache Population", async () => {
    const violationCache = new DatabaseEnumCache(repoRegistry.violationTypesRepository.getAllViolationTypes);
    await violationCache.fill();
    expect(violationCache.length).toBeGreaterThanOrEqual(0);
  });

});