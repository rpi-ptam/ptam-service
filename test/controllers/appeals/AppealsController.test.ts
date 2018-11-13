import config from "config";
import request from "request-promise";

import { Application } from "../../../src/Application";
import { CacheRegistry } from "../../../src/registries/CacheRegistry";
import { TokenGenerator } from "../../_helpers/TokenGenerator";
import { RepositoryRegistry } from "../../../src/registries/RepositoryRegistry";

import { JUDICIAL_BOARD_MEMBER, STUDENT } from "../../../src/contants/Roles";
import {MockTicket} from "../../_mocks/MockTicket";
import {MockAppeal} from "../../_mocks/MockAppeal";

const WEB_SERVER_PORT: number = config.get("port");
const REQUEST_BASE_URL = `http://localhost:${WEB_SERVER_PORT}`;

/**
 * Appeals Controller - Test Suite
 * @author Joshua Berman beramj@rpi.edu
 */
describe("AppealsController", () => {

  let application: Application;

  let repoRegistry: RepositoryRegistry;
  let cacheRegistry: CacheRegistry;

  let tokenGenerator: TokenGenerator;

  beforeAll(async () => {
    application = new Application();
    repoRegistry = new RepositoryRegistry();
    cacheRegistry = new CacheRegistry(repoRegistry);
    tokenGenerator = new TokenGenerator(cacheRegistry);

    await application.start();
    await repoRegistry.start();
    await cacheRegistry.start();
  });

  afterAll(async () => {
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
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, 1, STUDENT);
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
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, 1, JUDICIAL_BOARD_MEMBER);
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
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, 1, JUDICIAL_BOARD_MEMBER);
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
        const ticket = MockTicket.getRandomTicket(1);
        ticketId = await ticketsRepository.insertTicket(ticket);
        const appeal = MockAppeal.getRandomAppeal(ticketId);
        appealId = await appealsRepository.insertAppeal(appeal);

        const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, 1, JUDICIAL_BOARD_MEMBER);
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

});