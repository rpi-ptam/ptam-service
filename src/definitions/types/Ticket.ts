export type Ticket = {
  id?: number,
  violator_id: number,
  external_id: string,
  lot_id: number,
  make: string,
  model: string,
  tag: string,
  plate_state_id: number,
  amount: number,
  issued_at: string
}