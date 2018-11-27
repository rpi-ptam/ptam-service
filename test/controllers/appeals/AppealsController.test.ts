import config from "config";
import request from "request-promise";

import { Application } from "../../../src/Application";
import { CacheRegistry } from "../../../src/registries/CacheRegistry";
import { TokenGenerator } from "../../_helpers/TokenGenerator";
import { RepositoryRegistry } from "../../../src/registries/RepositoryRegistry";

import { STUDENT, JUDICIAL_BOARD_MEMBER } from "../../../src/contants/Roles";
import { MockTicket } from "../../_mocks/MockTicket";
import { MockAppeal } from "../../_mocks/MockAppeal";
import { User } from "../../../src/definitions/types/User";
import { MockUser } from "../../_mocks/MockUser";
import { ACCEPTED, ADJUSTED, DENIED } from "../../../src/contants/Verdicts";

const WEB_SERVER_PORT: number = config.get("port");
const REQUEST_BASE_URL = `http://localhost:${WEB_SERVER_PORT}`;

/**
 * Appeals Controller - Test Suite
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 * @author Joshua A. Berman <beramj@rpi.edu>
 */
describe("AppealsController", () => {

  let application: Application;

  let repoRegistry: RepositoryRegistry;
  let cacheRegistry: CacheRegistry;
  
  let testingStudent: User;
  let testingJudicialBoardMember: User;

  let tokenGenerator: TokenGenerator;

  beforeAll(async () => {
    application = new Application();
    repoRegistry = new RepositoryRegistry();
    cacheRegistry = new CacheRegistry(repoRegistry);
    tokenGenerator = new TokenGenerator();

    await application.start();
    await repoRegistry.start();
    await cacheRegistry.start();

    /* Insert a dummy-student for testing */
    testingStudent = MockUser.generateRandomUser(cacheRegistry, STUDENT);
    testingStudent.id = await repoRegistry.usersRepository.create(testingStudent);

    /* Insert a dummy-jboard-member for testing */
    testingJudicialBoardMember = MockUser.generateRandomUser(cacheRegistry, JUDICIAL_BOARD_MEMBER);
    testingJudicialBoardMember.id = await repoRegistry.usersRepository.create(testingJudicialBoardMember);
  });

  afterAll(async () => {
    if (testingStudent.id) await repoRegistry.usersRepository.removeById(testingStudent.id);
    if (testingJudicialBoardMember.id) await repoRegistry.usersRepository.removeById(testingJudicialBoardMember.id);

    await application.stop();
    await repoRegistry.stop();
    await cacheRegistry.stop();
  });

  /**
   * GET INDIVIDUAL APPEAL ENDPOINT
   */
  describe("GET /get", () => {
    const baseOptions = { method: "GET", json: true, url: REQUEST_BASE_URL + "/appeals/get" };

    /**
     * NO TOKEN PROVIDED
     */
    test("Unauthorized Request (No Token) - 401", async () => {
      try {
        await request(baseOptions);
        fail("Attempting to make this request should throw an exception");
      }
      catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.response.body.success).toBe(false);
        expect(error.response.body.error).toBe("UNAUTHORIZED");
      }
    });

    /**
     * STUDENT ACCESS
     */
    test("Unauthorized User (Wrong Role) - 401", async () => {
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingStudent);
      const options = {
        ...baseOptions,
        jar: cookieJar
      };
      try {
        await request(options);
        fail("Attempting to make this request should throw an exception");
      }
      catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.response.body.success).toBe(false);
        expect(error.response.body.error).toBe("UNAUTHORIZED");
      }
    });

    /**
     * MALFORMED REQUEST
     */
    test("Malformed Request (No Appeal Identifier) - 401" , async () => {
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingJudicialBoardMember);
      const options = {
        ...baseOptions,
        jar: cookieJar
      };
      try {
        await request(options);
        fail("Attempting to make this request should throw an exception");
      }
      catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.response.body.success).toBe(false);
        expect(error.response.body.error).toBe("MALFORMED_REQUEST");
      }
    });

    /**
     * INVALID APPEAL
     */
    test("Non-Existent Appeal - 200", async () => {
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingJudicialBoardMember);
      const options = { ...baseOptions, jar: cookieJar, qs: { appeal_id: 0 } };
      const response = await request(options);
      expect(response.success).toBe(false);
      expect(response.error).toBe("APPEAL_NOT_FOUND");
    });

    test("Get Valid Appeal", async () => {
      const { ticketsRepository, appealsRepository } = repoRegistry;
      let ticketId = null;
      let appealId = null;

      let requestError = null;
      try {
        if (!testingStudent.id) {
          fail("Testing-Student is malformed, cannot run test!");
          return;
        }
        const ticket = MockTicket.getRandomTicket(testingStudent.id);
        ticketId = await ticketsRepository.create(ticket);
        const appeal = MockAppeal.getRandomAppeal(ticketId);
        appealId = await appealsRepository.create(appeal);

        const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingJudicialBoardMember);
        const options = { ...baseOptions, jar: cookieJar, qs: { appeal_id: appealId } };

        const response = await request(options);
        expect(response.success).toBe(true);
        /* TODO Check Values */
      }
      catch (error) {
        requestError = error;
      }
      finally {
        if (appealId) await appealsRepository.removeById(appealId);
        if (ticketId) await ticketsRepository.removeById(ticketId);
      }
      if (requestError) fail(requestError);
    });

  });

  describe("POST /create", () => {
    const baseOptions = { method: "POST", json: true, url: REQUEST_BASE_URL + "/appeals/create" };

    /**
     * NO TOKEN PROVIDED
     */
    test("Unauthorized Request (No Token) - 401", async () => {
      try {
        await request(baseOptions);
        fail("Attempting to make this request should throw an exception");
      }
      catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.response.body.success).toBe(false);
        expect(error.response.body.error).toBe("UNAUTHORIZED");
      }
    });

    /**
     * STUDENT ACCESS
     */
    test("Unauthorized User (Wrong Role) - 401", async () => {
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingJudicialBoardMember);
      const options = {
        ...baseOptions,
        jar: cookieJar
      };
      try {
        await request(options);
        fail("Attempting to make this request should throw an exception");
      }
      catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.response.body.success).toBe(false);
        expect(error.response.body.error).toBe("UNAUTHORIZED");
      }
    });

    /**
     * Missing Parameter
     */
    test("Missing Parameter (Malformed Request) - 400", async () => {
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingStudent);
      const options = { ...baseOptions, jar: cookieJar, body: { justification: "" } };
      try {
        await request(options);
        fail("Attempting to make this request should throw an exception");
      }
      catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.response.body.success).toBe(false);
        expect(error.response.body.error).toBe("MALFORMED_REQUEST");
      }
    });

    /**
     * MALFORMED REQUEST (NO UNDERLYING TICKET)
     */
    test("Invalid Ticket-Reference (Malformed Request) - 400", async () => {
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingStudent);
      const options = { ...baseOptions, jar: cookieJar, body: { justification: "", ticket_id: 0 } };
      try {
        await request(options);
        fail("Attempting to make this request should throw an exception");
      }
      catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.response.body.success).toBe(false);
        expect(error.response.body.error).toBe("MALFORMED_REQUEST");
      }
    });

    /**
     * STUDENT TRYING TO FILE APPEAL FOR TICKET THAT ISN'T THEIRS
     */
    test("Student filing an appeal for a ticket that is not theirs (Unauthorized) - 401", async () => {
      const { ticketsRepository, usersRepository } = repoRegistry;

      let preparationError: Error | undefined;

      let otherStudentId: number | undefined;
      let ticketId: number | undefined;

      let requestSucceeded = false;

      try {
        const otherStudent = MockUser.generateRandomUser(cacheRegistry, STUDENT);
        otherStudentId = await usersRepository.create(otherStudent);
        const ticket = MockTicket.getRandomTicket(otherStudentId);
        ticketId = await ticketsRepository.create(ticket);
        /* Attempt to make request with the testing student (not the one who filed the ticket)  */
        try {
          const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingStudent);
          const options = { ...baseOptions, jar: cookieJar, body: { justification: "", ticket_id: ticketId } };
          await request(options);
          requestSucceeded = true;
        }
        catch (error) {
          expect(error.statusCode).toBe(401);
          expect(error.response.body.success).toBe(false);
          expect(error.response.body.error).toBe("UNAUTHORIZED");
        }
      }
      catch (error) {
        preparationError = error;
      }
      finally {
        if (ticketId) await ticketsRepository.removeById(ticketId);
        if (otherStudentId) await usersRepository.removeById(otherStudentId);
      }

      if (preparationError) fail(preparationError);
      if (requestSucceeded) fail("Attempting to make this request should throw an exception");
    });

    /**
     * SUCCESSFUL APPEAL FILING
     */
    test("Successful Appeal Filing (200)", async () => {
      const { ticketsRepository, appealsRepository } = repoRegistry;

      if (!testingStudent.id) {
        fail("Testing-Student is malformed, cannot run test!");
        return;
      }

      /* Generate a ticket for the testing-student and insert it to the database */
      const ticket = MockTicket.getRandomTicket(testingStudent.id);
      const ticketId = await ticketsRepository.create(ticket);

      /* Prepare the request payload */
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingStudent);
      const options = { ...baseOptions, jar: cookieJar, body: { justification: "", ticket_id: ticketId } };
      const response = await request(options);
      expect(response.success).toBe(true);

      /* TODO: Check database to see if appeal was inserted? */

      await appealsRepository.removeByTicketId(ticketId);
      await ticketsRepository.removeById(ticketId);

    });

  });

  describe("POST /verdict/create", () => {
    const baseOptions = { method: "POST", json: true, url: REQUEST_BASE_URL + "/appeals/verdict/create" };

    /**
     * NO TOKEN PROVIDED
     */
    test("Unauthorized Request (No Token) - 401", async () => {
      try {
        await request(baseOptions);
        fail("Attempting to make this request should throw an exception");
      }
      catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.response.body.success).toBe(false);
        expect(error.response.body.error).toBe("UNAUTHORIZED");
      }
    });

    /**
     * STUDENT ACCESS
     */
    test("Unauthorized User (Wrong Role) - 401", async () => {
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingStudent);
      const options = { ...baseOptions, jar: cookieJar };
      try {
        await request(options);
        fail("Attempting to make this request should throw an exception");
      }
      catch (error) {
        expect(error.statusCode).toBe(401);
        expect(error.response.body.success).toBe(false);
        expect(error.response.body.error).toBe("UNAUTHORIZED");
      }
    });

    /**
     * NO APPEAL IDENTIFIER
     */
    test("Malformed Request (No Appeal Identifier) - 400", async () => {
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingJudicialBoardMember);
      const options = { ...baseOptions, jar: cookieJar, body: { verdict: ACCEPTED } };
      try {
        await request(options);
        fail("Attempting to make this request should throw an exception");
      }
      catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.response.body.success).toBe(false);
        expect(error.response.body.error).toBe("MALFORMED_REQUEST");
      }
    });

    /**
     * INVALID VERDICT TYPE
     */
    test("Malformed Request (Invalid Verdict) - 400", async () => {
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingJudicialBoardMember);
      const options = { ...baseOptions, jar: cookieJar, body: { appeal_id: 0, verdict: "NOT_A_VERDICT" } };
      try {
        await request(options);
        fail("Attempting to make this request should throw an exception");
      }
      catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.response.body.success).toBe(false);
        expect(error.response.body.error).toBe("INVALID_VERDICT");
      }
    });

    /**
     * ADJUSTMENT VERDICT WITHOUT AMOUNT
     */
    test("Malformed Request (Missing Supplementary Parameter) - 400", async () => {
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingJudicialBoardMember);
      const options = { ...baseOptions, jar: cookieJar, body: { appeal_id: 0, verdict: ADJUSTED } };
      try {
        await request(options);
        fail("Attempting to make this request should throw an exception");
      }
      catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.response.body.success).toBe(false);
        expect(error.response.body.error).toBe("ADJUSTMENT_AMOUNT_REQUIRED");
      }
    });

    /**
     * NON-EXISTENT APPEAL
     */
    test("Non-Existent Appeal - 200", async () => {
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingJudicialBoardMember);
      const options = { ...baseOptions, jar: cookieJar, body: { appeal_id: 0, verdict: ACCEPTED } };
      const response = await request(options);
      expect(response.success).toBe(false);
      expect(response.error).toBe("APPEAL_NOT_FOUND");
    });

    test("Successful Appeal Adjustment - 200", async () => {
      const { ticketsRepository, appealsRepository } = repoRegistry;

      if (!testingStudent.id) throw ("Testing-Student is malformed, cannot run test!");

      /* Generate the underlying ticket for the appeal */
      const ticket = await MockTicket.getRandomTicket(testingStudent.id);
      const ticketId = await ticketsRepository.create(ticket);

      /* Generate the appeal to be decided upon */
      const appeal = await MockAppeal.getRandomAppeal(ticketId);
      const appealId = await appealsRepository.create(appeal);

      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingJudicialBoardMember);
      const body = { appeal_id: appealId, verdict: ADJUSTED, verdict_comment: "reduced", adjustment_amount: 47 };

      const options = { ...baseOptions, jar: cookieJar, body };
      const response = await request(options);
      expect(response.success).toBe(true);

      await appealsRepository.removeById(appealId);
      await ticketsRepository.removeById(ticketId);

    });

    test("Successful Appeal Denial - 200", async () => {
      const { ticketsRepository, appealsRepository } = repoRegistry;

      if (!testingStudent.id) throw ("Testing-Student is malformed, cannot run test!");

      /* Generate the underlying ticket for the appeal */
      const ticket = await MockTicket.getRandomTicket(testingStudent.id);
      const ticketId = await ticketsRepository.create(ticket);

      /* Generate the appeal to be decided upon */
      const appeal = await MockAppeal.getRandomAppeal(ticketId);
      const appealId = await appealsRepository.create(appeal);

      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingJudicialBoardMember);
      const body = { appeal_id: appealId, verdict: DENIED };

      const options = { ...baseOptions, jar: cookieJar, body };
      const response = await request(options);
      expect(response.success).toBe(true);

      await appealsRepository.removeById(appealId);
      await ticketsRepository.removeById(ticketId);

    });

  });

});