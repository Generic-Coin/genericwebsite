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
import { DEFAULT_CHAIN_ID } from './constants/chains';

const NFTScreen = () => {

    useEffect(() => {
        getPrices();
    }, []);
    const [showGenericPrice, setShowGenericPrice] = useState(0);
    const getPrices = async () => {
        try {
            const response = await fetch(
                'https://api.coinpaprika.com/v1/tickers/genv3-generic-coin',
            );
            const responseJson = await response.json();
            const digestedResponse =
                Math.round(responseJson.quotes.USD.price * 1000000 * 100) / 100;
            setShowGenericPrice(digestedResponse);
        } catch (error) {
            // console.error(error);
        }
    };

    // Web3 implementation
    const web3 = new Web3(Web3.givenProvider);
    const { active, account, chainId } = useWeb3React();

    const tokenContractAddress = ADDRESSES[DEFAULT_CHAIN_ID].genericToken;
    const tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddress);

    // LP Staking contract
    const nftContractAddress = ADDRESSES[DEFAULT_CHAIN_ID].freeSpinNft;
    const nftContract = new web3.eth.Contract(freeSpinNFTABI, nftContractAddress);

    const slotContractAddress = ADDRESSES[DEFAULT_CHAIN_ID].slots;
    const slotContract = new web3.eth.Contract(slotContractABI, slotContractAddress);

    // React states for the dApp
    const [tokenBalance, setTokenBalance] = useState('Loading...');
    const [nftMetadata, setNftMetadata] = useState([]);
    const [mintingNFT, setMintingNFT] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [mintAmount, setMintAmount] = useState(1);
    const [maxSupply, setMaxSupply] = useState('Loading...');
    const [displayCostTier1, setDisplayCostTier1] = useState('Loading...');
    const [displayCostTier2, setDisplayCostTier2] = useState('Loading...');
    const [displayCostTier3, setDisplayCostTier3] = useState('Loading...');
    const [weiCostTier1, setWeiCostTier1] = useState('Loading...');
    const [weiCostTier2, setWeiCostTier2] = useState('Loading...');
    const [weiCostTier3, setWeiCostTier3] = useState('Loading...');
    const [totalSupply, setTotalSupply] = useState('Loading...');
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
            const costTier1 = await nftContract.methods.costTier1().call();
            const costTier2 = await nftContract.methods.costTier2().call();
            const costTier3 = await nftContract.methods.costTier3().call();

            const totalSupply = await nftContract.methods.totalSupply().call();

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
            setDisplayCostTier1(web3.utils.fromWei(costTier1).toLocaleString());
            setDisplayCostTier2(web3.utils.fromWei(costTier2).toLocaleString());
            setDisplayCostTier3(web3.utils.fromWei(costTier3).toLocaleString());
            setWeiCostTier1(costTier1);
            setWeiCostTier2(costTier2);
            setWeiCostTier3(costTier3);
            setTotalSupply(totalSupply);
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

    const getTotalCost = (currentSupply) => {
        const nextSupply = currentSupply + mintAmount;
        var cost;
        var totalCostWei = web3.utils.toBN(0);

        if (nextSupply <= 200) {
            // User needs to hold 1b GEN
            cost = web3.utils.toBN(weiCostTier1)
            totalCostWei = cost.mul(web3.utils.toBN(mintAmount));
        } else if (
            nextSupply > 200 &&
            nextSupply <= 250
        ) {
            // User needs to hold 1b GEN
            var tier1Mint = 0;
            if (currentSupply < 200) {
                tier1Mint = 200 - currentSupply;
                cost = web3.utils.toBN(weiCostTier1);
                totalCostWei = cost.mul(web3.utils.toBN(tier1Mint));
            }

            var tier2Mint = mintAmount - tier1Mint;
            cost = web3.utils.toBN(weiCostTier2)
            totalCostWei.add(cost.mul(web3.utils.toBN(tier2Mint)));
        } else {
            // User needs to hold 1b gen
            var tier2Mint = 0;
            if (currentSupply < 250) {
                tier2Mint = 250 - currentSupply;
                cost = web3.utils.toBN(weiCostTier2);
                totalCostWei = cost.mul(web3.utils.toBN(tier2Mint));
            }

            var tier3Mint = mintAmount - tier2Mint;
            cost = web3.utils.toBN(weiCostTier3)
            totalCostWei.add(cost.mul(web3.utils.toBN(tier3Mint)));
        }

        return totalCostWei;
    }

    const mintNFTs = async () => {
        const currentSupply = await nftContract.methods.totalSupply().call();
        var totalCostWei = getTotalCost(currentSupply);
        console.log(web3.utils.fromWei(totalCostWei));

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
                    {tokenBalance ? (<p>Your GEN Balance: {tokenBalance} GEN</p>) : (<p></p>)}
                    <p>Current supply: {totalSupply}</p>
                    <p>Max supply: {maxSupply}</p>
                    <p>Mint price tier 1 (0-200): {displayCostTier1} ETH</p>
                    <p>Mint price tier 2 (201-250): {displayCostTier2} ETH</p>
                    <p>Mint price tier 3 (251-275): {displayCostTier3} ETH</p>
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
                                <div>Last free spin claim: {new Date(element.lastFreeSpinTime * 1000).toLocaleDateString()} {new Date(element.lastFreeSpinTime * 1000).toLocaleTimeString()}</div>
                            ) : (<></>)}
                            <Button primary disabled={Number(element.lastFreeSpinTime) + Number(freeSpinTimeout) >= Number(currentTimestamp)} onPress={() => claimFreeSpin(element.attributes[0].value)}>Claim free spin</Button>
                        </div>)
                    })}
                </div>
            ) : (<></>)}
        </div>
    );
};

const styles = StyleSheet.create({
    price: {
        position: 'absolute',
        top: '1rem',
        left: '1rem',
    },
    priceText: {
        fontSize: '.75rem',
    },
    textInputArea: {
        textAlign: 'center',
    },
    textInput: {
        border: '3px solid #848584',
        fontFamily: 'MS Sans Serif',
        fontSize: '1rem',
        padding: '0.43rem'
    },
    textCenter: {
        textAlign: 'center',
    },
    infoView: {
        maxWidth: '40rem',
        width: '100%',
        margin: 'auto',
    },
    background: {
        flex: 1,
        backgroundColor: '#008080',
    },
    container: {
        flex: 1,
        maxWidth: '60rem',
        minWidth: '20rem',
        width: '100%',
        margin: 'auto',
    },
    textIndent: {
        paddingLeft: 16,
    },
    listItem: {
        height: 40,
        paddingHorizontal: 18,
    },
    panel: {
        flex: 1,
        padding: 8,
        marginTop: -4,
        paddingTop: 12,
    },
    zpanel: {
        flex: 1,
        padding: 8,
        marginTop: -4,
        paddingTop: 12,
        paddingBottom: 100,
        marginBottom: 18,
    },
    slotpanel: {
        flex: 1,
        padding: 8,
        marginTop: -4,
        paddingTop: 12,
        paddingBottom: 100,
        marginBottom: 18,
        minHeight: '76.6vw',
    },
    cutout: {
        flexGrow: 1,
        marginTop: 8,
    },
    content: {
        padding: 16,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginBottom: 16,
    },
    statusBar: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',

        marginTop: 4,
    },
    statusBarItem: {
        paddingHorizontal: 6,
        height: 32,
        justifyContent: 'center',
    },
    header: {
        justifyContent: 'center',
        marginBottom: -4,
        zIndex: 10,
    },
    logo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        top: 2,
    },
    logoImage: {
        position: 'absolute',
        left: -38,
        top: -4,
        height: 32,
        width: 32,
        resizeMode: 'cover',
    },
    heading: {
        fontSize: 24,
        fontStyle: 'italic',
    },
    aboutButton: {
        position: 'absolute',
        right: 8,
        height: 40,
        width: 40,
    },
    questionMark: {
        width: 26,
        height: 26,
    },
    scrollPanel: {
        zIndex: -1,
    },
});


export default NFTScreen;