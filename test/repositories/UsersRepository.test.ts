"use strict";

import { RepositoryRegistry } from "../../src/registries/RepositoryRegistry";
import { CacheRegistry } from "../../src/registries/CacheRegistry";
import { User } from "../../src/definitions/types/User";
import { MockUser } from "../_mocks/MockUser";
import { JUDICIAL_BOARD_MEMBER, STUDENT } from "../../src/contants/Roles";

/**
 * Users Repository Test Suite
 * @author William Zawilinski <zawilw@rpi.edu>
 */
describe("UsersRepository", () => {

  let repoRegistry: RepositoryRegistry;
  let cacheRegistry: CacheRegistry;

  let testingStudent: User;

  beforeAll(async () => {
    repoRegistry = new RepositoryRegistry();
    cacheRegistry = new CacheRegistry(repoRegistry);
    await repoRegistry.start();
    await cacheRegistry.start();
  });

  afterAll(async () => {
    await repoRegistry.stop();
    cacheRegistry.stop();
  });

  test("Create a valid student", async () => {
    testingStudent = MockUser.generateRandomUser(cacheRegistry, STUDENT);
    testingStudent.id = await repoRegistry.usersRepository.create(testingStudent);
    expect(Number.isSafeInteger(testingStudent.id)).toBe(true);
  });

  test("Creating a student with the same RCS identifier", async () => {
    const otherStudent : User = MockUser.generateRandomUser(cacheRegistry, STUDENT);
    otherStudent.rcs_id = testingStudent.rcs_id;
    try {
      await repoRegistry.usersRepository.create(otherStudent);
      fail("Inserting a user with the same RCS identifier should throw an exception");
    }
    catch (error) {
      expect(error.message).toContain("unique");
    }
  });

  test("Getting a student by their identifier", async () => {
    const returnedStudent = await repoRegistry.usersRepository.getById(testingStudent.id!);
    if (!returnedStudent) {
      fail("Should return a valid user");
      return;
    }
    expect(returnedStudent.id).toBe(testingStudent.id!);
    expect(returnedStudent.first_name).toBe(testingStudent.first_name);
    expect(returnedStudent.last_name).toBe(testingStudent.last_name);
    expect(returnedStudent.rcs_id).toBe(testingStudent.rcs_id);
    expect(returnedStudent.role_id).toBe(testingStudent.role_id);

  });

  test("Getting a non-existent user by their identifier", async () => {
    const returnedStudent = await repoRegistry.usersRepository.getById(0);
    expect(returnedStudent).toBe(null);
  });

  test("Getting a student by their RCS identifier", async () => {
    const returnedStudent = await repoRegistry.usersRepository.getByRcsId(testingStudent.rcs_id);

    if (!returnedStudent) {
      fail("Should return a valid user");
      return;
    }

    expect(returnedStudent.id).toBe(testingStudent.id!);
    expect(returnedStudent.first_name).toBe(testingStudent.first_name);
    expect(returnedStudent.last_name).toBe(testingStudent.last_name);
    expect(returnedStudent.rcs_id).toBe(testingStudent.rcs_id);
    expect(returnedStudent.role_id).toBe(testingStudent.role_id);

  });

  test("Updating the students's role to be on the judicial board", async () => {
    const judicialBoardRoleId = cacheRegistry.rolesCache.getByValue(JUDICIAL_BOARD_MEMBER);

    const rowsChanged = await repoRegistry.usersRepository.updateRole(testingStudent.id!, judicialBoardRoleId!);
    expect(rowsChanged).toBe(1);

    const returnedStudent = await repoRegistry.usersRepository.getById(testingStudent.id!);
    expect(returnedStudent!.role_id).toBe(judicialBoardRoleId);
  });

  test("Remove the user by their identifier", async () => {
    await repoRegistry.usersRepository.removeById(testingStudent.id!);
    const result = await repoRegistry.usersRepository.getById(testingStudent.id!);
    expect(result).toBe(null);
  });

});