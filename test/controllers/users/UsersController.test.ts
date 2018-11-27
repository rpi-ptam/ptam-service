import config from "config";
import request from "request-promise";

import { Application } from "../../../src/Application";

import { CacheRegistry } from "../../../src/registries/CacheRegistry";
import { RepositoryRegistry } from "../../../src/registries/RepositoryRegistry";

import { User } from "../../../src/definitions/types/User";
import { STUDENT, JUDICIAL_BOARD_MEMBER } from "../../../src/contants/Roles";

import { MockUser } from "../../_mocks/MockUser";
import { TokenGenerator } from "../../_helpers/TokenGenerator";

const WEB_SERVER_PORT: number = config.get("port");
const REQUEST_BASE_URL = `http://localhost:${WEB_SERVER_PORT}`;

/**
 * Users Controller - Test Suite
 * @author Joshua A. Berman <bermaj@rpi.edu>
 */
describe("UsersController", () => {

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

  describe("GET /self/get", () => {
    const baseOptions = { method: "GET", json: true, url: REQUEST_BASE_URL + "/users/self/get" };

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
     * JUDICIAL BOARD MEMBER
     */
    test("Judicial Board Member - 200", async () => {
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingJudicialBoardMember);
      const options = { ...baseOptions, jar: cookieJar };
      const response = await request(options);
      expect(response.success).toBe(true);
      expect(response.user.first_name).toBe(testingJudicialBoardMember.first_name);
      expect(response.user.last_name).toBe(testingJudicialBoardMember.last_name);
      expect(response.user.rcs_id).toBe(testingJudicialBoardMember.rcs_id);
      expect(response.user.role).toBe(JUDICIAL_BOARD_MEMBER);
    });

    /**
     * STUDENT
     */
    test("Student - 200", async () => {
      const cookieJar = await tokenGenerator.getTokenCookies(REQUEST_BASE_URL, testingStudent);
      const options = { ...baseOptions, jar: cookieJar };
      const response = await request(options);
      expect(response.success).toBe(true);
      expect(response.user.first_name).toBe(testingStudent.first_name);
      expect(response.user.last_name).toBe(testingStudent.last_name);
      expect(response.user.rcs_id).toBe(testingStudent.rcs_id);
      expect(response.user.role).toBe(STUDENT);
    });

  });

});