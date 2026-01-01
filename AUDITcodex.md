# EarnGrid Audit (Codex)

Date: 2026-01-01  
Reviewer: Codex  
Scope: `packages/contracts`, `services/indexer`, `apps/web`, `packages/sdk`, `docs`

Tests: Reported as passing by user; not rerun in this audit.

## Summary
- Architecture and role separation align with docs; HWM fee logic and timelock scheduling are implemented.
- Main risk is vault-wide DoS if a single strategy reverts during accounting.

## Findings

### High
**H-01 Strategy revert DoS via accounting calls**  
Files: `packages/contracts/src/BlendedVault.sol:168`, `packages/contracts/src/BlendedVault.sol:202`, `packages/contracts/src/BlendedVault.sol:875`  
`totalAssets()`, `strategyAssets()`, and `_currentTierExposure()` call `previewRedeem()` on every strategy. If any strategy reverts (paused, upgraded, or malicious), deposits/withdraws/harvest and preview functions revert. This persists even after `forceRemoveStrategy`, because the strategy remains in `strategyList`.  
Recommendation: wrap per-strategy calls in `try/catch` and skip on failure with a health event, or maintain cached strategy balances, or fully remove strategies from `strategyList` with a fallback accounting path.

### Medium
**M-01 Liquidity-unaware `maxWithdraw`/`maxRedeem`**  
File: `packages/contracts/src/BlendedVault.sol:160`  
`maxWithdraw`/`maxRedeem` return the ERC-4626 share-based limit without considering queue liquidity. UIs/integrators can be told a withdraw is possible but it will revert in `_ensureLiquidity`.  
Recommendation: compute a liquidity-aware max based on idle + `withdrawQueue` `maxWithdraw`, or expose an explicit `availableLiquidity()` getter and document the difference.

**M-02 Timelock delay can be reduced immediately**  
File: `packages/contracts/src/BlendedVault.sol:388`  
`setTimelockDelay` can reduce the delay without a timelock, weakening the “risk-increasing changes must be timelocked” policy.  
Recommendation: require timelock for delay reductions, or only allow increases without timelock.

### Low
**L-01 Rebalance ignores strategy `maxDeposit`**  
File: `packages/contracts/src/BlendedVault.sol:680`  
Allocator-provided deposit amounts can exceed a strategy’s `maxDeposit`, causing a revert.  
Recommendation: check `maxDeposit` during `rebalance` and cap or revert early with a clearer error.

**L-02 Admin queue inputs are single-line**  
File: `apps/web/components/admin-actions.tsx:264`  
UI says “one strategy per line” but uses `<Input>`, which does not allow newlines.  
Recommendation: use a textarea or change parsing to comma-separated input.

**L-03 Indexer skips `startBlock` events**  
Files: `services/indexer/src/indexer.ts:30`, `services/indexer/src/indexer.ts:80`  
Initialization sets `lastProcessedBlock = startBlock`, then syncs from `startBlock + 1`, skipping logs at `startBlock`.  
Recommendation: initialize to `startBlock - 1` or query from `startBlock` on first sync.

**L-04 APY precision uses `Number`**  
File: `services/indexer/src/index.ts:153`  
`Number` on 1e18-scaled values loses precision for large TVL / small deltas.  
Recommendation: use bigint fixed-point math or a decimal library for APY.

## Documentation Review
- `docs/ARCHITECTURE.md` still lists open design choices (withdraw behavior, auto-invest, allocation state) that are now decided by implementation. `docs/ARCHITECTURE.md:379`  
- `docs/THREAT_MODEL.md` retains open questions on withdrawal semantics and timelock details. `docs/THREAT_MODEL.md:289`  
- `docs/STRATEGY_UNIVERSE.md` includes multiple `TBD` due-diligence fields (audits, incidents, liquidity). `docs/STRATEGY_UNIVERSE.md` (multiple entries)

## Tests
- Reported passing by user; not rerun in this audit.
- Missing coverage: liquidity-aware `maxWithdraw` behavior, strategy revert handling, and rebalance `maxDeposit` guard.

## Notes
- No tracked code differences detected versus `origin/main` at audit time; untracked artifacts exist locally (e.g., `packages/contracts/foundry.lock`).
