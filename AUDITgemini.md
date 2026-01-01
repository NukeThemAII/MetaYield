# EarnGrid Audit Report

**Date:** January 1, 2026
**Auditor:** Gemini (AI Security Analyst)
**Scope:** `BlendedVault.sol` and Test Suite

## Summary

This audit follows a previous audit by Claude Opus 4.5 and focuses on verifying recent fixes and overall system integrity. The codebase has been improved significantly, addressing key risks related to strategy failure and ERC-4626 compliance.

## Verification of Fixes

### 1. Strategy Failure Resilience
**Status: Verified ✅**
- `totalAssets()` now uses `_safePreviewRedeem` with a `try/catch` block. This prevents a single reverting strategy from causing a Denial of Service (DoS) for the entire vault.
- `_availableLiquidity()` similarly uses `try/catch` when querying `maxWithdraw`, ensuring that liquidity calculations are robust against broken strategies.

### 2. ERC-4626 Compliance (Withdrawals)
**Status: Verified ✅**
- `maxWithdraw` and `maxRedeem` now correctly cap the returned value at the actual available liquidity using `_availableLiquidity()`.
- This prevents the common issue where a vault promises more withdrawal capability than it can fulfill, which would lead to transaction reverts for users.
- **Test Update:** The test `testWithdrawRevertsWhenInsufficientLiquidity` was updated to expect the standard `ERC4626ExceededMaxWithdraw` error instead of a custom error, aligning with the spec.

## Remaining Observations

### 1. Gas Usage in Loops
**Severity: Low/Informational**
- `totalAssets`, `_availableLiquidity`, and `_currentTierExposure` iterate over `strategyList` or `withdrawQueue`.
- While necessary for the logic, an unbounded number of strategies could lead to block gas limit issues.
- **Recommendation:** Keep the number of active strategies reasonable (e.g., < 20). The current implementation assumes a permissioned `addStrategy` flow, which mitigates this risk operationally.

### 2. Fee on Deposit Drag
**Severity: Informational**
- As noted in previous audits, performance fees are not accrued *during* a deposit. If `assetsPerShare` is significantly above the High Water Mark (HWM), a new depositor might effectively pay a portion of the fee for gains they didn't earn (dilution upon next harvest).
- **Status:** Accepted trade-off for gas efficiency.

## Test Suite Quality

- **Coverage:** 25 tests covering core flows, fees, timelocks, and reentrancy.
- **Status:** All 25 tests passed in the latest run.
- **Robustness:** The tests explicitly check for revert reasons and role access, which is good practice.

## Conclusion

The `BlendedVault` contract is in a strong state for a v1.0 release. The critical stability issues have been resolved, and the system fails gracefully in the presence of faulty underlying strategies.

**Recommendation:** Proceed with deployment, maintaining strict control over the `strategyList` size and the quality of whitelisted strategies.
