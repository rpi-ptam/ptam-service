"use strict";

import { Repository } from "../definitions/Repository";
import { PostgresDriver } from "../services/PostgresDriver";
import { Ticket } from "../definitions/types/Ticket";

/**
 * Tickets Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class TicketsRepository extends Repository {

  constructor(postgresDriver: PostgresDriver) {
    super(postgresDriver);
  }

  public async insertTicket(ticket: Ticket): Promise<number> {
    const statement = "INSERT INTO tickets (violator_id, external_id, lot_id, make, model, tag, plate_state_id, amount, issued_at) RETURNING id"
      + "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
    const values = [ticket.violator_id, ticket.external_id, ticket.lot_id, ticket.make, ticket.model, ticket.tag, ticket.plate_state_id, ticket.amount, ticket.issued_at];
    const result = await this.postgresDriver.query(statement, values);
    return result.rows[0]["id"];
  }

  public async getById(id: number): Promise<Ticket|null> {
    const statement = "SELECT id, violator_id, external_id, lot_id, make, model, tag, plate_state_id, amount, issued_at "
      + "FROM tickets WHERE id = $1";
    const result = await this.postgresDriver.query(statement, [id]);
    if (result.rowCount < 1) return null;
    return result.rows[0];
  }

}