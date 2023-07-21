import React, { useState, useEffect, useRef } from 'react';
import useAnimation from './use-animation';
import {
  StyleSheet,
  View,
  Image,
  Linking,
  Platform,
  Animated,
  // Animated,
  // TouchableOpacity,
} from 'react-native';
import {
  Panel,
  AppBar,
  Button,
  List,
  Text,
  ScrollView,
  Menu,
  Window,
  // Anchor,
  // Select,
  // Fieldset,
} from 'react95-native';
// import { AntDesign } from '@expo/vector-icons';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useWalletConnect,
  withWalletConnect,
} from '@walletconnect/react-native-dapp';
import { notificationService } from './util/notifications';



import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { injected } from './supportedNetworks';
import slotContractABI from './assets/contracts/slotsABI.json';
import tokenABI from './assets/contracts/tokenABI.json';

import GenericLogo from './assets/images/gcp.png';
import SlotMachine from './assets/images/slots.png';
import Reel1 from './assets/images/reel/1.png';
import Reel2 from './assets/images/reel/2.png';
import Reel3 from './assets/images/reel/3.png';
import Reel4 from './assets/images/reel/4.png';
import Reel5 from './assets/images/reel/5.png';
import Reel6 from './assets/images/reel/6.png';
import Reel7 from './assets/images/reel/7.png';
import Reel8 from './assets/images/reel/8.png';
import Reel9 from './assets/images/reel/9.png';
// import ReelMetaMask from './assets/images/slots.png';
// import Reel from './assets/images/slots.png';
import ADDRESSES from './constants/addresses';
import ConnectMetamask from './components/ConnectMetamask';
import { DEFAULT_CHAIN_ID } from './constants/chains';

const AppScreen = () => {
  
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
  
  const [reel1, setReel1] = useState('');
  const [reel2, setReel2] = useState('');
  const [reel3, setReel3] = useState('');
  
  // Web3 implementation
  const web3 = new Web3(Web3.givenProvider);
  const { active, account, activate } = useWeb3React();
  // Load Slot Machine Interface Test
  const slotContractAddy = ADDRESSES[DEFAULT_CHAIN_ID].slots;
  // // Load Slot Machine Interface Live
  // const slotContractAddy = '0x8e507a4eb9979d61ae6dca9bafdf3c346e9be82f';
  const slotContract = new web3.eth.Contract(slotContractABI, slotContractAddy);
  // Load GENv3 Interface Test
  // const tokenContractAddy = '0x91AaC8770958E95B77384b2878D3D9f7A79d9562';
  const tokenContractAddy = ADDRESSES[DEFAULT_CHAIN_ID].genericToken;
  // // Load GENv3 Interface Live
  // const tokenContractAddy = '0xe541eC6E868E61c384d2d0B16b972443cc1D8996';
  const tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddy);

  // React states for the dApp
  const [vrfFee, setVrfFee] = useState('');
  const [priceETH, setPriceETH] = useState('Loading...');
  const [priceGEN, setPriceGEN] = useState('Loading...');
  const [pendingPrize, setPendingPrize] = useState('Loading...');
  const [prizePool, setPrizePool] = useState('Loading...');
  const [BNBBalance, setBNBBalance] = useState('Loading...');
  const [tokenBalance, setTokenBalance] = useState('Loading...');
  const [roundInfo, setRoundInfo] = useState('');
  const [hasAllowance, setHasAllowance] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isRoundFetch, setIsRoundFetch] = useState(false);
  const [isSlotRolling, setIsSlotRolling] = useState(false);
  const [isFreeSpin, setIsFreeSpin] = useState(false);
  const [spinHistory, setSpinHistory] = useState([]);
  const [verticalMenuOpen, setVerticalMenuOpen] = React.useState(false);
  
  let currentBlockNumber: number;

  // Define timer for usage with Async requests
  const timer = ms => new Promise(res => setTimeout(res, ms));
    
  let dotCounter: number = 0;
  
  useEffect(() => {
    if (web3.givenProvider !== null) {
      const id = setInterval(() => {
        fetchContractData();
      }, 15000);
      fetchContractData();
      return () => clearInterval(id);
    } else {
      return null;
    }
  }, [active]);

  const fetchContractData = async () => {
    // if (!!slotContract) {
      try {
        // Get the last rounds played by the player, maximum 30 round ID's will be returned
        let roundsplayed = await slotContract.methods
          .getLastRoundsPlayed(account, 30)
          .call();

        let historyArray = await slotContract.methods.getMultipleRoundInfo(roundsplayed).call();
        historyArray = [...historyArray].reverse();

        setSpinHistory(historyArray);
        //console.warn('spinHistory', historyArray);

        const vrfFee = await slotContract.methods.vrfFee().call();  
        const priceEth = await slotContract.methods.minEthSpinPrice().call();
        const priceGEN = await slotContract.methods.minTokenSpinPrice().call();
        const allowance = await tokenContract.methods
          .allowance(account, slotContractAddy)
          .call();
        // const pendingPrizes = await slotContract.methods
        //   .pendingWinnings(account)
        //   .call();
        // console.warn('pendingPrizes', pendingPrizes)
        const prizesPool = await slotContract.methods.prizePool().call();
        // console.warn('prizesPool', prizesPool);
        const balanceBNB = await web3.eth.getBalance(account);
        const balanceToken = await tokenContract.methods
          .balanceOf(account)
          .call();

        const hasAllowance = web3.utils.toBN(allowance).gte(web3.utils.toBN(priceGEN));
        setHasAllowance(hasAllowance);

        // setPriceETH(web3.utils.fromWei(priceEth) + ' BNB');
        setPriceETH(web3.utils.fromWei(priceEth));
        // setPriceGEN(web3.utils.fromWei(priceGEN) + ' GENv3');
        setPriceGEN(web3.utils.fromWei(priceGEN));
        // setPendingPrize(web3.utils.fromWei(pendingPrizes) + ' GENv3');
        // setPendingPrize(web3.utils.fromWei(pendingPrizes));
        setPrizePool( Math.round(web3.utils.fromWei(prizesPool)).toLocaleString() + ' GEN');
        // setBNBBalance(web3.utils.fromWei(balanceBNB) + ' BNB');
        setBNBBalance(web3.utils.fromWei(balanceBNB));
        // setTokenBalance(web3.utils.fromWei(balanceToken) + ' GENv3');
        setTokenBalance(web3.utils.fromWei(balanceToken));
      } catch (ex) { }
    // }
  };
  
  const getRoundHistory = async (e) => {
    let response : Promise<Number> = await slotContract.methods.roundInfo(e).call(); // : Promise<Number>
    console.log(response);
    return response;
  }

  const rollEth = async () => {
    setIsRoundFetch(false);
    if (!!slotContract) {
      try {
        // Obtain the roll price directly from the contract and update it in the case it gets modified at some point.
        const vrfFee = await slotContract.methods.vrfFee().call();
        const price = await slotContract.methods.minEthSpinPrice().call();
        const totalPrice = web3.utils.toBN(price).add(web3.utils.toBN(vrfFee));
        setPriceETH(web3.utils.fromWei(price));
        // Roll the slot machine
        await slotContract.methods
          .ethSpin()
          .send({ from: account, value: totalPrice });
        const roundIndex = (await slotContract.methods.getLastRoundsPlayed(account, 1).call())[0];
        // Rolling state for the UI
        setIsSlotRolling(true);
        let resp = await slotContract.methods
          .roundInfo(roundIndex)
          .call();
        // While Chainlink is processing the VRF, send a request every three seconds until it's fulfilled.
        while (resp['finished'] === false) {
          await timer(3000);
          resp = await slotContract.methods
            .roundInfo(roundIndex)
            .call();
          console.warn('ok', resp);
        }

        // Finish the rolling state and display the results
        setRoundInfo(resp);
        setIsRoundFetch(true);
        setIsSlotRolling(false);
      } catch (ex) { }
    }
  };
  
  
  // const blockNumber = async () => {
  //   try {
  //     currentBlockNumber = await web3.eth.getBlockNumber();
  //     
  //     if (currentBlockNumber) {
  //       slotContract.events.Spin({
  //         fromBlock: currentBlockNumber - 10
  //       }, function (error, event) {
  //       // callback
  //       })
  //       .on('connected', function (subscriptionId) {
  //         console.log(subscriptionId);
  //       })
  //       .on('data', function (event) {
  //       console.log(event); // same results as the optional callback above
  //       })
  //     }
  //     
  //   } catch (ex) { }
  // }
  



  const handleApprove = async () => {
    if (!!tokenContract) {
      try {
        await tokenContract.methods
          .approve(
            slotContractAddy,
            '115792089237316195423570985008687907853269984665640564039457584007913129639935',
          )
          .send({ from: account });
        setHasAllowance(true);
      } catch (ex) {
        return;
      }
    }
  };

  // const handleClaim = async () => {
  //   if (!!slotContract) {
  //     try {
  //       await slotContract.methods.claimPrizes().send({ from: account });
  //       setPendingPrize('0');
  //       roundInfo['payout'] = '0';
  //     } catch (ex) {
  //       console.log(ex);
  //       return;
  //     }
  //   }
  // };

  const rollToken = async () => {
    setIsRoundFetch(false);
    if (!!slotContract) {
      try {
        // Obtain the roll price directly from the contract and update it in the case it gets modified at some point.
        const vrfFee = await slotContract.methods.vrfFee().call();
        const price = await slotContract.methods.minTokenSpinPrice().call();
        setPriceGEN(web3.utils.fromWei(price));
        // Roll the slot machine
        await slotContract.methods.tokenSpin(price).send({ from: account, value: vrfFee });

        const roundIndex = (await slotContract.methods.getLastRoundsPlayed(account, 1).call())[0];
        // Rolling state for the UI
        setIsSlotRolling(true);
        let resp = await slotContract.methods
          .roundInfo(roundIndex)
          .call();
        // While Chainlink is processing the VRF, send a request every three seconds until it's fulfilled.
        while (resp['finished'] === false) {
          await timer(3000);
          resp = await slotContract.methods
            .roundInfo(roundIndex)
            .call();
        }

        // Finish the rolling state and display the results
        setRoundInfo(resp);
        setIsRoundFetch(true);
        setIsSlotRolling(false);
      } catch (ex) { }
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.warn("Couldn't load page", err));
  };

  // const displayWC = () => {
  //   const connector = useWalletConnect();
  //   if (!connector.connected) {
  //     /**
  //      *  Connect! 🎉
  //      */
  //     return (
  //       <Button primary onPress={() => connector.connect()}>
  //         Use WalletConnect
  //       </Button>
  //     );
  //   }
  //   return (
  //     <Button primary onPress={() => connector.killSession()}>
  //       Disconnect WalletConnect
  //     </Button>
  //   );
  // };
  // const connectToMM = async () => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   await provider.send('eth_requestAccounts', []);
  // };

  /*const connectToMM = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
  };*/
  
  const translateY = useRef(new Animated.Value(0)).current;  
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateY, {
        toValue: -500,
        duration: 150,
        useNativeDriver: false,
      })
    );
    animation.start();
  });
  
  const imageMap = (reelNumber: string) => {
    if (reelNumber === 'random') {
      reelNumber = String(Math.floor(Math.random() * 9));
    }
    switch (reelNumber) {
      case '0': return Reel1;
      case '1': return Reel2;
      case '2': return Reel3;
      case '3': return Reel4;
      case '4': return Reel5;
      case '5': return Reel6;
      case '6': return Reel7;
      case '7': return Reel8;
      case '8': return Reel9;
    }
  }

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        
        <View style={{ backgroundColor: 'teal', flex: 1, padding: 16 }}>
          <Window
            title='slots.exe'
            style={{flex: 1}}
          >
            <div style={{ margin:'-2.375rem .15rem 0 0' }}>
              <ConnectMetamask />
            </div>
            <View style={styles.windowContent}>
              <Text style={{ fontSize: '2.5rem', margin: '.75rem' }}>
                  <div style={{textAlign: 'center'}}>
                    <b>CURRENT JACKPOT</b><br/>
                    <div style={{
                      color: '#fff',
                      background: '#000',
                      border: '.5rem solid #6a6a6a',
                      padding: '1rem .5rem'
                    }}>{prizePool}</div>
                  </div>
              </Text>

              <div style={{
                  position: 'relative',
                  width: 'auto',
                  padding: '2rem 0',
                  margin: '1rem',
                  zIndex: -1,
                  height: '7rem',
                  overflow: 'hidden',
                  border: '0.3rem black solid',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'
                }}>
                  {isRoundFetch === true ? (
                      <Text>
                        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%'}}>

                          <div style={{width:'30%', maxWidth:'7.5rem', margin:'0 1rem', flex:1}}>
                            <img src={imageMap( roundInfo['symbols'][0] )} style={{width: '100%', height: '100%'}}/>
                          </div>
                          <div style={{width:'30%', maxWidth:'7.5rem', margin:'0 1rem', flex:1}}>
                            <img src={imageMap( roundInfo['symbols'][1] )} style={{width: '100%', height: '100%'}}/>
                          </div>
                          <div style={{width:'30%', maxWidth:'7.5rem', margin:'0 1rem', flex:1}}>
                            <img src={imageMap( roundInfo['symbols'][2] )} style={{width: '100%', height: '100%'}}/>
                          </div>

                        </div>
                      </Text>
                  ) : (
                      <>
                        {isSlotRolling ? (
                          <View
                            style={{
                              left: '1.3%',
                              marginTop: '-21vw',
                              paddingTop: '51.4%',
                              textAlign: 'center',
                              maxHeight: '40vw',
                              overflow: 'hidden',
                              display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'
                            }}
                          >
                            <Animated.Text
                              style={{
                                fontWeight: 'bold',
                                padding: '0 2%',
                                margin: 0,
                                fontFamily: 'MS Sans Serif',
                                fontSize: 'clamp(1rem, 6.4rem, 9.3vw)',
                                transform: [{ translateY }],
                              }}
                            >
                            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>

                            <div style={{width:'7.5rem', height:'7.5rem', margin:'0 1rem', flex:1}}>
                              <img src={imageMap('1')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('2')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('3')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('4')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('5')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('6')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('7')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('8')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('9')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('0')} style={{width: '100%', height: '100%'}} />
                            </div>
                            <div style={{width:'7.5rem', height:'7.5rem', margin:'0 1rem', flex:1}}>
                              <img src={imageMap('2')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('3')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('4')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('5')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('6')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('7')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('8')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('9')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('0')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('1')} style={{width: '100%', height: '100%'}} />
                            </div>
                            <div style={{width:'7.5rem', height:'7.5rem', margin:'0 1rem', flex:1}}>
                              <img src={imageMap('3')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('4')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('5')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('6')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('7')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('8')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('9')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('0')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('1')} style={{width: '100%', height: '100%'}} /><br/>
                              <img src={imageMap('2')} style={{width: '100%', height: '100%'}} />
                            </div>

                            </div>
                            </Animated.Text>
                          </View>
                        ) : (
                          <Text>
                            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%'}}>
                              <div style={{width:'30%', maxWidth:'7.5rem', margin:'0 1rem', flex:1}}>
                                <img src={imageMap('1')} style={{width: '100%', height: '100%'}} />
                              </div>
                              <div style={{width:'30%', maxWidth:'7.5rem', margin:'0 1rem', flex:1}}>
                                <img src={imageMap('2')} style={{width: '100%', height: '100%'}} />
                              </div>
                              <div style={{width:'30%', maxWidth:'7.5rem', margin:'0 1rem', flex:1}}>
                                <img src={imageMap('3')} style={{width: '100%', height: '100%'}} />
                              </div>
                            </div>

                          </Text>
                          )}
                      </>
                    )}
              </div>

              <div style={{  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                <div style={{width:'30%', flex: 1, padding: '0 1rem',}}>
                  <Text>
                    {active ? (
                      <div style={{
                        textAlign: 'center', 
                        margin: '0 0.5rem',
                        fontSize: '2rem',
                      }}>
                        {(active && tokenBalance) ? (<div>
                          <div>GEN BALANCE<br/></div>
                          <div style={{
                            color: '#fff',
                            background: '#000',
                            border: '.5rem solid #6a6a6a',
                            padding: '1rem .5rem'
                          }}>{ Math.round(Number(tokenBalance)).toLocaleString() }</div>
                        </div>) : (<></>)}<br/>
                      </div>
                    ) : (
                      <></>
                    )}
                    </Text>
                </div>
                <div style={{width:'30%', flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'end'}}>
                  <Image style={{width: '5rem', height: '5rem'}} source={GenericLogo} />
                </div>
                <div style={{width:'30%', flex: 1, padding: '0 1rem',}}>
                  <Text>
                    {active ? (
                      <div style={{
                        textAlign: 'center', 
                        margin: '0 0.5rem',
                        fontSize: '2rem',
                      }}>
                        {(active && BNBBalance) ? (<div>
                          <div>ETH BALANCE<br/></div>
                          <div style={{
                            color: '#fff',
                            background: '#000',
                            border: '.5rem solid #6a6a6a',
                            padding: '1rem .5rem'
                          }}>{ Number(BNBBalance).toFixed(4).toLocaleString() }</div>
                        </div>) : (<></>)}<br/>
                      </div>
                    ) : (
                      <></>
                    )}
                  </Text>
                </div>
              </div>

              <div style={{  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                    <div style={{width:'30%', flex: 1, padding: '0 1rem',}}>
                      <div>
                        <Button style={{ margin: '0 0.25rem 1rem', height: '4rem'}} primary disabled={isSlotRolling || !active || !hasAllowance} onPress={() => rollToken()}>
                          <span style={{fontFamily: 'MS Sans Serif'}}>GEN SPIN{active ? (<span> {priceGEN}</span>) : (<span></span>)}</span>
                        </Button> 
                        <Button style={{ margin: '0 0.25rem 1rem'}} primary disabled={hasAllowance} onPress={() => handleApprove()}>Approve</Button>
                      </div>
                    </div>
                    <div style={{
                      width:'30%',
                      flex: 1, 
                      justifyContent: 'center', 
                      display: 'flex'}}>
                      <div><Text><h3>GENERIC COIN</h3></Text></div>
                    </div>
                    <div style={{width:'30%', flex: 1, padding: '0 1rem',}}>
                      <div>
                        <Button style={{ margin: '0 0.25rem 1rem', height: '4rem'}} primary disabled={isSlotRolling || !active} onPress={() => rollEth()}>
                          <span style={{fontFamily: 'MS Sans Serif'}}>ETH SPIN {active ? (<span> {priceETH}</span>) : (<span></span>)}</span>
                        </Button>
                      </div>
                    </div>
                </div>

              
                {active && spinHistory ? (
                <List.Accordion
                title='Recent Spins'
                style={{margin: '1rem'}}
                >
                <div style={{
                      margin: '1rem auto 0',
                      display: 'flex',
                      flexWrap: 'wrap'
                    }}>
                    {spinHistory.map(item => {
                      return <div 
                                style={{
                                  padding: '0.1rem 0.2rem 0',
                                  margin: '0.4rem 0.3rem',
                                  textAlign: 'left',
                                  fontSize: '1rem',
                                  fontFamily: 'MS Sans Serif',
                                  whiteSpace: 'nowrap',
                                }}
                                key={item.round}>
                                  <Button disabled>Spin ID {item.round}: &nbsp; 
                                  {item.symbols[0]} | {item.symbols[1]} | {item.symbols[2]}</Button>
                             </div>;
                    })}
                </div>
                </List.Accordion>
              ) : (
                <></>
              )}
              
            </View>
          </Window>
        </View>

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
                disabled
                onPress={() => openLink('/socials')}
                title='Socials'
              />
              <Menu.Item
                size='lg'
                disabled
                onPress={() => openLink('/info')}
                title='Info'
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
                // disabled
                onPress={() => openLink('/staking')}
                title='Staking'
              />
              <Menu.Item
                size='lg'
                disabled
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
  '@keyframes scroll': {
    '0%': { transform: [{ translateY: 0 }] },
    '100%': { transform: [{ translateY: '-100%' }] },
  },
  responsiveLogo: {
    width:'30%',
    flex: 1, 
    justifyContent: 'center', 
    display: 'flex'
    
  },
  price: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
  },
  priceText: {
    fontSize: '.75rem',
  },
  historyItem: {
    border: '2px solid rgb(132, 133, 132)',
    padding: '0.1rem 0.2rem 0',
    margin: '0.3rem'
  },
  textCenter: {
    textAlign: 'center',
  },
  slotmachine: {

  },
  machine: {
    flexbox: 'inline-flex',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  reel: {

  },
  reelitem: {
    width: '8.5vw',
    height: '8.5vw',
    margin: '1.3vw',
  },
  reelimage: {
    width: '8.5vw',
    height: '8.5vw',
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
    paddingTop: '3vh',
    paddingBottom: '10vh',
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

export default withWalletConnect(AppScreen, {
  redirectUrl:
    Platform.OS === 'web' ? window.location.origin : 'yourappscheme://',
  storageOptions: {
    asyncStorage: AsyncStorage,
  },
});
