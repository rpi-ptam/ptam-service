"use strict";

import { DatabaseEnumCache } from "../../src/caches/DatabaseEnumCache";
import { RepositoryRegistry } from "../../src/registries/RepositoryRegistry";

/**
 * VerdictsRepository - Test Suite
 * @author Dylan L. Cheung <cheund3@rpi.edu>
 */
describe("VerdictsRepository", () => {

  let repoRegistry: RepositoryRegistry;

  beforeAll(async () => {
    repoRegistry = new RepositoryRegistry();
    await repoRegistry.start();
  });

  afterAll(async () => {
    await repoRegistry.stop();
  });

  test("VerdictsCache Population", async () => {
    const verdictsCache = new DatabaseEnumCache(repoRegistry.verdictsRepository.getAllVerdicts);
    await verdictsCache.fill();
    expect(verdictsCache.length).toBeGreaterThanOrEqual(0);
  });

});