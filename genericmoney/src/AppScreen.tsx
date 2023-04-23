import React, { useState, useEffect } from 'react';
import useAnimation from './use-animation';
import {
  StyleSheet,
  View,
  Image,
  Linking,
  Platform,
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


import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { injected } from './supportedNetworks';
import slotContractABI from './assets/contracts/slotsABI.json';
import tokenABI from './assets/contracts/tokenABI.json';

import GenericLogo from './assets/images/gcp.png';
import SlotMachine from './assets/images/slots.png';
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
      }, 5000);
      fetchContractData();
      return () => clearInterval(id);
    } else {
      return null;
    }
  }, [active]);

  const fetchContractData = async () => {
    // if (!!slotContract) {
      try {
        let historyArray = [];
        let roundsplayed = await slotContract.methods
          .getRoundsPlayed(account)
          .call();
        console.warn('roundsplayed', roundsplayed)
        if (roundsplayed.length > 10) {
          roundsplayed = roundsplayed.slice(-30); 
        }

        let roundInfo;
        for(const round in roundsplayed){
          roundInfo = await slotContract.methods.roundInfo(roundsplayed[round]).call();
          historyArray.push({roundInfo});
        }

        setSpinHistory(historyArray.reverse());
        // console.warn('spinHistory', historyArray);
        
          
        const priceEth = await slotContract.methods.ethSpinPrice().call();
        const priceGEN = await slotContract.methods.tokenSpinPrice().call();
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
        if (allowance > 1000000000) {
          setHasAllowance(true);
        }
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
        const price = await slotContract.methods.ethSpinPrice().call();
        setPriceETH(web3.utils.fromWei(price));
        // Roll the slot machine
        await slotContract.methods
          .ethSpin()
          .send({ from: account, value: price });
        // Rolling state for the UI
        setIsSlotRolling(true);
        // Obtain the array of round IDs played by the connected wallet (so that we may acquire the latest)
        const roundsplayed = await slotContract.methods
          .getRoundsPlayed(account)
          .call();
        let resp = await slotContract.methods
          .roundInfo(roundsplayed[roundsplayed.length - 1])
          .call();
        // While Chainlink is processing the VRF, send a request every three seconds until it's fulfilled.
        while (resp[5] === false && resp['payout'] === '0') {
          await timer(3000);
          resp = await slotContract.methods
            .roundInfo(roundsplayed[roundsplayed.length - 1])
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
  



  // const handleApprove = async () => {
  //   if (!!tokenContract) {
  //     try {
  //       await tokenContract.methods
  //         .approve(
  //           slotContractAddy,
  //           '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  //         )
  //         .send({ from: account });
  //       setHasAllowance(true);
  //     } catch (ex) {
  //       return;
  //     }
  //   }
  // };

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
        const price = await slotContract.methods.tokenSpinPrice().call();
        setPriceGEN(web3.utils.fromWei(price));
        // Roll the slot machine
        await slotContract.methods.tokenSpin().send({ from: account });
        // Rolling state for the UI
        setIsSlotRolling(true);
        // Obtain the array of round IDs played by the connected wallet (so that we may acquire the latest)
        const roundsplayed = await slotContract.methods
          .getRoundsPlayed(account)
          .call();
        let resp = await slotContract.methods
          .roundInfo(roundsplayed[roundsplayed.length - 1])
          .call();
        // While Chainlink is processing the VRF, send a request every three seconds until it's fulfilled.
        while (resp[5] === false) {
          await timer(3000);
          resp = await slotContract.methods
            .roundInfo(roundsplayed[roundsplayed.length - 1])
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


  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <AppBar style={styles.header}>
          <View style={styles.price}>
            {showGenericPrice ? (
              <Text style={styles.priceText}>
                <sup>$</sup>
                <strong>{showGenericPrice}</strong>
                <br />
                <sup>
                  <i>per 1M</i>
                </sup>
              </Text>
            ) : (
              <Text style={styles.priceText}>
                price
                <br />
                loading...
              </Text>
            )}{' '}
          </View>
          <View style={styles.logo}>
            <Image style={styles.logoImage} source={GenericLogo} />
            <Text style={styles.heading} bold disabled>
              Generic Coin Slots Beta 0.8
            </Text>
          </View>
          {/* <Button
            square
            variant='raised'
            size='lg'
            style={styles.aboutButton}
            onPress={() => openLink('/')}
          >
            <Image
              style={styles.questionMark}
              source={{
                uri:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAFVBMVEUAAACAgID///8AAADAwMCAAAD/AADqeraFAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAHdElNRQflAQwXHQ1lXxPNAAAAqElEQVQoz5WOMQ6DMAxFLUXda3yCGLrTwAmC2CtV5QJVuf8RmmCCTaQOtX6Wp+cfA5aBfRpuJQdAkhyASPLToGGQ/FuKVWnTVaWB/R3xakoDUxcmU0rsw9T15lJV9m9VKZc2zLyBXNr6wAqyHwkV5NLRp1OMgRSZC5DSUYGMixUAUeaHKhuZ36q4IW0tH7OUtm7r+jTAxWU9GfA6CwC1AJdKSDt9BVx6XzBwJ8Kxeb3/AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAxLTEyVDIzOjI5OjEzKzAwOjAwyc9MIQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMS0xMlQyMzoyOToxMyswMDowMLiS9J0AAAAASUVORK5CYII=',
              }}
            />
          </Button> */}
        </AppBar>

        <Panel variant='raised' style={styles.panel}>
          <Panel variant='cutout' background='canvas' style={styles.cutout}>
            <ScrollView
              style={styles.scrollView}
              scrollViewProps={{
                contentContainerStyle: styles.content,
              }}
              alwaysShowScrollbars
            >

              <Panel variant='raised' style={[styles.zpanel]}>
                <ConnectMetamask />
                
                <img style={{marginTop: '1rem'}} src={SlotMachine} />
                <div style={{
                  position: 'absolute',
                  width: '98%',
                  textAlign: 'center',
                  paddingTop: '36.8%',
                  marginTop: '2.3rem',
                  zIndex: -1,
                }}>
                  {isRoundFetch === true ? (
                      <Text>
                        <p style={{
                          fontWeight: 'bold',
                          fontSize: 'clamp(1rem, 7rem, 11.5vw)',
                          padding: '0 2%',
                          margin: 0,
                        }}>
                          {roundInfo.['symbols'][0]} &nbsp; {roundInfo['symbols'][1]} &nbsp; {roundInfo['symbols'][2]}
                        </p>
                      </Text>
                  ) : (
                      <>
                        {isSlotRolling ? (
                          <div style={{textAlign: 'center'}}>...</div>
                        ) : (
                            <p></p>
                          )}
                      </>
                    )}
                </div>
                
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  top: '3.1rem',
                  paddingTop: '15.2%',
                  left: '21.5%',
                }}>
                  <Text>
                  {active ? (
                    <div style={{
                      textAlign: 'left', 
                      margin: '0 0.5rem',
                      color: '#ffffff',
                      fontSize: 'clamp(0.3rem, 1.23rem, 2vw)',
                    }}>
                      <span><b>Pot: </b> {prizePool}</span><br/>
                      {(active && tokenBalance) ? (<span>Your GEN Balance: { Math.round(Number(tokenBalance)).toLocaleString() }</span>) : (<></>)}<br/>
                      {(active && BNBBalance) ? (<span>Your ETH Balance: { Number(BNBBalance).toFixed(4).toLocaleString() }</span>) : (<></>)}  
                    </div>
                  ) : (
                    <></>
                  )}
                  </Text>
                </div>
                
                <div style={{
                  position: 'absolute',
                  width: '98%',
                  top: '2.9rem',
                  paddingTop: '74.6%',
                }}>
                  <Text>
                      {isRoundFetch === true ? (
                        <Text style={{
                          color: '#fff',
                          fontSize: 'clamp(0.3rem, 1.23rem, 2.2vw)',
                        }}>
                          <div style={{textAlign: 'center'}}><b>Payout: {Math.round(web3.utils.fromWei(roundInfo['payout'])).toLocaleString()}</b></div>
                        </Text>
                      ) : (
                      <>
                        {isSlotRolling ? (
                          <Text style={{
                            color: '#fff',
                          }}>
                            <div style={{textAlign: 'center'}}>Slot Machine Spinning...</div>
                          </Text>
                        ) : (
                            <p></p>
                          )}
                      </>
                    )}
                  </Text>
                </div>

                
                {/* <svg viewbox="0 0 400 400"> 
                  <defs>
                    <clipPath id="counter-clippath">
                      <rect x="50" y="0" width="320" height="72" />
                    </clipPath>
                  </defs>
                  <circle fill="#ccc" cx="200" cy="200" r="200" />
                  <circle
                    cx="200"
                    cy="200"
                    r="160"
                    transform="rotate(-90, 200, 200)"
                    stroke-dasharray="0, 1000"
                    stroke="#7cb342"
                    stroke-width="80"
                    data-fallback="edge"
                  >
                    <animate
                      attributeName="stroke-dasharray"
                      dur="1s"
                      to="300,1000"
                      fill="freeze"
                      begin="1s;op.end+1s"
                    />
                  </circle>
                  <circle cx="200" cy="200" r="160" fill="#fff" />
                  <g
                    class="counter-clippath"
                    clip-path="url(#counter-clippath)"
                    transform="translate(0, 165)"
                  >
                    <g class="move-svg-text">
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        dur="1s"
                        calcMode="discrete"
                        values="0 0; 0 -90; 0 -180; 0 -270; 0 -360; 0 -450; 0 -540"
                        fill="freeze"
                        begin="1s;op.end+1s"
                      />
                      <text
                        x="200"
                        y="70"
                        text-anchor="middle"
                        font-size="100"
                        fill="#3c4946"
                      >
                        1%
                      </text>
                      <text
                        x="200"
                        y="160"
                        text-anchor="middle"
                        font-size="100"
                        fill="#3c4946"
                      >
                        3%
                      </text>
                      <text
                        x="200"
                        y="250"
                        text-anchor="middle"
                        font-size="100"
                        fill="#3c4946"
                      >
                        5%
                      </text>
                      <text
                        x="200"
                        y="340"
                        text-anchor="middle"
                        font-size="100"
                        fill="#3c4946"
                      >
                        7%
                      </text>
                      <text
                        x="200"
                        y="430"
                        text-anchor="middle"
                        font-size="100"
                        fill="#3c4946"
                      >
                        9%
                      </text>
                      <text
                        x="200"
                        y="520"
                        text-anchor="middle"
                        font-size="100"
                        fill="#3c4946"
                      >
                        11%
                      </text>
                      <text
                        x="200"
                        y="610"
                        text-anchor="middle"
                        font-size="100"
                        fill="#3c4946"
                      >
                        13%
                      </text>
                    </g>
                  </g>
                </svg>*/}


                <div style={{
                      display: 'flex',
                      marginTop: '1rem',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                }}>
                    <div style={{ margin: '0 0.25rem'}}>
                      <Button primary disabled={isSlotRolling || !active} onPress={() => rollToken()}>
                        <span style={{fontFamily: 'MS Sans Serif'}}>Spin with GEN {active ? (<span>- {priceGEN}</span>) : (<span></span>)}</span>
                      </Button> 
                    </div>
                    <div style={{ margin: '0 0.25rem'}}>
                      <Button primary disabled={isSlotRolling || !active} onPress={() => rollEth()}>
                        <span style={{fontFamily: 'MS Sans Serif'}}>Spin with ETH {active ? (<span>- {priceETH}</span>) : (<span></span>)}</span>
                      </Button>
                    </div>
                  {/* <div style={{paddingRight: '2%', float: 'left'}}>
                    <p><b>Spin with GENv3:</b></p>
                    {hasAllowance ? (
                      <Button primary disabled={isSlotRolling || !active} onPress={() => rollToken()}>Spin</Button>
                      ) : (
                        // <Button primary disabled={!hasAllowance} onPress={() => handleApprove()}>Approve</Button>
                        <Button primary disabled={!hasAllowance} onPress={() => handleApprove()}>Approve</Button>
                      )
                    }
                  </div> */}
                </div>
                
 
              </Panel>
              
              {active && spinHistory ? (
                <List.Accordion
                title='Recent Spins'
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
                                key={item.roundInfo.round}>
                                  <Button disabled>Spin ID {item.roundInfo.round}: &nbsp; 
                                  {item.roundInfo.symbols[0]} | {item.roundInfo.symbols[1]} | {item.roundInfo.symbols[2]}</Button>
                             </div>;
                    })}
                </div>
                </List.Accordion>
              ) : (
                <></>
              )}


            </ScrollView>
          </Panel>
          <View style={[styles.statusBar]}>
            <Panel
              variant='well'
              style={[styles.statusBarItem, { flexGrow: 1, marginRight: 4 }]}
            ></Panel>
            <Panel variant='well' style={[styles.statusBarItem]}>
              {/* <Text>        
                  <a
                    href="mailto:admin@generic.money"
                    target="_blank"
                    rel="noreferrer"
                  >
                    admin@generic.money
                  </a>
                </Text> */}
            </Panel>
          </View>
        </Panel>
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
                onPress={() => openLink('/slots')}
                title='Slots'
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
