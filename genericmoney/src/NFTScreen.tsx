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
} from 'react95-native';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import tokenABI from './assets/contracts/tokenABI.json';
import freeSpinNFTABI from './assets/contracts/freeSpinNFTABI.json';
import slotContractABI from './assets/contracts/slotsABI.json';
import ADDRESSES from './constants/addresses';
import ConnectMetamask from './components/ConnectMetamask';

const NFTScreen = () => {
    // Web3 implementation
    const web3 = new Web3(Web3.givenProvider);
    const { active, account, chainId } = useWeb3React();

    const tokenContractAddress = ADDRESSES['97'].genericToken;
    const tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddress);

    // LP Staking contract
    const nftContractAddress = ADDRESSES['97'].freeSpinNft;
    const nftContract = new web3.eth.Contract(freeSpinNFTABI, nftContractAddress);

    const slotContractAddress = ADDRESSES['97'].slots;
    const slotContract = new web3.eth.Contract(slotContractABI, slotContractAddress);

    // React states for the dApp
    const [tokenBalance, setTokenBalance] = useState('Loading...');
    const [nftMetadata, setNftMetadata] = useState([]);
    const [mintingNFT, setMintingNFT] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [mintAmount, setMintAmount] = useState(1);
    const [maxSupply, setMaxSupply] = useState('Loading...');
    const [displayCost, setDisplayCost] = useState('Loading...');
    const [weiCost, setWeiCost] = useState('Loading...');
    const [statusMessage, setStatusMessage] = useState('Buy your Generic Spin NFT');
    const [currentTimestamp, setCurrentTimestamp] = useState('Loading...');
    const [freeSpinTimeout, setFreeSpinTimeout] = useState('Loading...');
    var nftUrlArray;

    useEffect(() => {
        if (web3.givenProvider !== null) {
            fetchContractData();
        }
    }, [active]);


    const fetchContractData = async () => {
        try {
            const tokenBalance = await tokenContract.methods
                .balanceOf(account)
                .call();
            const maxSupply = await nftContract.methods
                .maxSupply()
                .call();
            setMaxSupply(maxSupply);
            const cost = await nftContract.methods
                .cost()
                .call();

            // Array of NFT id's
            const walletOfOwner = await nftContract.methods
                .walletOfOwner(account)
                .call();
            console.log(walletOfOwner);

            const currentBlockNumber = await web3.eth.getBlockNumber();
            const currentTimestamp = (await web3.eth.getBlock(currentBlockNumber)).timestamp;
            const freeSpinTimeout = await slotContract.methods
                .freeSpinTimeout()
                .call();

            nftUrlArray = await getNftUrlArray(walletOfOwner);

            // Uncomment below line for live environment or fix cors
            //let metaObj = await getMetadata(nftUrlArray);

            /*************** FOR LOCAL TESTING ***********/
            let metaObj = [];
            metaObj.push({
                'name': 'Generic Spin NFT #1',
                'description': 'This NFT will give the user benefits in the Generic Slots app.',
                'image': 'https://generic.money/favicon-16.png',
                'attributes': [
                    {
                        'display_type': 'number',
                        'trait_type': 'Token ID',
                        'value': 1
                    }
                ]
            });
            metaObj.push({
                'name': 'Generic Spin NFT #2',
                'description': 'This NFT will give the user benefits in the Generic Slots app.',
                'image': 'https://generic.money/favicon-16.png',
                'attributes': [
                    {
                        'display_type': 'number',
                        'trait_type': 'Token ID',
                        'value': 2
                    }
                ]
            });
            
            metaObj[0]['lastFreeSpinTime'] = '0';
            metaObj[1]['lastFreeSpinTime'] = '1680723533';
            console.log(metaObj);
            /****************************** */

            setNftMetadata(metaObj);
            setTokenBalance(tokenBalance);
            setDisplayCost(web3.utils.fromWei(cost).toLocaleString());
            setWeiCost(cost);
            setCurrentTimestamp(String(currentTimestamp));
            setFreeSpinTimeout(freeSpinTimeout);
            setIsInitialized(true);
        } catch (ex) { }
    };

    const getNftUrlArray = (async (nftIdArray) => {
        let nftArr = [];

        for (let i = 0; i < nftIdArray.length; i++) {
            // Fetch json and add it to return array
            let tokenURI = await nftContract.methods.tokenURI(nftIdArray[i]).call();
            nftArr.push(tokenURI);
        }
        return nftArr;

    });

    const getMetadata = (async (nftUrlArray) => {
        let str = [];
        for (let link_ of nftUrlArray) {
            let jsn_ = await fetch(link_.toString());
            jsn_ = await jsn_.json();
            // Manually fetching the last free spin time for each NFT and adding it to the json.
            jsn_['lastFreeSpinTime'] = await slotContract.methods.lastFreeSpinTimeNFT(jsn_.attributes[0].value).call();
            str.push(jsn_);
        }

        return str;
    });

    const mintNFTs = async () => {
        let cost = web3.utils.toBN(weiCost)
        let totalCostWei = cost.mul(web3.utils.toBN(mintAmount));
        console.log("Cost: ", totalCostWei);
        setStatusMessage(`Minting your NFT...`);
        setMintingNFT(true);
        await nftContract.methods
            .mint(account, mintAmount)
            .send({
                from: account,
                value: totalCostWei,
            })
            .once("error", (err) => {
                console.log(err);
                setStatusMessage("Sorry, something went wrong please try again later.");
                setMintingNFT(false);
            })
            .then((receipt) => {
                console.log(receipt);
                setStatusMessage(`Mint success! View your NFT's here.`);
                setMintingNFT(false);
                fetchContractData();
            });
    };

    const claimFreeSpin = async (nftId) => {
        await slotContract.methods
            .claimFreeSpinFromNFT(nftId)
            .send({
                from: account
            })
    }

    const handleMintAmountChange = (newValue: number) => {
        setMintAmount(newValue);
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
                        Generic Text
                    </Text>
                </div>
            </div>
            <ConnectMetamask />
            {active ? (
                <div>
                    {tokenBalance ? (<p>Your GENv3 Balance: {tokenBalance} GEN</p>) : (<p></p>)}
                    <p>Max supply: {maxSupply}</p>
                    <p>Mint price: {displayCost} BNB</p>
                    {statusMessage ? (<p>{statusMessage}</p>) : (<p></p>)}
                    <NumberInput value={mintAmount} onChange={handleMintAmountChange} width={130} min={1} max={25} />
                    <Button primary disabled={mintingNFT || !isInitialized} onPress={() => mintNFTs()}>Mint</Button>
                    {nftMetadata.map((element, index) => {
                        return (<div style={{ border: "1px solid black", display: "flex", flexDirection: "column", width: "14rem", color: "black" }} key={element.attributes[0].value}>
                            <div>{element.name}</div>
                            <div style={{ display: "flex", justifyContent: "center" }} >
                                <img src={element.image} style={{ height: "8rem", width: "8rem", }}></img>
                            </div>
                            <div style={{ color: "black" }}>{element.description}</div>
                            {Number(element.lastFreeSpinTime) > 0 ? (
                                <div>Last free spin claim: {new Date(element.lastFreeSpinTime*1000).toLocaleDateString()} {new Date(element.lastFreeSpinTime*1000).toLocaleTimeString()}</div>
                            ) : (<></>)}
                            <Button primary disabled={Number(element.lastFreeSpinTime) + Number(freeSpinTimeout) >= Number(currentTimestamp)} onPress={() => claimFreeSpin(element.attributes[0].value)}>Claim free spin</Button>
                        </div>)
                    })}
                </div>
            ) : (<></>)}
        </div>
    );
};

export default NFTScreen;