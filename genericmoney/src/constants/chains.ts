export enum SupportedChainId {
    BSC_TESTNET = 97,
  }

export const SUPPORTED_CHAIN_IDS = [
    SupportedChainId.BSC_TESTNET
] as const

export const DEFAULT_CHAIN_ID = SupportedChainId.BSC_TESTNET;