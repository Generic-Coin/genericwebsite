import React, { useState, useEffect } from 'react';

import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3';
import { injected } from '../supportedNetworks'
import {
    Button,
} from 'react95-native';
import { formatAddress } from "../utils";
import { DEFAULT_CHAIN_ID } from '../constants/chains';
import { CHAIN_INFO } from '../constants/chainInfo'

const ConnectMetamask = () => {
    const web3 = new Web3(Web3.givenProvider);
    const { chainId, account, activate, deactivate, setError, active, library , connector} = useWeb3React();
    const [isWrongNetwork, setIsWrongNetwork] = useState(false);

    const connect = async () => {
      await activate(injected);
        if (web3.givenProvider !== null) {
            web3.eth.net.getId().then(async function (result) {
                if (result === DEFAULT_CHAIN_ID) {
                    //fetchContractData();
                } else {
                    setIsWrongNetwork(true);
                    addNetwork();
                }
            });
        }
    }

    const addNetwork = async () => {
        window.ethereum
            .request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: DEFAULT_CHAIN_ID,
                        chainName: CHAIN_INFO[DEFAULT_CHAIN_ID].label,
                        nativeCurrency: {
                            name: CHAIN_INFO[DEFAULT_CHAIN_ID].nativeCurrency.name,
                            symbol: CHAIN_INFO[DEFAULT_CHAIN_ID].nativeCurrency.symbol,
                            decimals: CHAIN_INFO[DEFAULT_CHAIN_ID].nativeCurrency.decimals,
                        },
                        rpcUrls: [CHAIN_INFO[DEFAULT_CHAIN_ID].rpcUrl],
                        blockExplorerUrls: [CHAIN_INFO[DEFAULT_CHAIN_ID].explorer],
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
                <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                    <div>
                        <Button primary onPress={() => disconnect()}>{formatAddress(account, 4)}</Button>
                    </div>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                    <div>
                        <Button primary onPress={() => connect()}>Use MetaMask</Button>
                        {isWrongNetwork ? (
                            <p>Wrong Network! Please switch to {CHAIN_INFO[DEFAULT_CHAIN_ID].label}.</p>
                        ) : (<></>)}
                    </div>
                </div>
            )}
        </div>
    )
  }

export default ConnectMetamask