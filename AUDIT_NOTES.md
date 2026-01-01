# EarnGrid Audit Notes

## System Overview
- **Type:** ERC-4626 Vault of Vaults (USDC)
- **Chain:** Base
- **Components:**
  - `BlendedVault.sol`: Core logic, strict ERC-4626 compliance.
  - `Indexer`: Node.js service for historical data and APY.
  - `Web`: Next.js dashboard.

## Codebase Status
- **Contracts:** clean, well-structured, modular (standard OpenZeppelin dependencies).
- **Security:** 
  - `ReentrancyGuard` used.
  - Role-based access control (`AccessControl`).
  - Timelock for risk parameters.
  - Pausability for emergencies.
- **Complexity:** Low to Medium. "Synchronous" strategy requirement simplifies logic significantly but relies on `maxWithdraw` / `maxDeposit` being accurate and gas-efficient.

## Observations & Risks

### 1. Fee Drag on Deposits
- **Issue:** `harvest()` is not called on `deposit()`.
- **Impact:** Users depositing when `assetsPerShare > HWM` buy in at the "pre-fee" price. When `harvest()` runs later, the share price drops (dilution from fee minting). The new user effectively pays a portion of the performance fee for gains they didn't participate in.
- **Mitigation:** Call `harvest()` before `deposit` or accept this as a UX trade-off (cheaper gas for depositors vs. exact fee accounting).

### 2. Strict Withdrawals (`_ensureLiquidity`)
- **Issue:** If `withdrawQueue` strategies are illiquid (paused, locked, or reverted), the main vault's `withdraw` will revert (`NotEnoughLiquidity`).
- **Impact:** User funds can be "stuck" until the guardian/allocator reconfigures the queue or liquidity returns.
- **Mitigation:** This is a design choice ("Strict 4626"). Alternatives involve "scanning" for liquidity (gas heavy) or partial withdrawals (breaks strict 4626).

### 3. DOS Vector in `totalAssets`
- **Issue:** `totalAssets` loops through `strategyList`.
- **Impact:** If `strategyList` grows too large (e.g., > 20-30 strategies), `totalAssets` might exceed the block gas limit, causing the vault to become unusable (cannot deposit, withdraw, or calculate fee).
- **Mitigation:** 
  - Limit the number of strategies (e.g., hard cap in `addStrategy`).
  - Remove unused strategies from the list (currently `removeStrategy` only disables them, `strategyList` grows monotonically).

### 4. Indexer Fragility
- **Issue:** Indexer `tick` uses `multicall` for all strategy assets.
- **Impact:** If one strategy reverts `strategyAssets` (e.g. it's paused or broken), the entire indexer snapshot might fail.
- **Mitigation:** Wrap individual calls in `try/catch` or allow partial success in the indexer logic.

## Ready for Tasks
- Familiar with `BlendedVault` internal accounting.
- Familiar with Roles (`ALLOCATOR`, `CURATOR`, `GUARDIAN`).
- Familiar with deployment and testing flow (`foundry`).
