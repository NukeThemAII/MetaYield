Strategy research template for Base USDC strategies used by the BlendedVault.

0) Strategy selection principles (v0.1)

Must-haves

USDC-denominated exposure

Prefer ERC‑4626 strategies with synchronous redeem/withdraw

Strong reputation/audits; clear admin/pausing controls

Sufficient liquidity for our expected TVL

Avoid (v0.1)

Leverage/looping

Strategies requiring DEX swaps to exit

Strategies with long withdrawal queues (unless explicitly supported as v2)

1) Data sources

Official protocol docs

Onchain contracts (verified source)

Dune dashboards / DefiLlama / Vault aggregators (for APY/TVL trends)

Security reports / audits

Record exact links and block numbers where relevant.

2) Candidate strategy table

Fill one row per strategy. Keep values current and cite onchain addresses.

Strategy Name	Protocol	Chain	Asset	Strategy Type	ERC‑4626?	Contract Address	Vault/Market Address (if any)	Withdraw Latency	TVL/Liquidity Notes	APY Source	Admin Keys / Pausable?	Audits	Incidents	Risk Tier (0/1/2)	Suggested Cap (assets)	Adapter Needed?	Notes
(e.g., Gauntlet USD Alpha via Morpho)	Morpho / Gauntlet	Base	USDC	ERC‑4626 vault	Yes	0x…	0x…	(Instant / Limited / Queued)	…	trailing 7d/30d	multisig? pause?	…	…	1	…	No	…
3) Per-strategy deep dive template

Copy/paste this section for each candidate.

3.X Strategy:

Protocol / Product

Protocol:

Product type (lending vault, Aave wrapper, Morpho vault, etc.):

Chain:

Addresses

USDC address:

Strategy vault address:

Any relevant market/pool address:

Verified source links:

ERC‑4626 compatibility checklist

Implements asset(), totalAssets(), deposit(), withdraw(), redeem(), mint()

convertToAssets/convertToShares behave monotonically

previewDeposit/previewWithdraw/previewRedeem behave sensibly

Decimals: asset decimals (USDC=6); share decimals:

Liquidity / withdrawal behavior

Withdraw latency (instant / limited / queued):

Any gates, pauses, cooldowns:

Historical utilization spikes:

Practical max withdraw per tx / per block:

Risk analysis

Primary risk drivers (bad debt, admin risk, oracle risk, integration risk):

Who controls parameters:

Is there an emergency pause:

Known incidents / post-mortems:

Security

Audits (firm, date, scope):

Bug bounty:

Code maturity:

Performance

APY sources (organic vs incentives):

Trailing 7d/30d APY range:

Variance / volatility notes:

Integration notes

Needs adapter? (Y/N)

Any approvals required:

Any special handling (reentrancy, rounding):

Suggested policy

Risk tier (0/1/2):

Suggested cap (assets):

Suggested queue placement (deposit/withdraw priority):

Any circuit breakers (max daily share price change, etc.):

4) v0.1 recommended allowlist (fill)




Tier 0:




Tier 1:




Tier 2:
5) v0.1 initial caps & tiers (proposal)

Provide a concrete starting proposal.

Tier limits:

Tier 0 max %:

Tier 1 max %:

Tier 2 max %:

Single strategy cap max %:

Idle liquidity target %:

6) Open questions

Which strategies are truly synchronous on Base today?

Which strategies have the cleanest ERC‑4626 semantics?

What’s the minimum due diligence bar before allowlisting?
