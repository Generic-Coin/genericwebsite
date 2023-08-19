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
    Fieldset,
    List,
    Anchor
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
import bronzeSpinNft from './assets/images/b.png';
import silverSpinNft from './assets/images/s.png';
import goldSpinNft from './assets/images/g.png';
 
import GenericLogo from './assets/images/gcp.png';
 
 
const NFTScreen = () => {

    const openLink = (url: string) => {
        Linking.openURL(url).catch(err => console.warn("Couldn't load page", err));
      };
 
    const [isMobile, setIsMobile] = useState(false);
 
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
        };
 
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
 
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
 
 
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
 
    const nftContractAddress = ADDRESSES[DEFAULT_CHAIN_ID].freeSpinNft;
    const nftContract = new web3.eth.Contract(freeSpinNFTABI, nftContractAddress);
 
    const slotContractAddress = ADDRESSES[DEFAULT_CHAIN_ID].slots;
    const slotContract = new web3.eth.Contract(slotContractABI, slotContractAddress);
 
    // React states for the dApp
    const [tokenBalance, setTokenBalance] = useState('Loading...');
    const [formattedBalance, setFormatedBalance] = useState('Loading...');
 
 
    const [nftMetadata, setNftMetadata] = useState([]);
    const [mintingNFT, setMintingNFT] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [maxSupply, setMaxSupply] = useState('Loading...');
    const [costBronze, setCostBronze] = useState('Loading...');
 
    // cost conversion wei -> ether
    const [costBEther, setCostBEther] = useState('Loading...');
    const [costSEther, setCostSEther] = useState('Loading...');
    const [costGEther, setCostGEther] = useState('Loading...');
 
    // total supply of the nfts
    const [supplyBronzeNFT, setSupplyBronzeNFT] = useState();
    const [supplySilverNFT, setSupplySilverNFT] = useState();
    const [supplyGoldNFT, setSupplyGoldNFT] = useState();
 
    const [costSilver, setCostSilver] = useState('Loading...');
    const [costGold, setCostGold] = useState('Loading...');
    const [totalSupply, setTotalSupply] = useState('Loading...');
    const [statusMessage, setStatusMessage] = useState('Buy your Generic Spin NFT');
    const [currentTimestamp, setCurrentTimestamp] = useState('Loading...');
    const [freeSpinTimeout, setFreeSpinTimeout] = useState('Loading...');
    const [verticalMenuOpen, setVerticalMenuOpen] = React.useState(false);
 
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
 
            // Price to mint 1 NFT, in ETH
            const costBronze = await nftContract.methods.costTier1().call();
            const costBronzeInEther = await web3.utils.fromWei(costBronze, 'ether');
 
            const costSilver = await nftContract.methods.costTier2().call();
            const costSilverInEther = await web3.utils.fromWei(costSilver, 'ether');
 
            const costGold = await nftContract.methods.costTier3().call();
            const costGoldInEther = await web3.utils.fromWei(costGold, 'ether');
 
  
            // TODO: display max supplies on page maybe? | // static value not needed, also slows down dapp :^)
            // const maxSupplyBronze = await nftContract.methods.maxSupplyTier1().call();
            // const maxSupplySilver = await nftContract.methods.maxSupplyTier2().call();
            // const maxSupplyGold = await nftContract.methods.maxSupplyTier3().call();
 
            // TODO: when user presses mint button, check if circulating supply < maxSupply and display error if that's not the case or disable mint button, whatever works for you
            const circulatingSupplyBronze = await nftContract.methods.circulatingSupplyTier1().call();
            setSupplyBronzeNFT(circulatingSupplyBronze);
 
            const circulatingSupplySilver = await nftContract.methods.circulatingSupplyTier2().call();
            setSupplySilverNFT(circulatingSupplySilver);
 
            const circulatingSupplyGold = await nftContract.methods.circulatingSupplyTier3().call();
            setSupplyGoldNFT(circulatingSupplyGold);
 
            // The minimum GEN balance that a user needs to have to be able to mint a specific tier.
            // TODO: when user presses mint button, check if tokenBalance >= minTokenBalance and display error if that's not the case
 
            // will do
            // const minTokenBalanceBronze = await nftContract.methods.minTokenBalanceTier1().call();
            // const minTokenBalanceSilver = await nftContract.methods.minTokenBalanceTier2().call();
            // const minTokenBalanceGold = await nftContract.methods.minTokenBalanceTier3().call();
 
            const totalSupply = await nftContract.methods.totalSupply().call();
            const formatTokenBalance = await web3.utils.fromWei(tokenBalance,'ether')
            const formattedBalance = parseInt(formatTokenBalance);
    
 
 
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
 
            // Add the fetched data to the metaObj array
            metaObj.push({
                'name': 'Generic Spin NFT - Bronze',
                'description': 'This NFT will give the user benefits in the Generic Slots app.',
                'image': <img src={bronzeSpinNft} />,
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
 
            // metaObj[0]['lastFreeSpinTime'] = '0';
            // metaObj[1]['lastFreeSpinTime'] = '1680723533';
            // console.log("metaobject??????????????", metaObj);
            /****************************** */
 
            setNftMetadata(metaObj);
 
            setTokenBalance(tokenBalance);
            setFormatedBalance(formattedBalance);
 
 
 
            setCostBronze(costBronze);
            setCostBEther(costBronzeInEther);
 
            setCostSilver(costSilver);
            setCostSEther(costSilverInEther);
 
            setCostGold(costGold);
            setCostGEther(costGoldInEther);
 
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
 
 
    const mintBronze = async () => {
        setStatusMessage(`Minting your NFT...`);
        setMintingNFT(true);
        await nftContract.methods
            .mintTier1()
            .send({
                from: account,
                value: costBronze,
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
 
    const mintSilver = async () => {
        setStatusMessage(`Minting your NFT...`);
        setMintingNFT(true);
        await nftContract.methods
            .mintTier2()
            .send({
                from: account,
                value: costSilver,
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
 
    const mintGold = async () => {
        setStatusMessage(`Minting your NFT...`);
        setMintingNFT(true);
        await nftContract.methods
            .mintTier3()
            .send({
                from: account,
                value: costGold,
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
 
 
    return (
        <View style={styles.background}>
            <View style={styles.container}>
            <>
                <AppBar style={styles.header}>
                    <View style={styles.logo}>
                    <Image style={styles.logoImage} source={GenericLogo} />
                    <Text style={styles.heading} bold disabled>
                        Generic NFTs
                    </Text>
                    </View>
                </AppBar>
 
                <Panel variant='raised' style={styles.panel}>
                    <Panel variant='cutout' style={styles.cutout}>
                    <ScrollView
                        style={styles.scrollView}
                        scrollViewProps={{
                        contentContainerStyle: styles.content,
                        }}
                    >
 
                        <div>
                           
                        {/* <div style={{ display: 'flex', alignItems: 'center', float: 'right' }}> */}
                        <div style={{backgroundColor: '#010081'}}>
                        <ConnectMetamask />
                        </div>
 
 
 
                            {isMobile 
                            
                            ? 
                            <>
                            {/* MOBILE VIEW BEGINS HERE ***/}
 
                            {active ? (
 
 
                                <Text>
                                    <div>
                                        <div style={{textAlign: 'center', minHeight: '120px', maxHeight: '120px',}}>
                                        
                                        {/* <p>Mint price bronze tier (0-200): {web3.utils.fromWei(costBronze).toLocaleString()} ETH</p>
                                        <p>Mint price silver tier (201-250): {web3.utils.fromWei(costSilver).toLocaleString()} ETH</p>
                                        <p>Mint price gold tier (251-275): {web3.utils.fromWei(costGold).toLocaleString()} ETH</p> */}
                                        <List.Accordion title='Statistics' style={styles.section} defaultExpanded >
                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid #D8D8D8', backgroundColor: '#C6C6C6' }}>
 
                                                <span style={{ marginBottom: '20px', marginTop: '10px' }}>
                                                    <b style={{ fontSize: '18px', backgroundColor: '' }}>Current Supply Minted</b>
                                                    <fieldset style={{ fontSize: '24px', minWidth: '150px', maxWidth: '150px', marginTop: '10px', marginBottom: '10px', border: '7px solid #6A6A6A', backgroundColor: 'black', color: 'white', paddingTop: '10px', paddingBottom: '10px' }}>
                                                        {totalSupply}
                                                    </fieldset>
                                                </span>
 
                                                <span style={{ marginBottom: '20px' }}>
                                                    <b style={{ fontSize: '18px' }}>Max Supply Available</b>
                                                    <fieldset style={{ fontSize: '24px', minWidth: '150px', maxWidth: '150px', marginTop: '10px', marginBottom: '10px', border: '7px solid #6A6A6A', backgroundColor: 'black', color: 'white', paddingTop: '10px', paddingBottom: '10px' }}>
                                                        {maxSupply}
                                                    </fieldset>
                                                </span>
 
                                                <span>
                                                    <b style={{ fontSize: '18px' }}>Your GEN Balance</b>
                                                    <fieldset style={{ fontSize: '24px', minWidth: '150px', maxWidth: '150px', marginTop: '10px', marginBottom: '10px', border: '7px solid #6A6A6A', backgroundColor: 'black', color: 'white', paddingTop: '10px', paddingBottom: '10px' }}>
                                                        {formattedBalance}
                                                    </fieldset>
                                                </span>
 
                                            </div>
                                        </List.Accordion>
 
 
                                        <div>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <div style={{ width: "100%", maxWidth: "300px", color: "black", marginBottom: '20px' }}>
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <img style={{ width: "100%", height: "auto", margin:'1rem auto 1rem' }} src={bronzeSpinNft} alt="nft1" />
                                                </div>
                                                <div style={{ color: "black", textAlign: 'center' }}>Generic Spin NFT - Bronze</div>
                                                <div style={{ color: "black", textAlign: 'center', paddingTop: '15px' }}>Hold 500M $GEN to mint bronze</div>
                                                <p style={{ color: "black", textAlign: 'center' }}>{supplyBronzeNFT}/200 minted</p>
                                                <p style={{ color: "black", textAlign: 'center' }}>Mint price: {(costBEther + " ETH")}</p>
                                                <Button style={{ width: '100%' }} primary disabled={mintingNFT || !isInitialized} onPress={() => mintBronze()}>Mint Bronze</Button>
                                            </div>
                                            <div style={{ width: "100%", maxWidth: "300px", color: "black", marginBottom: '20px' }}>
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <img style={{ width: "100%", height: "auto", margin:'1rem auto 1rem' }} src={silverSpinNft} alt="nft2" />
                                                </div>
                                                <div style={{ color: "black", textAlign: 'center' }}>Generic Spin NFT - Silver</div>
                                                <div style={{ color: "black", textAlign: 'center', paddingTop: '15px' }}>Hold 500M $GEN to mint silver</div>
                                                <p style={{ color: "black", textAlign: 'center' }}>{supplySilverNFT}/50 minted</p>
                                                <p style={{ color: "black", textAlign: 'center' }}>Mint price: {costSEther + " ETH"} </p>
                                                <Button style={{ width: '100%' }} primary disabled={mintingNFT || !isInitialized} onPress={() => mintSilver()}>Mint Silver</Button>
                                            </div>
                                            <div style={{ width: "100%", maxWidth: "300px", color: "black" }}>
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <img style={{ width: "100%", height: "auto", margin:'1rem auto 1rem' }} src={goldSpinNft} alt="nft3" />
                                                </div>
                                                <div style={{ color: "black", textAlign: 'center' }}>Generic Spin NFT - Gold</div>
                                                <div style={{ color: "black", textAlign: 'center', paddingTop: '15px' }}>Hold 1B $GEN to mint gold</div>
                                                <p style={{ color: "black", textAlign: 'center' }}>{supplyGoldNFT}/25 minted</p>
                                                <p style={{ color: "black", textAlign: 'center' }}>Mint price: {costGEther + " ETH"} </p>
                                                <Button style={{ width: '100%', marginBottom: '20px' }} primary disabled={mintingNFT || !isInitialized} onPress={() => mintGold()}>Mint Gold</Button>
                                            </div>
                                        </div>
                                    </div>
                                        </div>
                                        </div>
                                        
 
                                
                                    {/* <b style={{textAlign: 'center'}}>{tokenBalance ? (<p>Your GEN Balance: {tokenBalance} GEN</p>) : (<p></p>)}</b> */}
                                
                                </Text>
                                ) : (<></>)}
                            
                            </>
                           
                            
                            : 
                            
                            <>
                            {active ? (
 
 
                            <Text>
 
                                
                                <div>
                                    <div style={{textAlign: 'center', minHeight: '120px', maxHeight: '120px',}}>
                                    
                                    {/* <p>Mint price bronze tier (0-200): {web3.utils.fromWei(costBronze).toLocaleString()} ETH</p>
                                    <p>Mint price silver tier (201-250): {web3.utils.fromWei(costSilver).toLocaleString()} ETH</p>
                                    <p>Mint price gold tier (251-275): {web3.utils.fromWei(costGold).toLocaleString()} ETH</p> */}
 
                                    <List.Accordion title='Statistics' style={styles.section} defaultExpanded >
                                        
                                    <div style={{ display: 'flex', minHeight: '120px', maxHeight: '120px', justifyContent: 'center', alignItems: 'center', border: '1px solid #D8D8D8', backgroundColor: '#C6C6C6' }}>
 
                                    <span>
                                    <b style={{fontSize: '18px'}}>Current Supply Minted</b>
                                    <fieldset style={{ fontSize: '24px', flex: '1',  minWidth: '150px', maxWidth: '150px', marginTop: '10px', marginBottom: '10px', border: '7px solid #6A6A6A', backgroundColor: 'black', color: 'white', paddingTop: '10px', paddingBottom: '10px'  }}>
                                        {totalSupply}
                                    </fieldset>
                                    </span>
 
                                    <span>
                                    <b style={{fontSize: '18px'}}>Max Supply Available</b>
                                    <fieldset style={{ fontSize: '24px', flex: '1',  minWidth: '150px', maxWidth: '150px', marginTop: '10px', marginBottom: '10px', border: '7px solid #6A6A6A', backgroundColor: 'black', color: 'white', paddingTop: '10px', paddingBottom: '10px'  }}>
                                        {maxSupply}
                                    </fieldset>
                                    </span>
 
                                    <span>
                                    <b style={{fontSize: '18px'}}>Your GEN Balance</b>
                                    <fieldset style={{ fontSize: '24px', flex: '1',  minWidth: '150px', maxWidth: '150px', marginTop: '10px', marginBottom: '10px', border: '7px solid #6A6A6A', backgroundColor: 'black', color: 'white', paddingTop: '10px', paddingBottom: '10px'  }}>
                                        {formattedBalance}
                                    </fieldset>
                                    </span>
 
                                    </div>
                                    </List.Accordion>
 
 
                                    </div>
 
 
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: '45px' }}>
                                    <div style={{ border: "", width: "14rem", color: "black" }}>
                                    
                                        <div style={{ display: "flex", justifyContent: "center" }}>
 
 
                                        <img style={{minWidth: '100%', maxWidth: '100%', minHeight: '275px', maxHeight: '275px', margin:'1rem auto 1rem'}} src={bronzeSpinNft} />
                                        </div>
                                        <div style={{ color: "black", textAlign: 'center'}}>Generic Spin NFT - Bronze</div>
                                        <div style={{ color: "black", textAlign: 'center', paddingTop: '15px'}}>Hold 500M $GEN to mint bronze</div>
                                        <p style={{ color: "black", textAlign: 'center'}}>{supplyBronzeNFT}/200 minted</p>
                                        <p style={{ color: "black", textAlign: 'center'}}>Mint price: {(costBEther + " ETH")}</p>
                                        <Button style={{width: '100%'}} primary disabled={mintingNFT || !isInitialized} onPress={() => mintBronze()}>Mint Bronze</Button>
                                        {/* <Button primary disabled={false} onPress={() => claimFreeSpin("nft1_value")}>Claim free spin</Button> */}
                                    </div>
                                    <div style={{ width: "14rem", color: "black" }}>
                                        
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                        <img style={{minWidth: '100%', maxWidth: '100%', minHeight: '275px', maxHeight: '275px', margin:'1rem auto 1rem'}} src={silverSpinNft} />
                                        </div>
                                        <div style={{ color: "black", textAlign: 'center'}}>Generic Spin NFT - Silver</div>
                                        <div style={{ color: "black", textAlign: 'center', paddingTop: '15px'}}>Hold 500M $GEN to mint silver</div>
                                        <p style={{ color: "black", textAlign: 'center'}}>{supplySilverNFT}/50 minted</p>
                                        <p style={{ color: "black", textAlign: 'center'}}>Mint price: {costSEther + " ETH"} </p>
                                        <Button style={{width: '100%'}} primary disabled={mintingNFT || !isInitialized} onPress={() => mintSilver()}>Mint Silver</Button>
                                        {/* <Button primary disabled={false} onPress={() => claimFreeSpin("nft2_value")}>Claim free spin</Button> */}
                                    </div>
                                    <div style={{  width: "14rem", color: "black" }}>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                        <img style={{minWidth: '100%', maxWidth: '100%', minHeight: '275px', maxHeight: '275px', margin:'1rem auto 1rem'}} src={goldSpinNft} />
                                        </div>
                                        <div style={{ color: "black", textAlign: 'center'}}>Generic Spin NFT - Gold</div>
                                        <div style={{ color: "black", textAlign: 'center', paddingTop: '15px'}}>Hold 1B $GEN to mint gold</div>
                                        <p style={{ color: "black", textAlign: 'center'}}>{supplyGoldNFT}/25 minted</p>
                                        <p style={{ color: "black", textAlign: 'center'}}>Mint price: {costGEther + " ETH"} </p>
                                        <Button style={{width: '100%'}} primary disabled={mintingNFT || !isInitialized} onPress={() => mintGold()}>Mint Gold</Button>
                                        {/* <Button primary disabled={false} onPress={() => claimFreeSpin("nft3_value")}>Claim free spin</Button> */}
                                    </div>
                                   
 
 
                                    </div>
                                    </div>
                                    
                                    
 
 
                                {/* <b style={{textAlign: 'center'}}>{tokenBalance ? (<p>Your GEN Balance: {tokenBalance} GEN</p>) : (<p></p>)}</b> */}
 
                            </Text>
                            ) : (<></>)
                            }
                            </>
 
                            }
                           
                          
 
 
 
 
 
 
 
 
 
 
                            
                            
                        </div>
                    
                    </ScrollView>
                    </Panel>
                            <View style={[styles.statusBar]}>
                                                <Panel
                                                variant='well'
                                                style={[
                                                    styles.statusBarItem, 
                                                    { flexGrow: 1, marginRight: 4, },
                                                ]}
                                                ></Panel>
                                                <Panel variant='well' style={[styles.statusBarItem]}>
                                                <Anchor
                                                    underline
                                                    onPress={() => openLink('mailto:admin@generic.money')}
                                                >
                                                    admin@generic.money
                                                </Anchor>
                                                </Panel>
                            </View>
                </Panel>
            </>
            </View>
            <View style={styles.startMenu}>
        <AppBar style={styles.startHeader}>
          <View>
            <Menu
              style={{bottom: '2.9rem', left: '-0.45rem', minWidth: '10rem'}}
              open={verticalMenuOpen}
              anchor={
                <Button
                  active={verticalMenuOpen}
                  onPress={() => setVerticalMenuOpen(state => !state)}
                >
                  <div style={{flexDirection: 'row'}}>
                    <div style={{float: 'left', fontFamily: 'MS Sans Serif'}}>
                      <Image style={styles.startLogoImage} source={GenericLogo} />
                    </div> 
                    <div style={{float: 'left', fontFamily: 'MS Sans Serif', margin: '0.25rem 0 0 0.4rem'}}>
                       Navigate
                    </div>
                  </div>
                </Button>
              }
            >
              <Menu.Item
                size='lg'
                onPress={() => openLink('/')}
                title='Home'
              />
              <Menu.Item
                size='lg'
                // disabled
                onPress={() => openLink('/team')}
                title='Team'
              />
              <Menu.Item
                size='lg'
                // disabled
                onPress={() => openLink('/slots')}
                title='Slots'
              />
              <Menu.Item
                size='lg'
                disabled
                onPress={() => openLink('/exchange')}
                title='Exchange'
              />
              <Menu.Item
                size='lg'
                disabled
                onPress={() => openLink('/staking')}
                title='Staking'
              />
              <Menu.Item
                size='lg'
                onPress={() => openLink('/nft')}
                title='NFTs'
              />
              {/* <Title>Letters</Title> */}
              {/* <Menu.Item size='lg' onPress={() => notify('A')} title='A' /> */}
              {/* <Divider size='auto' /> */}
              {/* <Menu.Item
                size='lg'
                disabled
                onPress={() => notify('Disabled Item')}
                title='Disabled Item'
              /> */}
            </Menu>
          </View>
 
        </AppBar>
      </View>
        </View>
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
        // maxHeight: '100vh',
        maxWidth: '60rem',
        minWidth: '20rem',
        width: '100%',
        margin: 'auto',
        marginBottom: '105px',
        marginTop: '29px',
 
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
        // padding: 8,
        // marginTop: -4,
        // flexDirection: 'column',
  
        // paddingTop: 0,
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
        backgroundColor: 'white'
    },
    content: {
        padding: 16
 
    },
    scrollView: {
        flex: 1,
    },
    section: {
        // marginBottom: 16,
        width: '100%'
    },
    statusBar: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginTop: 4,
        // backgroundColor: 'lime'
    },
    statusBarItem: {
        paddingHorizontal: 6,
        height: 32,
        justifyContent: 'center',
        // marginTop: '100px',
      
   
        
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
    startMenu: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        textAlign: 'left',
      },
      startHeader: {
        justifyContent: 'left',
        marginBottom: -4,
        zIndex: 10,
      },
      startText: {
        fontFamily: 'MS Sans Serif',
        float: 'left',
      },
      startLogoImage: {
        float: 'left',
        position: 'relative',
        height: 24,
        width: 24,
      },
});
 
 
export default NFTScreen;