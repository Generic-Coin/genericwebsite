import { SupportedChainId } from './chains'

export const CHAIN_INFO = {
    [SupportedChainId.BSC_TESTNET]: {
        explorer: 'https://testnet.bscscan.com/',
        label: 'Binance Smart Chain - Testnet',
        nativeCurrency: { name: 'Binance Coin', symbol: 'BNB', decimals: 18 },
        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    },
    [SupportedChainId.ARBITRUM_ONE]: {
        explorer: 'https://arbiscan.io/',
        label: 'Arbitrum',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
    },
    [SupportedChainId.ARBITRUM_GOERLI]: {
        explorer: 'https://goerli.arbiscan.io/',
        label: 'Arbitrum Goerli',
        nativeCurrency: { name: 'Goerli Arbitrum Ether', symbol: 'goerliArbETH', decimals: 18 },
        rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    },
}