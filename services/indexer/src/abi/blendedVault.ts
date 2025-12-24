export const blendedVaultAbi = [
  {
    type: "function",
    name: "totalAssets",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "assetsPerShare",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "getStrategies",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address[]" }],
  },
  {
    type: "function",
    name: "strategies",
    stateMutability: "view",
    inputs: [{ name: "strategy", type: "address" }],
    outputs: [
      { name: "registered", type: "bool" },
      { name: "enabled", type: "bool" },
      { name: "tier", type: "uint8" },
      { name: "capAssets", type: "uint256" },
      { name: "isSynchronous", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "strategyAssets",
    stateMutability: "view",
    inputs: [{ name: "strategy", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "event",
    name: "Deposit",
    inputs: [
      { name: "caller", type: "address", indexed: true },
      { name: "owner", type: "address", indexed: true },
      { name: "assets", type: "uint256", indexed: false },
      { name: "shares", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      { name: "caller", type: "address", indexed: true },
      { name: "receiver", type: "address", indexed: true },
      { name: "owner", type: "address", indexed: true },
      { name: "assets", type: "uint256", indexed: false },
      { name: "shares", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StrategyAdded",
    inputs: [
      { name: "strategy", type: "address", indexed: true },
      { name: "tier", type: "uint8", indexed: false },
      { name: "capAssets", type: "uint256", indexed: false },
      { name: "isSynchronous", type: "bool", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StrategyRemoved",
    inputs: [{ name: "strategy", type: "address", indexed: true }],
    anonymous: false,
  },
  {
    type: "event",
    name: "CapUpdated",
    inputs: [
      { name: "strategy", type: "address", indexed: true },
      { name: "oldCap", type: "uint256", indexed: false },
      { name: "newCap", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TierLimitsUpdated",
    inputs: [
      { name: "oldLimits", type: "uint256[3]", indexed: false },
      { name: "newLimits", type: "uint256[3]", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MaxDailyIncreaseBpsUpdated",
    inputs: [
      { name: "oldBps", type: "uint256", indexed: false },
      { name: "newBps", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "QueuesUpdated",
    inputs: [
      { name: "depositQueueHash", type: "bytes32", indexed: false },
      { name: "withdrawQueueHash", type: "bytes32", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Rebalanced",
    inputs: [
      { name: "withdrawStrategies", type: "address[]", indexed: false },
      { name: "withdrawAmounts", type: "uint256[]", indexed: false },
      { name: "depositStrategies", type: "address[]", indexed: false },
      { name: "depositAmounts", type: "uint256[]", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FeeAccrued",
    inputs: [
      { name: "profitAssets", type: "uint256", indexed: false },
      { name: "feeAssets", type: "uint256", indexed: false },
      { name: "feeShares", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Paused",
    inputs: [
      { name: "deposits", type: "bool", indexed: false },
      { name: "withdrawals", type: "bool", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ChangeScheduled",
    inputs: [
      { name: "id", type: "bytes32", indexed: true },
      { name: "action", type: "bytes32", indexed: true },
      { name: "executeAfter", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ChangeCancelled",
    inputs: [{ name: "id", type: "bytes32", indexed: true }],
    anonymous: false,
  },
  {
    type: "event",
    name: "ChangeExecuted",
    inputs: [
      { name: "id", type: "bytes32", indexed: true },
      { name: "action", type: "bytes32", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FeeRecipientUpdated",
    inputs: [
      { name: "oldRecipient", type: "address", indexed: true },
      { name: "newRecipient", type: "address", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "IdleLiquidityBpsUpdated",
    inputs: [
      { name: "oldBps", type: "uint256", indexed: false },
      { name: "newBps", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MinInitialDepositUpdated",
    inputs: [
      { name: "oldMin", type: "uint256", indexed: false },
      { name: "newMin", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MinHarvestIntervalUpdated",
    inputs: [
      { name: "oldInterval", type: "uint256", indexed: false },
      { name: "newInterval", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TimelockDelayUpdated",
    inputs: [
      { name: "oldDelay", type: "uint256", indexed: false },
      { name: "newDelay", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
] as const;
