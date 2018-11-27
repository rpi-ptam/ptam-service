;

import { Repository } from "../definitions/Repository";
import { Ticket } from "../definitions/types/Ticket";

/**
 * Tickets Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class TicketsRepository extends Repository {

  public async insertTicket(ticket: Ticket): Promise<number> {
    const statement = "INSERT INTO tickets (violator_id, external_id, lot_id, make, model, tag, plate_state_id, amount, issued_at, violation_type_id) "
      + "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id";
    const values = [ticket.violator_id, ticket.external_id, ticket.lot_id, ticket.make, ticket.model, ticket.tag, ticket.plate_state_id, ticket.amount, ticket.issued_at, ticket.violation_type_id];
    const result = await this.postgresDriver.query(statement, values);
    return result.rows[0]["id"];
  }

  public async getByExternalId(externalId: number): Promise<Ticket|null> {
    const statement = "SELECT id, violator_id, external_id, lot_id, make, model, tag, plate_state_id, amount, issued_at "
      + "FROM tickets WHERE external_id = $1";
    const result = await this.postgresDriver.query(statement, [externalId]);
    if (result.rowCount < 1) return null;
    return result.rows[0];
  }

  public async getById(id: number): Promise<Ticket|null> {
    const statement = "SELECT id, violator_id, external_id, lot_id, make, model, tag, plate_state_id, amount, issued_at "
      + "FROM tickets WHERE id = $1";
    const result = await this.postgresDriver.query(statement, [id]);
    if (result.rowCount < 1) return null;
    return result.rows[0];
  }

  public async removeById(id: number): Promise<void> {
    const statement = "DELETE FROM tickets WHERE id = $1";
    await this.postgresDriver.query(statement, [id]);
  }

}