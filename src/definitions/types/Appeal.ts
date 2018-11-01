export type Appeal = {
  id?: number,
  ticket_id: number
  justification: string,
  appealed_at: string,
  verdict_id?: number | null,
  verdict_comment?: string,
  reviewed_by?: number,
  reviewed_at?: string,
  verdict: string | null
};