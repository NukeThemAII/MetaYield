import type { Generated } from "kysely";

export type IndexerStateTable = {
  key: string;
  value: string;
};

export type EventsTable = {
  id: Generated<number>;
  block_number: number;
  block_hash: string;
  tx_hash: string;
  log_index: number;
  event_name: string;
  event_data: string;
  created_at: number;
};

export type SnapshotsTable = {
  id: Generated<number>;
  timestamp: number;
  block_number: number;
  total_assets: string;
  total_supply: string;
  assets_per_share: string;
};

export type AllocationSnapshotsTable = {
  id: Generated<number>;
  timestamp: number;
  block_number: number;
  strategy: string;
  assets: string;
  tier: number;
  cap_assets: string;
  enabled: number;
  is_synchronous: number;
};

export type DB = {
  indexer_state: IndexerStateTable;
  events: EventsTable;
  snapshots: SnapshotsTable;
  allocation_snapshots: AllocationSnapshotsTable;
};
