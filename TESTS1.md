# Test Run Log (Foundry)

Command:

```
PATH="$HOME/.foundry/bin:$PATH" corepack pnpm -C packages/contracts test
```

Result:

```
No files changed, compilation skipped

Ran 1 test for test/BlendedVaultReentrancy.t.sol:BlendedVaultReentrancyTest
[PASS] testReentrancyGuardOnRebalance() (gas: 1665218)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 1.41ms (327.35us CPU time)

Ran 4 tests for test/BlendedVaultTimelock.t.sol:BlendedVaultTimelockTest
[PASS] testAddStrategyRequiresTimelock() (gas: 1138784)
[PASS] testCapIncreaseRequiresTimelock() (gas: 51655)
[PASS] testMaxDailyIncreaseRequiresTimelock() (gas: 58556)
[PASS] testTierIncreaseRequiresTimelock() (gas: 60027)
Suite result: ok. 4 passed; 0 failed; 0 skipped; finished in 1.34ms (337.35us CPU time)

Ran 6 tests for test/BlendedVaultFees.t.sol:BlendedVaultFeesTest
[PASS] testHarvestIntervalRevertsWhenTooSoon() (gas: 321090)
[PASS] testHarvestMintsFeeShares() (gas: 381765)
[PASS] testHarvestNoFeeOnLoss() (gas: 327808)
[PASS] testHarvestRevertsOnExcessiveDailyIncrease() (gas: 381439)
[PASS] testHarvestSameBlockReverts() (gas: 318108)
[PASS] testMultipleDepositorsFeeAccrual() (gas: 538713)
Suite result: ok. 6 passed; 0 failed; 0 skipped; finished in 19.28ms (1.62ms CPU time)

Ran 4 tests for test/BlendedVaultFuzz.t.sol:BlendedVaultFuzzTest
[PASS] testFirstDepositBelowMinimumReverts() (gas: 4390034)
[PASS] testFuzz_convertToAssetsMonotonic(uint256,uint256) (runs: 256, mu: 46024, ~: 46017)
[PASS] testFuzz_convertToSharesMonotonic(uint256,uint256) (runs: 256, mu: 48848, ~: 48833)
[PASS] testNoShareInflationOnFirstDeposit() (gas: 4436424)
Suite result: ok. 4 passed; 0 failed; 0 skipped; finished in 20.43ms (32.84ms CPU time)

Ran 9 tests for test/BlendedVault.t.sol:BlendedVaultTest
[PASS] testAllocatorRoleRequiredForRebalance() (gas: 19122)
[PASS] testDepositAllocatesByCap() (gas: 369249)
[PASS] testDepositZeroAssetsReverts() (gas: 19616)
[PASS] testGuardianRoleRequiredForPause() (gas: 10862)
[PASS] testPauseSemantics() (gas: 330560)
[PASS] testRebalanceRespectsCap() (gas: 434277)
[PASS] testRebalanceRespectsTierLimit() (gas: 439872)
[PASS] testWithdrawRevertsWhenInsufficientLiquidity() (gas: 353557)
[PASS] testWithdrawUsesQueueOrder() (gas: 474104)
Suite result: ok. 9 passed; 0 failed; 0 skipped; finished in 20.46ms (2.25ms CPU time)

Ran 5 test suites in 21.53ms (62.93ms CPU time): 24 tests passed, 0 failed, 0 skipped (24 total tests)
```
