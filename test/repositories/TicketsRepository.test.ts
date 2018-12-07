"use strict";

import { RepositoryRegistry } from "../../src/registries/RepositoryRegistry";

/**
 * TicketsRepository - Test Suite
 * @author Dylan L. Cheung <cheund3@rpi.edu>
 */
describe("TicketsRepository", () => {

  let repoRegistry: RepositoryRegistry;

  beforeAll(async () => {
    repoRegistry = new RepositoryRegistry();
    await repoRegistry.start();
  });

  afterAll(async () => {
    await repoRegistry.stop();
  });

  test("Valid insertion of a ticket", async () => {

  });

  test("Invalid insertion of a ticket", async () => {

  });

  test("Duplicate insertion of a ticket", async () => {

  });

  test("Valid fetch of ticket by external id", async () => {

  });

  test("Invalid fetch of ticket by external id", async () => {

  });

  test("Valid fetch of ticket by internal id", async () => {

  });

  test("Invalid fetch of ticket by internal id", async () => {

  });

  test("Valid removal of ticket by internal id", async () => {

  });

  test("Invalid removal of ticket by internal id", async () => {

  });

});