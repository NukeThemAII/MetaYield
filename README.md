# USDC Blended Vault

Monorepo for the USDC Blended Vault (ERC-4626 vault-of-vaults) on Base.

## Layout
- `apps/web`: Next.js App Router UI
- `packages/contracts`: Foundry smart contracts + tests
- `packages/sdk`: TypeScript SDK (viem)
- `packages/ui`: Shared UI components
- `services/indexer`: Indexer + APY API
- `infra`: Deployment and local infra configs
- `docs`: Architecture, threat model, strategy universe, runbook

## Quickstart
```bash
pnpm i
pnpm -C packages/contracts test
pnpm -C services/indexer dev
pnpm -C apps/web dev
```
