"use strict";

import { RepositoryRegistry } from "../../src/registries/RepositoryRegistry";
import {MockTicket} from "../_mocks/MockTicket";
import {Ticket} from "../../src/definitions/types/Ticket";

/**
 * TicketsRepository - Test Suite
 * @author Dylan L. Cheung <cheund3@rpi.edu>
 */
describe("TicketsRepository", () => {

  let repoRegistry: RepositoryRegistry;
  let ticket: Ticket;

  beforeAll(async () => {
    repoRegistry = new RepositoryRegistry();
    await repoRegistry.start();
    ticket = MockTicket.getRandomTicket(1);
  });
  afterAll(async () => {
    await repoRegistry.stop();

  });
  test("Valid insertion of a ticket", async () => {
    const ticketId = await repoRegistry.ticketsRepository.create(ticket);
    expect(typeof ticketId).toBe("number");
    });

  test("Invalid insertion of a ticket", async () => {

  });

  test("Duplicate insertion of a ticket", async () => {
    try {
      await repoRegistry.ticketsRepository.create(ticket);
      fail()
    } catch (error) {
      expect(error.message).toContain("duplicate key value");
    }
  });

  test("Valid fetch of ticket by external id", async () => {
    const returnedTicket = await repoRegistry.ticketsRepository.getByExternalId(parseInt(ticket.external_id));
    console.log(returnedTicket);
    if(returnedTicket != null) {
      expect(returnedTicket.violator_id).toBe(ticket.violator_id);
      const ticket_external_id = parseInt(returnedTicket.external_id);
      expect(ticket_external_id).toBe(ticket_external_id);
      expect(returnedTicket.lot_id).toBe(ticket.lot_id);
      expect(returnedTicket.make).toBe(ticket.make);
      expect(returnedTicket.model).toBe(ticket.model);
      expect(returnedTicket.tag).toBe(ticket.tag);
      expect(returnedTicket.plate_state_id).toBe(ticket.plate_state_id);
      expect(returnedTicket.amount).toBe(ticket.amount);
      expect(returnedTicket.issued_at).toBe(ticket.issued_at);
      expect(returnedTicket.violation_type_id).toBe(ticket.violation_type_id);
      // add more
    } else {
      fail()
    }
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