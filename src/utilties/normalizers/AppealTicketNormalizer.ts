import { QueryResult } from "pg";

import { AppealNormalizer } from "./AppealNormalizer";
import { TicketNormalizer } from "./TicketNormalizer";
import { AppealTicketPair } from "../../definitions/types/AppealTicketPair";

export class AppealTicketNormalizer {

  public static normalizeBulkResultPostgres(result: QueryResult): Array<AppealTicketPair> {
    const pairs: Array<AppealTicketPair> = [];
    for (let i = 0; i < result.rowCount; i++) {
      const row = result.rows[i];
      pairs.push(this.normalizeResultPostgres(row));
    }
    return pairs;
  }

  public static normalizeResultPostgres(payload: any): AppealTicketPair {
    const appeal = AppealNormalizer.normalizePairedAppealPostgres(payload);
    const ticket = TicketNormalizer.normalizePairedTicketPostgres(payload);
    return { appeal, ticket };
  }

}