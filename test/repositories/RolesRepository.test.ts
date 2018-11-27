"use strict";

import { DatabaseEnumCache } from "../../src/caches/DatabaseEnumCache";
import { RepositoryRegistry } from "../../src/registries/RepositoryRegistry";

/**
 * RolesRepository - Test Suite
 * @author Dylan L. Cheung <cheund3@rpi.edu>
 */
describe("RolesRepository", () => {

  let repoRegistry: RepositoryRegistry;

  beforeAll(async () => {
    repoRegistry = new RepositoryRegistry();
    await repoRegistry.start();
  });

  afterAll(async () => {
    await repoRegistry.stop();
  });

  test("RolesCache Population", async () => {
    const rolesCache = new DatabaseEnumCache(repoRegistry.rolesRepository.getAllRoles);
    await rolesCache.fill();
    expect(rolesCache.length).toBeGreaterThanOrEqual(0);
  });

});