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
    NumberInput,
    Menu,
} from 'react95-native';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import tokenABI from './assets/contracts/tokenABI.json';
import freeSpinNFTABI from './assets/contracts/freeSpinNFTABI.json';
import slotsContractABI from './assets/contracts/slotsABI.json';
import ADDRESSES from './constants/addresses';
import ConnectMetamask from './components/ConnectMetamask';
import { DEFAULT_CHAIN_ID } from './constants/chains';

const AdminScreen = () => {


    // Web3 implementation
    const web3 = new Web3(Web3.givenProvider);
    const { active, account, chainId } = useWeb3React();

    const tokenContractAddress = ADDRESSES[DEFAULT_CHAIN_ID].genericToken;
    const tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddress);

    // LP Staking contract
    const nftContractAddress = ADDRESSES[DEFAULT_CHAIN_ID].freeSpinNft;
    const nftContract = new web3.eth.Contract(freeSpinNFTABI, nftContractAddress);

    const slotsContractAddress = ADDRESSES[DEFAULT_CHAIN_ID].slots;
    const slotsContract = new web3.eth.Contract(slotsContractABI, slotsContractAddress);

    const loadingMessage = 'Loading...';

    // React states for the dApp
    // General
    const [isOwner, setIsOwner] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [currentTimestamp, setCurrentTimestamp] = useState('Loading...');

    // Slots
    const [ethSpinPrice, setEthSpinPrice] = useState(0);
    const [tokenSpinPrice, setTokenSpinPrice] = useState(0);
    const [totalRoundsPlayed, setTotalRoundsPlayed] = useState();
    const [prizePool, setPrizePool] = useState();
    const [potFee, setPotFee] = useState();
    const [teamFee, setTeamFee] = useState();
    const [sameSymbolOdds, setSameSymbolOdds] = useState();

    const [newTokenSpinPrice, setNewTokenSpinPrice] = useState('');
    const [newEthSpinPrice, setNewEthSpinPrice] = useState('');
    const [newPayouts, setNewPayouts] = useState([]);


    // Free spin NFT
    const [mintAmount, setMintAmount] = useState(1);
    const [maxSupply, setMaxSupply] = useState('Loading...');
    const [displayCostTier1, setDisplayCostTier1] = useState('Loading...');
    const [displayCostTier2, setDisplayCostTier2] = useState('Loading...');
    const [displayCostTier3, setDisplayCostTier3] = useState('Loading...');
    const [weiCostTier1, setWeiCostTier1] = useState('Loading...');
    const [weiCostTier2, setWeiCostTier2] = useState('Loading...');
    const [weiCostTier3, setWeiCostTier3] = useState('Loading...');
    const [totalSupply, setTotalSupply] = useState('Loading...');
    const [freeSpinTimeout, setFreeSpinTimeout] = useState('Loading...');
    const [freeSpinTier1MinTokenBalance, setFreeSpinTier1MinTokenBalance] = useState('');
    const [freeSpinTier2MinTokenBalance, setFreeSpinTier2MinTokenBalance] = useState('');
    const [freeSpinTier3MinTokenBalance, setFreeSpinTier3MinTokenBalance] = useState('');

    useEffect(() => {
        if (web3.givenProvider !== null) {
            fetchContractData();
        }
    }, [active]);


    const fetchContractData = async () => {
        try {
            //const owner = await slotsContract.methods.owner().call();
            //setIsOwner(owner === account)
            const currentBlockNumber = await web3.eth.getBlockNumber();
            const currentTimestamp = (await web3.eth.getBlock(currentBlockNumber)).timestamp;

            const tokenSpinPrice = await slotsContract.methods.tokenSpinPrice().call();
            const ethSpinPrice = await slotsContract.methods.ethSpinPrice().call();

            const totalRoundsPlayed = await slotsContract.methods.getTotalRoundsPlayed().call();
            const prizePool = await slotsContract.methods.prizePool().call();
            const potFee = await slotsContract.methods.potFee().call();
            const teamFee = await slotsContract.methods.teamFee().call();
            const sameSymbolOdds = await slotsContract.methods.sameSymbolOdds().call();


            const maxSupply = await nftContract.methods
                .maxSupply()
                .call();
            setMaxSupply(maxSupply);
            const costTier1 = await nftContract.methods.costTier1().call();
            const costTier2 = await nftContract.methods.costTier2().call();
            const costTier3 = await nftContract.methods.costTier3().call();
            const totalSupply = await nftContract.methods.totalSupply().call();
            const freeSpinTimeout = await slotsContract.methods
                .freeSpinTimeout()
                .call();
            const freeSpinTier1MinTokenBalance = await slotsContract.methods.freeSpinTier1MinTokenBalance().call();
            const freeSpinTier2MinTokenBalance = await slotsContract.methods.freeSpinTier2MinTokenBalance().call();
            const freeSpinTier3MinTokenBalance = await slotsContract.methods.freeSpinTier3MinTokenBalance().call();


            setCurrentTimestamp(String(currentTimestamp));

            setTokenSpinPrice(tokenSpinPrice);
            setEthSpinPrice(ethSpinPrice);

            setTotalRoundsPlayed(totalRoundsPlayed);
            setPrizePool(prizePool);
            setPotFee(potFee);
            setTeamFee(teamFee);
            setSameSymbolOdds(sameSymbolOdds);


            setDisplayCostTier1(web3.utils.fromWei(costTier1).toLocaleString());
            setDisplayCostTier2(web3.utils.fromWei(costTier2).toLocaleString());
            setDisplayCostTier3(web3.utils.fromWei(costTier3).toLocaleString());
            setWeiCostTier1(costTier1);
            setWeiCostTier2(costTier2);
            setWeiCostTier3(costTier3);
            setTotalSupply(totalSupply);
            setFreeSpinTier1MinTokenBalance(freeSpinTier1MinTokenBalance);
            setFreeSpinTier2MinTokenBalance(freeSpinTier2MinTokenBalance);
            setFreeSpinTier3MinTokenBalance(freeSpinTier3MinTokenBalance);

            setFreeSpinTimeout(freeSpinTimeout);
            setIsInitialized(true);
        } catch (ex) { }
    };

    const handleSetTokenSpinPriceClicked = async () => {
        try {
            await slotsContract.methods
                .setTokenSpinPrice(
                    web3.utils.toWei(newTokenSpinPrice, 'ether')
                )
                .send({ from: account })
                .once("transactionHash", () => {
                    setIsInitialized(false);
                    setNewTokenSpinPrice('');
                })
                .then(() => {
                    fetchContractData();
                });

        } catch (ex) {
            return;
        }
    };

    const handleSetEthSpinPriceClicked = async () => {
        try {
            await slotsContract.methods
                .setEthSpinPrice(
                    web3.utils.toWei(newEthSpinPrice, 'ether')
                )
                .send({ from: account })
                .once("transactionHash", () => {
                    setIsInitialized(false);
                    setNewTokenSpinPrice('');
                })
                .then(() => {
                    fetchContractData();
                });

        } catch (ex) {
            return;
        }
    };


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
                        Generic Admin
                    </Text>
                </div>
            </div>
            <ConnectMetamask />
            {active && isOwner ? (
                <div>
                    <h2>Slots</h2>
                    <p>GEN spin price: {isInitialized ? web3.utils.fromWei(tokenSpinPrice).toLocaleString() + " GEN" : loadingMessage}</p>
                    <span>Set GEN spin price: </span>
                    <input style={{ border: '3px solid #848584', fontFamily: 'MS Sans Serif', fontSize: '1rem', padding: '0.43rem' }}
                        value={newTokenSpinPrice}
                        onChange={e => setNewTokenSpinPrice(e.target.value)}
                    />
                    <span> GEN</span>
                    <Button primary onPress={() => handleSetTokenSpinPriceClicked()} style={{ width: 200 }}>Set GEN spin price</Button>

                    <p>ETH spin price: {isInitialized ? web3.utils.fromWei(ethSpinPrice).toLocaleString() + " ETH" : loadingMessage}</p>
                    <span>Set ETH spin price: </span>
                    <input style={{ border: '3px solid #848584', fontFamily: 'MS Sans Serif', fontSize: '1rem', padding: '0.43rem' }}
                        value={newEthSpinPrice}
                        onChange={e => setNewEthSpinPrice(e.target.value)}
                    />
                    <span> ETH</span>
                    <Button primary onPress={() => handleSetEthSpinPriceClicked()} style={{ width: 200 }}>Set ETH spin price</Button>


                    <p>Total rounds played: {isInitialized ? totalRoundsPlayed : loadingMessage}</p>
                    <p>Prize pool: {isInitialized ? Math.floor(Number(web3.utils.fromWei(prizePool))).toLocaleString() + " GEN" : loadingMessage}</p>
                    <p>Pot fee: {isInitialized ? (Number(potFee) / 100).toFixed(2) + " %" : loadingMessage}</p>
                    <p>Team fee: {isInitialized ? (Number(teamFee) / 100).toFixed(2) + " %" : loadingMessage}</p>
                    <p>Same symbold odds: {isInitialized ? (Number(sameSymbolOdds) / 100).toFixed(2) + " %" : loadingMessage}</p>

                    <br />
                    <h2>Free spin NFT</h2>
                    <p>Current supply: {totalSupply}</p>
                    <p>Max supply: {maxSupply}</p>
                    <p>Mint price tier 1 (1-200): {displayCostTier1} ETH</p>
                    <p>Mint price tier 2 (201-250): {displayCostTier2} ETH</p>
                    <p>Mint price tier 3 (251-275): {displayCostTier3} ETH</p>
                    <p>Tier 1 minimum balance to claim free spin: {isInitialized ? Number(web3.utils.fromWei(freeSpinTier1MinTokenBalance)).toLocaleString() + " GEN" : loadingMessage}</p>
                    <p>Tier 2 minimum balance to claim free spin: {isInitialized ? Number(web3.utils.fromWei(freeSpinTier2MinTokenBalance)).toLocaleString() + " GEN" : loadingMessage}</p>
                    <p>Tier 3 minimum balance to claim free spin: {isInitialized ? Number(web3.utils.fromWei(freeSpinTier3MinTokenBalance)).toLocaleString() + " GEN" : loadingMessage}</p>
                    <p>Time between claiming free spin: {isInitialized ? freeSpinTimeout + " seconds" : loadingMessage}</p>
                </div>
            ) : (<></>)}
        </div>


    );
};


export default AdminScreen;