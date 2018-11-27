;

import config from "config";

import { Runnable } from "../definitions/Runnable";
import { PostgresDriver } from "../services/PostgresDriver";

import { AppealsRepository } from "../repositories/AppealsRepository";
import { LotsRepository } from "../repositories/LotsRepository";
import { RolesRepository } from "../repositories/RolesRepository";
import { StatesRepository } from "../repositories/StatesRepository";
import { TicketsRepository } from "../repositories/TicketsRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import { VerdictsRepository } from "../repositories/VerdictsRepository";
import { ViolationTypesRepository } from "../repositories/ViolationTypesRepository";

const DATABASE_HOST: string = config.get("database.host");
const DATABASE_PORT: number = config.get("database.port");
const DATABASE_USER: string = config.get("database.user");
const DATABASE_PASSWORD: string = config.get("database.password");
const DATABASE_NAME: string = config.get("database.database");

/**
 * Repository Registry (for dependency injection)
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class RepositoryRegistry implements Runnable {

  private readonly postgresDriver: PostgresDriver;

  public readonly appealsRepository: AppealsRepository;
  public readonly lotsRepository: LotsRepository;
  public readonly rolesRepository: RolesRepository;
  public readonly statesRepository: StatesRepository;
  public readonly ticketsRepository: TicketsRepository;
  public readonly usersRepository: UsersRepository;
  public readonly verdictsRepository: VerdictsRepository;
  public readonly violationTypesRepository: ViolationTypesRepository;

  constructor() {
    this.postgresDriver = new PostgresDriver(DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME);

    this.appealsRepository = new AppealsRepository(this.postgresDriver);
    this.lotsRepository = new LotsRepository(this.postgresDriver);
    this.rolesRepository = new RolesRepository(this.postgresDriver);
    this.statesRepository = new StatesRepository(this.postgresDriver);
    this.ticketsRepository = new TicketsRepository(this.postgresDriver);
    this.usersRepository = new UsersRepository(this.postgresDriver);
    this.verdictsRepository = new VerdictsRepository(this.postgresDriver);
    this.violationTypesRepository = new ViolationTypesRepository(this.postgresDriver);
  }

  public async start(): Promise<void> {
    await this.postgresDriver.start();
  }

  public async stop(): Promise<void> {
    await this.postgresDriver.stop();
  }

}