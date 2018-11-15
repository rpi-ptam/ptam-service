export class TicketNormalizer {

  public static normalizePairedTicketPostgres(payload: any) {
    return {
      id: payload.t_id,
      violator_id: payload.t_violator_id,
      external_id: payload.t_external_id,
      lot_id: payload.t_lot_id,
      make: payload.t_make,
      model: payload.t_model,
      tag: payload.t_tag,
      plate_state_id: payload.t_plate_state_id,
      amount: payload.t_amount,
      issued_at: payload.t_issued_at,
      violation_type_id: payload.t_violation_type_id
    }
  }

}