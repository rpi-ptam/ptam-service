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

  let ticket: Ticket;
  let ticketId: number;

  beforeAll(async () => {
    repoRegistry = new RepositoryRegistry();
    cacheRegistry = new CacheRegistry(repoRegistry);

    await repoRegistry.start();
    await cacheRegistry.start();

    /* Create and insert a mock-student */
    mockStudent = MockUser.generateRandomUser(cacheRegistry, "STUDENT");
    mockStudent.id = await repoRegistry.usersRepository.create(mockStudent);

    ticket = MockTicket.getRandomTicket(mockStudent.id!);
  });

  afterAll(async () => {
    cacheRegistry.stop();
    await repoRegistry.stop();
  });

  test("Valid insertion of a ticket", async () => {
    const { ticketsRepository } = repoRegistry;

    ticketId = await ticketsRepository.create(ticket);
    expect(typeof ticketId).toBe("number");
  });

  test("Duplicate insertion of a ticket", async () => {
    const { ticketsRepository } = repoRegistry;

    try {
      await ticketsRepository.create(ticket);
      fail("Insertion of a ticket with the same external-id should throw an exception");
    } 
    catch (error) {
      expect(error.message).toContain("duplicate key value");
    }
    
  });

  test("Valid fetch of ticket by external id", async () => {
    const { ticketsRepository } = repoRegistry;
  
    const returnedTicket = await ticketsRepository.getByExternalId(ticket.external_id);
    if (!returnedTicket) throw("Should fetch the ticket successfully");

    expect(ticket.violator_id).toBe(ticket.violator_id);
    expect(ticket.violator_id).toBe(returnedTicket.violator_id);
    expect(ticket.external_id).toBe(returnedTicket.external_id);
    expect(ticket.lot_id).toBe(returnedTicket.lot_id);
    expect(ticket.make).toBe(returnedTicket.make);
    expect(ticket.model).toBe(returnedTicket.model);
    expect(ticket.tag).toBe(returnedTicket.tag);
    expect(ticket.plate_state_id).toBe(returnedTicket.plate_state_id);
    // expect(Number(ticket.amount)).toEqual(Number(returnedTicket.amount));
    expect(moment.isDate(returnedTicket.issued_at)).toBe(true);
    expect(ticket.violation_type_id).toBe(returnedTicket.violation_type_id);
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
