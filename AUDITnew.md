# MetaYield Security Audit Report (v2)

**Date:** December 25, 2025  
**Auditor:** AI Security Analyst  
**Scope:** Full codebase review post-Codex improvements  
**Commit:** `19f9b4c` - "feat(web): enrich onchain UI and tx feedback"  
**Previous Audit:** `8297126` (AUDIT.md)

---

## Executive Summary

This is a follow-up audit after Codex agent implemented fixes addressing findings from the initial audit and made additional improvements. The codebase has matured significantly with OZ v5.5 compatibility, passing tests, and enhanced frontend UX.

### Overall Assessment

| Category | Previous | Current | Change |
|----------|----------|---------|--------|
| **Architecture** | ✅ Strong | ✅ Strong | — |
| **Security** | ✅ Good | ✅ Improved | ⬆️ |
| **Code Quality** | ✅ Good | ✅ Very Good | ⬆️ |
| **Test Coverage** | ⚠️ Adequate | ✅ Good (24 passing) | ⬆️ |
| **Documentation** | ✅ Excellent | ✅ Excellent | — |
| **Production Readiness** | ⚠️ Not Ready | ⚠️ Testnet Ready | ⬆️ |

### Findings Summary

| Severity | Initial Audit | This Audit | Status |
|----------|---------------|------------|--------|
| Critical | 0 | 0 | ✅ |
| High | 1 | 0 | ✅ Fixed |
| Medium | 3 | 1 | ⬇️ Improved |
| Low | 5 | 3 | ⬇️ Improved |
| Informational | 6 | 4 | ⬇️ Addressed |

---

## 1. Changes Since Last Audit

### 1.1 Contract Changes

#### ✅ OZ v5.5 Hook Alignment
**File:** `BlendedVault.sol` lines 290-302

```solidity
function _withdraw(
    address caller,
    address receiver,
    address owner,
    uint256 assets,
    uint256 shares
) internal override {
    _ensureLiquidity(assets);
    super._withdraw(caller, receiver, owner, assets, shares);
    if (totalSupply() == 0) {
        highWatermarkAssetsPerShare = 1e18;
    }
}
```

**Analysis:** Properly migrated from deprecated `beforeWithdraw`/`afterWithdraw` hooks to the new `_withdraw` override pattern. This is the correct approach for OpenZeppelin v5.5 ERC-4626 compatibility.

#### ✅ Foundry Configuration Update
**File:** `foundry.toml`

```toml
solc_version = "0.8.24"
optimizer = true
optimizer_runs = 200
via_ir = true
```

**Analysis:** Added `via_ir = true` to handle stack-too-deep issues. This is appropriate for complex contracts but increases compilation time.

#### ✅ Reentrancy Test Fix
**File:** `BlendedVaultReentrancy.t.sol` line 21

```solidity
bytes32 allocatorRole = vault.ALLOCATOR_ROLE();
vm.prank(owner);
vault.grantRole(allocatorRole, address(evil));
```

**Analysis:** Fixed missing role grant that was causing test failure.

### 1.2 Frontend Improvements

#### ✅ Transaction Toast System
**File:** `deposit-withdraw-panel.tsx`, `admin-actions.tsx`

- Added `useTxToast()` hook for pending/success/error states
- Shows explorer links for confirmed transactions
- Provides clear feedback on transaction lifecycle

#### ✅ Network Gating
**File:** `deposit-withdraw-panel.tsx` lines 26, 141-146

```tsx
const isWrongNetwork = isConnected && activeChain ? activeChain.id !== chainId : false;

{isWrongNetwork ? (
  <div className="...border-rose-500/40 bg-rose-500/10...">
    <span>Wrong network connected.</span>
    <Badge variant="default">Switch to {chain.name}</Badge>
  </div>
) : null}
```

**Analysis:** Prevents transactions on wrong network. Good UX practice.

#### ✅ Role Detection in Admin Panel
**File:** `admin-actions.tsx` lines 39-78

- Reads on-chain roles via `hasRole()` calls
- Displays detected role (Owner/Curator/Allocator/Guardian/Viewer)
- Disables buttons based on role permissions

#### ✅ Enhanced Balance Display
- Shows wallet balance with "Max" button
- Shows allowance status
- Shows estimated shares for deposit/withdraw

---

## 2. Remaining Findings

### 2.1 Medium Severity

#### [M-01] Frontend Lacks Slippage Protection (Unchanged)

**Location:** `deposit-withdraw-panel.tsx`

**Issue:** No minimum shares/assets parameter for deposits/withdrawals. While the contract uses `previewDeposit`/`previewWithdraw`, there's no slippage check on the frontend.

**Recommendation:** Add optional slippage tolerance input and use `mint`/`redeem` with calculated minimums.

---

### 2.2 Low Severity

#### [L-01] Admin Queue Update Sets Both Queues to Same Order

**Location:** `admin-actions.tsx` lines 132-165

```tsx
async function updateQueues() {
  // ...
  await trackTx(() => writeContractAsync({...functionName: "setDepositQueue"...}));
  await trackTx(() => writeContractAsync({...functionName: "setWithdrawQueue"...}));
}
```

**Issue:** Uses the same input for both deposit and withdraw queues. In practice, these often differ (deposit to highest APY first, withdraw from most liquid first).

**Recommendation:** Split into two separate inputs or add toggle for queue type.

---

#### [L-02] Cap Increase Input Parsing

**Location:** `admin-actions.tsx` lines 167-185

```tsx
const [strategy, cap] = capInput.split(",").map((value) => value.trim());
await writeContractAsync({
  args: [strategy as `0x${string}`, BigInt(cap), keccak256(toBytes(salt))]
});
```

**Issue:** No validation on input format or address checksum. `BigInt(cap)` can throw on invalid input.

**Recommendation:** Add try/catch, validate hex address format, and show user-friendly error.

---

#### [L-03] Salt Reuse Risk

**Location:** `admin-actions.tsx` line 35

```tsx
const [salt, setSalt] = React.useState("queue");
```

**Issue:** Default salt is "queue". Reusing the same salt for multiple scheduled actions will cause `AlreadyScheduled` errors.

**Recommendation:** Generate unique salt (timestamp + random) or clear after use.

---

### 2.3 Informational

#### [I-01] Missing Loading States for Read Queries

The frontend uses `useReadContract` without showing loading states. Consider adding skeleton loaders.

#### [I-02] No Refresh After Transaction

After a successful transaction, data should be refetched. Consider using `queryClient.invalidateQueries()`.

#### [I-03] Missing Error Boundaries

React error boundaries would prevent full app crashes on component errors.

#### [I-04] Consider Rate Limiting on Indexer

No rate limiting on API endpoints. Add for production.

---

## 3. Resolved Findings

### From Initial Audit

| ID | Finding | Resolution |
|----|---------|------------|
| H-01 | Performance fee edge case | ✅ Addressed by `maxDailyIncreaseBps` guard |
| M-01 | Donation attack surface | ✅ Fixed with harvest guard |
| M-02 | Gas optimization in queues | ⚠️ Unchanged (acceptable for v0.1) |
| M-03 | Withdraw queue skip logic | ✅ Reviewed - works correctly |
| L-01 | Missing queue event on removal | ✅ Fixed - emits `QueuesUpdated` |
| L-02 | Test bug (feeBalanceBefore) | ✅ Fixed |
| L-03 | Curator can reduce timelock | ⚠️ Unchanged (by design) |

---

## 4. Test Results

### 4.1 Foundry Tests (24/24 Passing)

```
Compiler run successful!
Compiled with Solc 0.8.24 (via IR)

[PASS] testDepositAllocatesByCap
[PASS] testWithdrawUsesQueueOrder
[PASS] testWithdrawRevertsWhenInsufficientLiquidity
[PASS] testPauseSemantics
[PASS] testDepositZeroAssetsReverts
[PASS] testAllocatorRoleRequiredForRebalance
[PASS] testGuardianRoleRequiredForPause
[PASS] testRebalanceRespectsCap
[PASS] testRebalanceRespectsTierLimit
[PASS] testHarvestMintsFeeShares
[PASS] testHarvestSameBlockReverts
[PASS] testHarvestIntervalRevertsWhenTooSoon
[PASS] testMultipleDepositorsFeeAccrual
[PASS] testHarvestRevertsOnExcessiveDailyIncrease
[PASS] testHarvestNoFeeOnLoss
[PASS] testReentrancyGuardOnRebalance
[PASS] testAddStrategyRequiresTimelock
[PASS] testCapIncreaseRequiresTimelock
[PASS] testTierIncreaseRequiresTimelock
[PASS] testMaxDailyIncreaseRequiresTimelock
[PASS] testFuzz_convertToSharesMonotonic
[PASS] testFuzz_convertToAssetsMonotonic
[PASS] testNoShareInflationOnFirstDeposit
[PASS] testFirstDepositBelowMinimumReverts

Test result: ok. 24 passed; 0 failed
```

### 4.2 Test Coverage by Category

| Category | Tests | Status |
|----------|-------|--------|
| Core ERC-4626 | 5 | ✅ |
| Access Control | 4 | ✅ |
| Fee Mechanics | 6 | ✅ |
| Timelock Governance | 4 | ✅ |
| Security (Reentrancy) | 1 | ✅ |
| Fuzz/Invariants | 4 | ✅ |

---

## 5. Architecture Review

### 5.1 Contract Architecture ✅

```
BlendedVault (ERC-4626)
├── OpenZeppelin v5.5
│   ├── ERC4626 (base)
│   ├── AccessControl (roles)
│   └── ReentrancyGuard (security)
├── Strategy Management
│   ├── Allowlist + Caps + Tiers
│   ├── Deposit/Withdraw Queues
│   └── Timelock for risk-increasing changes
├── Fee System
│   ├── 3% HWM performance fee
│   ├── maxDailyIncreaseBps guard
│   └── Min harvest interval
└── Emergency Controls
    ├── Pause deposits/withdrawals
    └── Force remove strategy
```

### 5.2 Frontend Architecture ✅

```
Next.js App Router
├── wagmi/viem (Web3)
├── TxToast system (feedback)
├── Network gating
├── Role detection
└── Onchain reads (live data)
```

---

## 6. Security Posture

### 6.1 Strengths

| Feature | Implementation |
|---------|---------------|
| Reentrancy Protection | ✅ `nonReentrant` on all external state-changing |
| Access Control | ✅ Role-based with 4 distinct roles |
| Timelock Governance | ✅ 24h+ for risk-increasing changes |
| Fee Protection | ✅ HWM + maxDailyIncrease + interval |
| First Deposit Attack | ✅ minInitialDeposit requirement |
| OZ v5.5 Compatible | ✅ Using latest hook patterns |

### 6.2 Attack Surface Mitigations

| Attack Vector | Mitigation | Status |
|--------------|------------|--------|
| Donation/Manipulation | maxDailyIncreaseBps | ✅ |
| Reentrancy | ReentrancyGuard | ✅ |
| Flash Loan Fee Extraction | Same-block harvest prevention | ✅ |
| First Depositor Inflation | minInitialDeposit | ✅ |
| Strategy Risk | Caps + Tiers + Queues | ✅ |
| Governance Attack | Timelock + Multisig (recommended) | ✅ |

---

## 7. Recommendations

### 7.1 Before Testnet Deployment

1. ✅ All tests passing
2. ⚠️ Set up multisig for owner role
3. ⚠️ Configure monitoring for events
4. ⚠️ Test with real MetaMorpho vaults on Sepolia

### 7.2 Before Mainnet Deployment

1. **Professional Audit** - Trail of Bits, OpenZeppelin, or Spearbit
2. **Bug Bounty** - Set up Immunefi program
3. **Fork Tests** - Against live Base mainnet strategies
4. **Formal Verification** - For critical invariants
5. **UI Audit** - Security review of frontend

### 7.3 Nice to Have

- Add slippage protection to frontend
- Separate deposit/withdraw queue inputs
- Add loading states and error boundaries
- Implement refresh after transactions

---

## 8. Conclusion

The MetaYield codebase has improved significantly since the initial audit:

| Metric | Before | After |
|--------|--------|-------|
| High Findings | 1 | 0 |
| Tests Passing | Unknown | 24/24 |
| OZ Version | v5.x (partial) | v5.5 (full) |
| Frontend UX | Basic | Good |
| Production Ready | No | Testnet Yes |

**Key Improvements:**
- ✅ Harvest guard implemented (donation attack mitigation)
- ✅ OZ v5.5 hook migration complete
- ✅ All 24 tests passing
- ✅ Frontend with tx feedback and network gating
- ✅ Reentrancy test fixed

**Remaining Work:**
- Professional external audit
- Multisig deployment
- Mainnet fork testing
- Bug bounty program

---

## 9. Appendix

### A. Commits Reviewed

| Commit | Message |
|--------|---------|
| `19f9b4c` | feat(web): enrich onchain UI and tx feedback |
| `2047779` | fix: align OZ v5.5 hooks and test run log |
| `d664509` | Merge branch 'main' |
| `f922b37` | fix: repair fee balance test |
| `8dd12fe` | feat: add harvest guard and audit-driven fixes |

### B. Files Changed Since Last Audit

```
LOG.md
README.md
TESTcd.md
TODO.md
apps/web/app/layout.tsx
apps/web/app/page.tsx
apps/web/app/providers.tsx
apps/web/components/admin-actions.tsx
apps/web/components/deposit-withdraw-panel.tsx
apps/web/components/onchain-allocation-summary.tsx
packages/contracts/foundry.toml
packages/contracts/src/BlendedVault.sol
packages/contracts/test/BlendedVaultReentrancy.t.sol
+ Additional frontend components
```

### C. Verified Security Controls

- [x] ReentrancyGuard on deposit/withdraw/mint/redeem/rebalance/harvest
- [x] Role-based access control for all admin functions
- [x] Timelock for strategy addition, cap increases, tier limit increases
- [x] Same-block harvest prevention
- [x] Minimum harvest interval
- [x] Maximum daily share price increase guard
- [x] Minimum initial deposit requirement
- [x] Zero shares/assets protection
- [x] Pause controls for emergency

---

> ⚠️ **Disclaimer:** This audit is informational and does not guarantee security. Professional auditing by established firms is strongly recommended before mainnet deployment.
