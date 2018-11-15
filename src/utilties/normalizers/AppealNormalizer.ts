export class AppealNormalizer {

  public static normalizePairedAppealPostgres(payload: any) {
    return {
      id: payload.a_id,
      ticket_id: payload.a_ticket_id,
      justification: payload.a_justification,
      appealed_at: payload.a_appealed_at,
      verdict_id: payload.a_verdict_id,
      verdict: null,
      verdict_comment: payload.a_verdict_comment,
      reviewed_by: payload.a_reviewed_by,
      reviewed_at: payload.a_reviewed_at
    }
  }

}