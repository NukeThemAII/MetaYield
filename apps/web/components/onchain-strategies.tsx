"use client";

import * as React from "react";
import { useReadContract, useReadContracts } from "wagmi";

import { blendedVaultAbi } from "@blended-vault/sdk";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usdcDecimals, vaultAddress } from "@/lib/chain";
import { formatUsd, shortenAddress } from "@/lib/format";

const erc20MetadataAbi = [
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
] as const;

type StrategyRow = {
  address: `0x${string}`;
  name: string | null;
  symbol: string | null;
  tier: number | null;
  capAssets: bigint | null;
  assets: bigint | null;
  enabled: boolean | null;
  isSynchronous: boolean | null;
  depositRank: number | null;
  withdrawRank: number | null;
};

export function OnchainStrategies() {
  const safeVaultAddress = (vaultAddress ||
    "0x0000000000000000000000000000000000000000") as `0x${string}`;

  const { data: strategyList, isLoading: listLoading } = useReadContract({
    abi: blendedVaultAbi,
    address: safeVaultAddress,
    functionName: "getStrategies",
    query: { enabled: Boolean(vaultAddress) },
  });

  const { data: depositQueueRaw, isLoading: depositQueueLoading } = useReadContract({
    abi: blendedVaultAbi,
    address: safeVaultAddress,
    functionName: "getDepositQueue",
    query: { enabled: Boolean(vaultAddress) },
  });

  const { data: withdrawQueueRaw, isLoading: withdrawQueueLoading } = useReadContract({
    abi: blendedVaultAbi,
    address: safeVaultAddress,
    functionName: "getWithdrawQueue",
    query: { enabled: Boolean(vaultAddress) },
  });

  const strategies = (strategyList ?? []) as `0x${string}`[];
  const depositQueue = (depositQueueRaw ?? []) as `0x${string}`[];
  const withdrawQueue = (withdrawQueueRaw ?? []) as `0x${string}`[];

  const configContracts = React.useMemo(
    () =>
      strategies.map((strategy) => ({
        address: safeVaultAddress,
        abi: blendedVaultAbi,
        functionName: "strategies",
        args: [strategy],
      })),
    [strategies, safeVaultAddress]
  );

  const nameContracts = React.useMemo(
    () =>
      strategies.map((strategy) => ({
        address: strategy,
        abi: erc20MetadataAbi,
        functionName: "name",
      })),
    [strategies]
  );

  const symbolContracts = React.useMemo(
    () =>
      strategies.map((strategy) => ({
        address: strategy,
        abi: erc20MetadataAbi,
        functionName: "symbol",
      })),
    [strategies]
  );

  const assetsContracts = React.useMemo(
    () =>
      strategies.map((strategy) => ({
        address: safeVaultAddress,
        abi: blendedVaultAbi,
        functionName: "strategyAssets",
        args: [strategy],
      })),
    [strategies, safeVaultAddress]
  );

  const { data: configs, isLoading: configsLoading } = useReadContracts({
    contracts: configContracts,
    query: { enabled: Boolean(vaultAddress && strategies.length) },
  });

  const { data: assets, isLoading: assetsLoading } = useReadContracts({
    contracts: assetsContracts,
    query: { enabled: Boolean(vaultAddress && strategies.length) },
  });

  const { data: names, isLoading: namesLoading } = useReadContracts({
    contracts: nameContracts,
    query: { enabled: Boolean(vaultAddress && strategies.length) },
  });

  const { data: symbols, isLoading: symbolsLoading } = useReadContracts({
    contracts: symbolContracts,
    query: { enabled: Boolean(vaultAddress && strategies.length) },
  });

  const depositRankByAddress = React.useMemo(() => {
    return new Map(depositQueue.map((address, index) => [address, index + 1]));
  }, [depositQueue]);

  const withdrawRankByAddress = React.useMemo(() => {
    return new Map(withdrawQueue.map((address, index) => [address, index + 1]));
  }, [withdrawQueue]);

  const rows = React.useMemo<StrategyRow[]>(() => {
    if (!strategies.length) {
      return [];
    }
    return strategies.map((address, index) => {
      const config = unwrapResult<readonly [boolean, boolean, number, bigint, boolean]>(
        configs?.[index]
      );
      const asset = unwrapResult<bigint>(assets?.[index]);
      const name = unwrapResult<string>(names?.[index]);
      const symbol = unwrapResult<string>(symbols?.[index]);
      return {
        address,
        name: name ?? null,
        symbol: symbol ?? null,
        tier: config ? Number(config[2]) : null,
        capAssets: config ? config[3] : null,
        assets: asset ?? null,
        enabled: config ? config[1] : null,
        isSynchronous: config ? config[4] : null,
        depositRank: depositRankByAddress.get(address) ?? null,
        withdrawRank: withdrawRankByAddress.get(address) ?? null,
      };
    });
  }, [strategies, configs, assets, names, symbols, depositRankByAddress, withdrawRankByAddress]);

  const nameByAddress = React.useMemo(() => {
    return new Map(
      rows.map((row) => [row.address, row.name ?? row.symbol ?? shortenAddress(row.address)])
    );
  }, [rows]);

  const isLoading =
    listLoading ||
    configsLoading ||
    assetsLoading ||
    namesLoading ||
    symbolsLoading ||
    depositQueueLoading ||
    withdrawQueueLoading;

  return (
    <Card className="animate-rise">
      <CardHeader>
        <CardTitle className="text-sm text-muted">Onchain strategies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted">Live reads from the vault contract.</p>
        {!vaultAddress ? (
          <p className="text-xs text-muted">
            Set `NEXT_PUBLIC_VAULT_ADDRESS` to enable onchain strategy reads.
          </p>
        ) : isLoading ? (
          <p className="text-sm text-muted">Loading onchain strategies...</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted">No strategies registered onchain yet.</p>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 text-xs text-muted md:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-surfaceElevated/60 p-3">
                <p className="text-text">Deposit queue</p>
                {depositQueue.length ? (
                  <div className="mt-2 space-y-1">
                    {depositQueue.map((address, index) => {
                      const name = nameByAddress.get(address) ?? shortenAddress(address);
                      return (
                        <div key={address} className="flex items-center justify-between">
                          <span>#{index + 1}</span>
                          <span className="text-text">{name}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-2">No deposit queue set.</p>
                )}
              </div>
              <div className="rounded-lg border border-border/70 bg-surfaceElevated/60 p-3">
                <p className="text-text">Withdraw queue</p>
                {withdrawQueue.length ? (
                  <div className="mt-2 space-y-1">
                    {withdrawQueue.map((address, index) => {
                      const name = nameByAddress.get(address) ?? shortenAddress(address);
                      return (
                        <div key={address} className="flex items-center justify-between">
                          <span>#{index + 1}</span>
                          <span className="text-text">{name}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-2">No withdraw queue set.</p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              {rows.map((row) => {
                const enabledLabel =
                  row.enabled === null ? "Unknown" : row.enabled ? "Enabled" : "Disabled";
                const syncLabel =
                  row.isSynchronous === null ? "Unknown" : row.isSynchronous ? "Sync" : "Async";
                const depositLabel =
                  row.depositRank !== null ? `Deposit #${row.depositRank}` : "Deposit --";
                const withdrawLabel =
                  row.withdrawRank !== null ? `Withdraw #${row.withdrawRank}` : "Withdraw --";
                return (
                  <div
                    key={row.address}
                    className="grid gap-3 rounded-lg border border-border/70 bg-surfaceElevated/60 p-4 md:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr]"
                  >
                    <div className="space-y-1">
                      <div className="text-sm text-text">
                        {row.name ?? shortenAddress(row.address)}
                      </div>
                      <div className="text-xs text-muted">
                        {row.symbol ?? "--"} · {shortenAddress(row.address)}
                      </div>
                      <div className="text-xs text-muted">
                        {row.tier !== null ? `Tier ${row.tier}` : "Tier --"} · {depositLabel} ·{" "}
                        {withdrawLabel}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted">Allocation</div>
                      <div className="text-sm text-text number">
                        {row.assets !== null ? formatUsd(row.assets, usdcDecimals) : "--"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted">Cap</div>
                      <div className="text-sm text-text number">
                        {row.capAssets !== null ? formatUsd(row.capAssets, usdcDecimals) : "--"}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={row.enabled ? "accent" : "default"}>{enabledLabel}</Badge>
                      <Badge variant={row.isSynchronous ? "accent" : "default"}>{syncLabel}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function unwrapResult<T>(value: unknown): T | null {
  if (value && typeof value === "object") {
    if ("result" in value) {
      const result = (value as { result?: T | null }).result;
      return result ?? null;
    }
    return null;
  }
  if (value !== undefined && value !== null) {
    return value as T;
  }
  return null;
}
