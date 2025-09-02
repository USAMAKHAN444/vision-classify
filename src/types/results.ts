export interface ClassificationResult {
  credit_cards?: Array<{ card_id: number; front?: string; back?: string; filename?: string }>;
  pos_receipts?: Array<{ pos_id: number; filename: string }>;
  facturas?: Array<{ factura_id: number; filename: string }>;
  credit_card_slips?: Array<{ slip_id: number; filename: string }>;
  passports?: Array<{ passport_id: number; filename: string }>;
  entry_stamps?: Array<{ stamp_id: number; filename: string }>;
  cruise_ids?: Array<{ cruise_id: number; filename: string }>;
  cruise_schedules?: Array<{ schedule_id: number; filename: string }>;
  boarding_passes?: Array<{ boarding_pass_id: number; filename: string }>;
  other_documents?: Array<{ other_id: number; filename: string }>;
}


