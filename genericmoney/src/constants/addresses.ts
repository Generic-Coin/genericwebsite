import { SupportedChainId } from './chains'

const ADDRESSES = {
    [SupportedChainId.BSC_TESTNET]: {
        'genericToken': '0xd44130b87B590d88B414727407B32999a7Cebdd6',
        'slots': '0x06945f5f639edf92152be57ccb7be6f4cc1cdc92',
        'staking': '0xA229990D56B881c695c1aD848AA57356ce6beb7b',
        'stakingToken': '0xB70f7Aa73CB99A9765F2b9A2143DA716Ac803180',
        'freeSpinNft': '0x19d8154043d225F097C358bdc1D69708647Eed35',
    },
    [SupportedChainId.ARBITRUM_GOERLI]: {
        'genericToken': '0xDdE78b2e7F3236E873d3a8814D84d849F19cd036',
        'slots': '0x66Cdc9C6C804d6D4C10fc9Cc3410Cb171fB903C8',
        'staking': '0x0057FB37d9e49DA014C6191C00F9B05F510e6480',
        'stakingToken': '0xe98F65b1C5430B8b6f2F9d6F4E9872CB9734b625',
        'freeSpinNft': '0x049ecCd0bfb21D3e028fdaA43C7bab6CdC696d89',
    },
};

export default ADDRESSES;