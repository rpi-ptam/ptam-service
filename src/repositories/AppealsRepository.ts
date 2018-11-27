;

import { Appeal } from "../definitions/types/Appeal";
import { Repository } from "../definitions/Repository";
import { AppealTicketPair } from "../definitions/types/AppealTicketPair";
import { AppealStatistics } from "../definitions/types/AppealStatistics";

import { AppealTicketNormalizer } from "../utilties/normalizers/AppealTicketNormalizer";

/**
 * Appeals Repository
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class AppealsRepository extends Repository {

  public async insertAppeal(appeal: Appeal): Promise<number> {
    const statement = "INSERT INTO appeals (ticket_id, justification, appealed_at) VALUES ($1, $2, $3) RETURNING id";
    const result = await this.postgresDriver.query(statement, [appeal.ticket_id, appeal.justification, "NOW()"]);
    return result.rows[0]["id"];
  }

  public async getWithTicketById(id: number): Promise<AppealTicketPair|null> {
    const statement = this.getAppealTicketPairQuery("a.id = $1");
    const result = await this.postgresDriver.query(statement, [id, 1]);
    if (result.rowCount < 1) return null;
    return AppealTicketNormalizer.normalizeResultPostgres(result.rows[0]);
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
    return this.getAppealsBulkPostgres(start, count, "a.reviewed_by IS NULL AND a.id >= $1");
  }

  public async getDecidedAppealsBulk(start: number, count: number): Promise<Array<AppealTicketPair>> {
    return this.getAppealsBulkPostgres(start, count, "a.reviewed_by IS NOT NULL AND a.id >= $1");
  }

  public async getAppealsBulk(start: number, count: number): Promise<Array<AppealTicketPair>> {
    return this.getAppealsBulkPostgres(start, count, "a.id >= $1");
  }

  private async getAppealsBulkPostgres(start: number, count: number, whereClause: string): Promise<Array<AppealTicketPair>> {
    const statement = this.getAppealTicketPairQuery(whereClause);
    const result = await this.postgresDriver.query(statement, [start, count]);
    return AppealTicketNormalizer.normalizeBulkResultPostgres(result);
  }

  public async removeById(id: number): Promise<void> {
    const statement = "DELETE FROM appeals WHERE id = $1";
    await this.postgresDriver.query(statement, [id]);
  }

  private getAppealTicketPairQuery(whereClause: string): string {
    return "SELECT a.id as a_id, a.ticket_id as a_ticket_id, a.justification as a_justification, " +
      "a.appealed_at as a_appealed_at, a.verdict_id as a_verdict_id, a.verdict_comment as a_verdict_comment, " +
      "a.reviewed_by as a_reviewed_by, a.reviewed_at as a_reviewed_at, t.id as t_id, t.violator_id as t_violator_id, t.violation_type_id as t_violation_type_id, " +
      "t.external_id as t_external_id, t.lot_id as t_lot_id, t.make as t_make, t.model as t_model, t.tag as t_tag, " +
      "t.plate_state_id as t_plate_state_id, t.amount as t_amount, t.issued_at as t_issued_at " +
      "FROM appeals a INNER JOIN tickets t ON a.ticket_id = t.id " + 
      "WHERE " + whereClause + " ORDER BY a_id DESC LIMIT $2";
  }

  public async getStatistics(): Promise<AppealStatistics> {
    const statement = "SELECT count(a.id) FILTER (WHERE a.reviewed_by IS NULL) as open_appeals, " +
      "count(a.id) FILTER (WHERE EXTRACT(DAYS FROM age(NOW(), a.appealed_at)) < 7) as appeals_this_week, " +
      "count(a.id) FILTER (WHERE EXTRACT(MONTHS FROM age(NOW(), a.appealed_at)) < 1) as appeals_this_month, " +
      "count(a.id) FILTER (WHERE EXTRACT(YEARS FROM age(NOW(), a.appealed_at)) < 1) as appeals_this_year, " +
      "count(a.id) FILTER (WHERE EXTRACT(DAYS FROM age(NOW(), a.reviewed_at)) < 7) as appeals_reviewed_this_week, " +
      "count(a.id) FILTER (WHERE EXTRACT(MONTHS FROM age(NOW(), a.reviewed_at)) < 1) as appeals_reviewed_this_month, " +
      "count(a.id) FILTER (WHERE EXTRACT(YEARS FROM age(NOW(), a.reviewed_at)) < 1) as appeals_reviewed_this_year, " +
      "count(a.id) AS total_appeals " +
      "FROM appeals a " +
      "INNER JOIN tickets t on a.ticket_id = t.id";
    const result = await this.postgresDriver.query(statement);
    return result.rows[0];
  }

}