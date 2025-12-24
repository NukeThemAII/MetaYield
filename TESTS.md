# Tests & Verification

## Contracts (Foundry)
```bash
git submodule update --init --recursive
pnpm -C packages/contracts test
```

## SDK (TypeScript)
```bash
pnpm -C packages/sdk lint
pnpm -C packages/sdk build
```

## Indexer (TypeScript)
```bash
pnpm -C services/indexer lint
pnpm -C services/indexer build
```

## Web (Next.js)
```bash
pnpm -C apps/web lint
pnpm -C apps/web build
```

## CI
GitHub Actions runs Foundry tests plus TS lint/typecheck for SDK, indexer, and web.
