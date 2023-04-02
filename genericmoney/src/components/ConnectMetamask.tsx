import React, { useState, useEffect } from 'react';

import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3';
import { injected } from '../supportedNetworks'
import {
    Button,
} from 'react95-native';
import { formatAddress } from "../utils";

const ConnectMetamask = () => {
    const web3 = new Web3(Web3.givenProvider);
    const { chainId, account, activate, deactivate, setError, active, library , connector} = useWeb3React();
    const [isWrongNetwork, setIsWrongNetwork] = useState(false);

    const connect = async () => {
      await activate(injected);
        if (web3.givenProvider !== null) {
            web3.eth.net.getId().then(async function (result) {
                if (result === 97) {
                    //fetchContractData();
                } else {
                    setIsWrongNetwork(true);
                    addBSCNetwork();
                }
            });
        }
    }

    const addBSCNetwork = async () => {
        window.ethereum
            .request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: '0x61',
                        chainName: 'Smart Chain - Testnet',
                        nativeCurrency: {
                            name: 'Binance Coin',
                            symbol: 'BNB',
                            decimals: 18,
                        },
                        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                        blockExplorerUrls: ['https://testnet.bscscan.com'],
                    },
                ],
            })
            .then(() => {
                setIsWrongNetwork(false);
            })
            .catch(ex => { });
    };

    const disconnect = () => {
        deactivate()
      }

    return (
        <div>
        {active ? (
                <div style={{ width: '100%', display: 'flex' }}>
                    <div style={{ width: '100%' }}>
                        <Button primary onPress={() => disconnect()}>{formatAddress(account, 4)}</Button>
                    </div>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex' }}>
                    <div style={{ width: '100%' }}>
                        <Button primary onPress={() => connect()}>Use MetaMask</Button>
                        {isWrongNetwork ? (
                            <p>Wrong Network! Please switch to Binance Smart Chain.</p>
                        ) : (<></>)}
                    </div>
                </div>
            )}
        </div>
    )
  }

export default ConnectMetamask