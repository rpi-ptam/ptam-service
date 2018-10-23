"use strict";

import { Repository } from "../definitions/Repository";
import { PostgresDriver } from "../services/PostgresDriver";
import { Appeal } from "../definitions/types/Appeal";
import { AppealTicketPair } from "../definitions/types/AppealTicketPair";
import { QueryResult } from "pg";
import {Ticket} from "../definitions/types/Ticket";

/**
 * Appeals Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class AppealsRepository extends Repository {

  constructor(postgresDriver: PostgresDriver) {
    super(postgresDriver);
  }

  public async insertAppeal(appeal: Appeal): Promise<number> {
    const statement = "INSERT INTO appeals (ticket_id, justification, appealed_at) VALUES ($1, $2, $3) RETURNING id";
    const result = await this.postgresDriver.query(statement, [appeal.ticket_id, appeal.justification, "NOW()"]);
    return result.rows[0]["id"];
  }

  public async getByTicketId(ticketId: number): Promise<Appeal|null> {
    const statement = "SELECT id, ticket_id, justification, appealed_at, verdict_id, verdict_comment, reviewed_by, reviewed_at "
      + "FROM appeals WHERE ticket_id = $1";
    const result = await this.postgresDriver.query(statement, [ticketId]);
    if (result.rowCount < 1) return null;
    return result.rows[0];
  }

  public async updateVerdict(ticketId: number, verdictId: number, verdictComment: string | null, reviewedBy: number): Promise<void> {
    const statement = "UPDATE appeals SET verdict_id = $1, verdict_comment = $2, reviewed_by = $3, reviewed_at = NOW() WHERE ticket_id = $4";
    await this.postgresDriver.query(statement, [verdictId, verdictComment, reviewedBy, ticketId]);
  }

  public async getUndecidedAppealsBulk(start: number, count: number): Promise<Array<AppealTicketPair>> {
    const statement = this.getAppealsBulkSelectBase() +
      "WHERE a.reviewed_by IS NULL AND a.id >= $1 " +
      "ORDER BY a_id DESC LIMIT $2";
    const result = await this.postgresDriver.query(statement, [start, count]);
    return this.normalizeBulkResult(result);
  }

  public async getDecidedAppealsBulk(start: number, count: number): Promise<Array<AppealTicketPair>> {
    const statement = this.getAppealsBulkSelectBase()
      + "WHERE a.reviewed_by IS NOT NULL AND a.id >= $1 "
      + "ORDER BY a_id DESC LIMIT $2";
    const result = await this.postgresDriver.query(statement, [start, count]);
    return this.normalizeBulkResult(result);
  }

  public async getAppealsBulk(start: number, count: number): Promise<Array<AppealTicketPair>> {
    const statement = this.getAppealsBulkSelectBase()
      + "WHERE a.id >= $1 ORDER BY a_id DESC LIMIT $2";
    const result = await this.postgresDriver.query(statement, [start, count]);
    return this.normalizeBulkResult(result);
  }

  private getAppealsBulkSelectBase(): string {
    return "SELECT a.id as a_id, a.ticket_id as a_ticket_id, a.justification as a_justification, " +
      "a.appealed_at as a_appealed_at, a.verdict_id as a_verdict_id, a.verdict_comment as a_verdict_comment, " +
      "a.reviewed_by as a_reviewed_by, a.reviewed_at as a_reviewed_at, t.id as t_id, t.violator_id as t_violator_id, " +
      "t.external_id as t_external_id, t.lot_id as t_lot_id, t.make as t_make, t.model as t_model, t.tag as t_tag, " +
      "t.plate_state_id as t_plate_state_id, t.amount as t_amount, t.issued_at as t_issued_at " +
      "FROM appeals a INNER JOIN tickets t ON a.ticket_id = t.id ";
  }

  private normalizeBulkAppeal(row: any): Appeal {
    return {
      id: row.a_id,
      ticket_id: row.a_ticket_id,
      justification: row.a_justification,
      appealed_at: row.a_appealed_at,
      verdict_id: row.a_verdict_id,
      verdict_comment: row.a_verdict_comment,
      reviewed_by: row.a_reviewed_by,
      reviewed_at: row.a_reviewed_at
    }
  }

  private normalizeBulkTicket(row: any): Ticket {
    return {
      id: row.t_id,
      violator_id: row.t_violator_id,
      external_id: row.t_external_id,
      lot_id: row.t_lot_id,
      make: row.t_make,
      model: row.t_model,
      tag: row.t_tag,
      plate_state_id: row.t_plate_state_id,
      amount: row.t_amount,
      issued_at: row._t_isssued_at
    }
  }

  private normalizeBulkResult(result: QueryResult): Array<AppealTicketPair> {
    const pairs: Array<AppealTicketPair> = [];
    for (let i = 0; i < result.rowCount; i++) {
      const row = result.rows[i];
      const appeal = this.normalizeBulkAppeal(row);
      const ticket = this.normalizeBulkTicket(row);
      pairs.push({ appeal, ticket });
    }
    return pairs;
  }

}