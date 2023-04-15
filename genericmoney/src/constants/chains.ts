export enum SupportedChainId {
  BSC_TESTNET = 97,
  ARBITRUM_ONE = 42161,
  ARBITRUM_GOERLI = 421613,
}

export const SUPPORTED_CHAIN_IDS = [
  SupportedChainId.ARBITRUM_GOERLI
] as const

export const DEFAULT_CHAIN_ID = SupportedChainId.ARBITRUM_GOERLI;