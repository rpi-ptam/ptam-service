"use strict";

import moment from "moment";

import { RepositoryRegistry } from "../../src/registries/RepositoryRegistry";
import { MockTicket } from "../_mocks/MockTicket";
import { Ticket } from "../../src/definitions/types/Ticket";
import { User } from "../../src/definitions/types/User";
import { MockUser } from "../_mocks/MockUser";
import { CacheRegistry } from "../../src/registries/CacheRegistry";

/**
 * TicketsRepository - Test Suite
 * @author William Zawilinski <zawilw@rpi.edu>
 */
describe("TicketsRepository", () => {

  let repoRegistry: RepositoryRegistry;
  let cacheRegistry: CacheRegistry;

  let mockStudent: User;

  let testingTicket: Ticket;
  let ticketId: number;

  beforeAll(async () => {
    repoRegistry = new RepositoryRegistry();
    cacheRegistry = new CacheRegistry(repoRegistry);

    await repoRegistry.start();
    await cacheRegistry.start();

    /* Create and insert a mock-student */
    mockStudent = MockUser.generateRandomUser(cacheRegistry, "STUDENT");
    mockStudent.id = await repoRegistry.usersRepository.create(mockStudent);

    testingTicket = MockTicket.getRandomTicket(mockStudent.id!);

  });

  afterAll(async () => {
    cacheRegistry.stop();
    await repoRegistry.stop();
  });

  test("Valid insertion of a ticket", async () => {
    const { ticketsRepository } = repoRegistry;

    ticketId = await ticketsRepository.create(testingTicket);
    expect(typeof ticketId).toBe("number");
    testingTicket.id = ticketId;
  });

  test("Duplicate insertion of a ticket", async () => {
    const { ticketsRepository } = repoRegistry;

    try {
      await ticketsRepository.create(testingTicket);
      fail("Insertion of a ticket with the same external-id should throw an exception");
      return;
    } 
    catch (error) {
      expect(error.message).toContain("duplicate key value");
    }
    
  });

  test("Valid fetch of ticket by external id", async () => {
    const { ticketsRepository } = repoRegistry;
    const returnedTicket = await ticketsRepository.getByExternalId(testingTicket.external_id);

    if (!returnedTicket) {
      fail("Should fetch the ticket successfully");
      return;
    }
    expect(returnedTicket!.id).toBe(testingTicket.id!);
    expect(returnedTicket!.violator_id).toBe(testingTicket.violator_id);
    expect(returnedTicket!.external_id).toBe(testingTicket.external_id);
    expect(returnedTicket!.lot_id).toBe(testingTicket.lot_id);
    expect(returnedTicket!.make).toBe(testingTicket.make);
    expect(returnedTicket!.model).toBe(testingTicket.model);
    expect(returnedTicket!.tag).toBe(testingTicket.tag);
    expect(returnedTicket!.plate_state_id).toBe(testingTicket.plate_state_id);
    expect(moment.isDate(returnedTicket!.issued_at)).toBe(true);
    expect(returnedTicket!.violation_type_id).toBe(testingTicket.violation_type_id);
  });


  test("Valid fetch of ticket by internal id", async () => {
    const returnedTicket = await repoRegistry.ticketsRepository.getById(testingTicket.id!);
    if(!returnedTicket) {
      fail("Should return a valid ticket, not null");
      return;
    }
    expect(returnedTicket!.id).toBe(testingTicket.id);
    expect(returnedTicket!.violator_id).toBe(testingTicket.violator_id);
    expect(returnedTicket!.external_id).toBe(testingTicket.external_id);
    expect(returnedTicket!.lot_id).toBe(testingTicket.lot_id);
    expect(returnedTicket!.make).toBe(testingTicket.make);
    expect(returnedTicket!.model).toBe(testingTicket.model);
    expect(returnedTicket!.tag).toBe(testingTicket.tag);
    expect(returnedTicket!.plate_state_id).toBe(testingTicket.plate_state_id);
    expect(moment.isDate(returnedTicket!.issued_at)).toBe(true);
    expect(returnedTicket!.violation_type_id).toBe(testingTicket.violation_type_id);
  });


  test("Valid removal of ticket by internal id", async () => {
    await repoRegistry.ticketsRepository.removeById(testingTicket.id!);
    const result = await repoRegistry.ticketsRepository.getById(testingTicket.id!);
    expect(result).toBe(null);
  });


});
