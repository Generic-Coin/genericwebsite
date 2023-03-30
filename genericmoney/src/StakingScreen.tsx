import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Linking,
    Platform,
} from 'react-native';
import {
    Panel,
    AppBar,
    Button,
    Text,
    ScrollView,
    TextInput,
} from 'react95-native';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    useWalletConnect,
    withWalletConnect,
} from '@walletconnect/react-native-dapp';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { injected } from './supportedNetworks';
import tokenABI from './assets/contracts/tokenABI.json';
import stakingABI from './assets/contracts/stakingABI.json';
import stakingTokenABI from './assets/contracts/stakingTokenABI.json';
import ADDRESSES from './constants/addresses';

const StakingScreen = () => {
    // Web3 implementation
    const web3 = new Web3(Web3.givenProvider);
    const { active, account, activate } = useWeb3React();

    // GENv3
    const tokenContractAddy = ADDRESSES['97'].genericToken;
    const tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddy);

    // LP Staking contract
    const stakingContractAddress = ADDRESSES['97'].staking;
    const stakingContract = new web3.eth.Contract(stakingABI, stakingContractAddress);

    // The LP token
    const stakingTokenContractAddress = ADDRESSES['97'].stakingToken;
    const stakingTokenContract = new web3.eth.Contract(stakingTokenABI, stakingTokenContractAddress);

    // React states for the dApp
    const [tokenBalance, setTokenBalance] = useState('Loading...');
    const [stakingTokenBalance, setStakingTokenBalance] = useState('Loading...');
    const [stakingAmount, setStakingAmount] = useState('Loading...');
    const [pendingRewards, setPendingRewards] = useState('Loading...');
    const [depositAmount, setDepositAmount] = useState('0');
    const [isWrongNetwork, setIsWrongNetwork] = useState(false);
    const [allowance, setAllowance] = useState('0');
    const [hasAllowance, setHasAllowance] = useState(false);

    useEffect(() => {
        if (web3.givenProvider !== null) {
            const id = setInterval(() => {
                fetchContractData();
            }, 5000);
            fetchContractData();
            return () => clearInterval(id);
        } else {
            return null;
        }
    }, [active]);

    async function connect() {
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

    const fetchContractData = async () => {
        try {
            const tokenBalance = await tokenContract.methods
                .balanceOf(account)
                .call();
            const stakingTokenBalance = await stakingTokenContract.methods
                .balanceOf(account)
                .call();

            const stakingAmount = (await stakingContract.methods.poolStakers(account).call()).amount;
            const pendingRewards = await stakingContract.methods.pendingRewards(account).call();

            const allowance = await stakingTokenContract.methods
                .allowance(account, ADDRESSES['97'].staking)
                .call();

            const hasAllowance = web3.utils.toBN(allowance).gte(web3.utils.toBN(depositAmount));

            setStakingAmount(web3.utils.fromWei(stakingAmount).toLocaleString());
            setStakingTokenBalance(web3.utils.fromWei(stakingTokenBalance));
            setPendingRewards(web3.utils.fromWei(pendingRewards));
            setTokenBalance(web3.utils.fromWei(tokenBalance).toLocaleString());
            setAllowance(allowance);
            setHasAllowance(hasAllowance);
        } catch (ex) { }
    };

    const deposit = async () => {
        try {
            await stakingContract.methods
                .deposit(web3.utils.toWei(depositAmount, 'ether'))
                .send({ from: account });
        }
        catch (ex) { }
    };

    const withdraw = async () => {
        try {
            await stakingContract.methods
                .withdraw()
                .send({ from: account });
        }
        catch (ex) { }
    };

    const claimRewards = async () => {
        try {
            await stakingContract.methods
                .harvestRewards()
                .send({ from: account });
        }
        catch (ex) { }
    };

    const handleApprove = async () => {
            try {
                await stakingTokenContract.methods
                    .approve(
                        ADDRESSES['97'].staking,
                        web3.utils.toWei(depositAmount, 'ether'),
                    )
                    .send({ from: account });
                setHasAllowance(true);
            } catch (ex) {
                return;
            }
    };

    const handleDepositAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDepositAmount(e.target.value);
        var trimmed = String(e.target.value).trim();

        if(trimmed !== ''){

            const hasAllowance = web3.utils.toBN(allowance).gte(web3.utils.toBN(web3.utils.toWei(trimmed, 'ether')));
            setHasAllowance(hasAllowance);
        }
    }

    return (
        <div>
            <div style={{ width: '100%', display: 'flex' }}>
                <div style={{ float: 'left', margin: '.75rem 0' }}>
                    <Text
                        bold
                        style={{
                            fontSize: 22,
                            margin: 12,
                            marginBottom: 24,
                        }}
                    >
                        Generic Slots Beta 0.8
                    </Text>
                </div>
            </div>
            {active ? (
                <div style={{ width: '100%', display: 'flex' }}>
                    <div style={{ width: '100%' }}>
                        <Button primary>MetaMask Connected</Button>
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
            {active ? (
                <div>
                    {tokenBalance ? (<p>Your GENv3 Balance: {tokenBalance} GEN</p>) : (<p></p>)}
                    {stakingTokenBalance ? (<p>Stake token balance: {stakingTokenBalance} LP tokens</p>) : (<p></p>)}
                    {stakingAmount ? (<p>Staked amount: {stakingAmount} LP tokens</p>) : (<p></p>)}
                    {pendingRewards ? (<p>Claimable rewards: {pendingRewards} GEN</p>) : (<p></p>)}
                    <input value={depositAmount} onChange={handleDepositAmountChange} />
                    {hasAllowance ? (
                        <Button primary disabled={!hasAllowance} onPress={() => deposit()}>Deposit</Button>
                    ) : (
                        <>
                            <Button primary disabled={hasAllowance} onPress={() => handleApprove()}>Approve</Button>
                            <Button primary disabled={hasAllowance} onPress={() => deposit()}>Deposit</Button>
                        </>
                    )
                    }
                    <Button primary onPress={() => withdraw()}>Witdraw stake</Button>
                    <Button primary onPress={() => claimRewards()}>Claim rewards</Button>
                </div>
            ) : (<></>)}
        </div>
    );
};

export default withWalletConnect(StakingScreen, {
    redirectUrl:
        Platform.OS === 'web' ? window.location.origin : 'yourappscheme://',
    storageOptions: {
        asyncStorage: AsyncStorage,
    },
});
