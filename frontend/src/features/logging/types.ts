export interface Log {
  id: string;
  userId: string;
  actionType: string;
  tableName: string;
  recordId: string;
  details: string | null;
  timestamp: Date;
}
