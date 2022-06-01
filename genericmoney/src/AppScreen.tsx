import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View,
  Image, 
  Linking, 
  Platform, 
  Animated,
  TouchableOpacity,
} from 'react-native';
import {
  Panel,
  AppBar,
  Button,
  List,
  Text,
  ScrollView,
  Anchor,
  Select,
  Fieldset,
} from 'react95-native';
import { AntDesign } from '@expo/vector-icons';
import GenericLogo from './assets/images/gcp.png';
import 'react-native-get-random-values';
import '@ethersproject/shims';
//import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useWalletConnect,
  withWalletConnect,
} from '@walletconnect/react-native-dapp';

import { useWeb3React } from "@web3-react/core"
import { injected } from "./supportedNetworks"
import Web3 from 'web3'
import slotContractABI from './assets/contracts/slotsABI.json'
import tokenABI from './assets/contracts/tokenABI.json'

const AppScreen = ({ navigation }) => {

  //Web3 implementation
  const web3 = new Web3(Web3.givenProvider);
  const { active, account, activate} = useWeb3React()
  //Load Slot Machine Interface
  const slotContractAddy = "0xF05FD4FdEcb26bAD729f05FE9267aEFb397Bb826";
  const slotContract = new web3.eth.Contract(slotContractABI, slotContractAddy);
  //Load GENv3 Interface
  const tokenContractAddy = "0xe541eC6E868E61c384d2d0B16b972443cc1D8996";
  const tokenContract = new web3.eth.Contract(tokenABI,tokenContractAddy)

  //React states for the dApp
  const [ priceETH, setPriceETH ] = useState("Loading...");
  const [ priceGEN, setPriceGEN ] = useState("Loading...");
  const [ pendingPrize, setPendingPrize ] = useState("Loading...");
  const [ prizePool, setPrizePool ] = useState("Loading...");
  const [ BNBBalance, setBNBBalance ] = useState("Loading...");
  const [ tokenBalance, setTokenBalance ] = useState("Loading...");
  const [ roundInfo, setRoundInfo ] = useState("");
  const [ hasAllowance, setHasAllowance] = useState(false);
  const [ isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [ isRoundFetch, setIsRoundFetch ] = useState(false);
  const [ isSlotRolling, setIsSlotRolling ] = useState(false);

  //Define timer for usage with Async requests
  const timer = ms => new Promise(res => setTimeout(res, ms))

  useEffect(() => {
    if (web3.givenProvider !== null) 
    {

    const id = setInterval(() => {
      fetchContractData(); 
    }, 5000);
  
    fetchContractData();
  
    return () => clearInterval(id);
  }
  }, [active]);
  

  async function connect() {
      await activate(injected)
      if (web3.givenProvider !== null) 
      {
        web3.eth.net.getId()
        .then(async function (result){
          if(result == 97)
          {
            //fetchContractData();
          }
          else
          {
            setIsWrongNetwork(true);
            addBSCNetwork();
          }
        })
      }
  }

  const addBSCNetwork = async () => {
    window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [{
    chainId: '0x61',
    chainName: 'Smart Chain - Testnet',
    nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com']
    }]
    })
    .then(() => {
      setIsWrongNetwork(false);
    })
    .catch((ex) => {
    }) 
}

  const fetchContractData = async () => {
    
    if(!!slotContract)
    {
      try{
        const priceEth = await slotContract.methods.ethSpinPrice().call();
        const priceGEN = await slotContract.methods.tokenSpinPrice().call();
        const allowance = await tokenContract.methods.allowance(account,slotContractAddy).call();
        const pendingPrizes = await slotContract.methods.pendingWinnings(account).call();
        const prizesPool = await slotContract.methods.prizePool().call();
        const balanceBNB = await web3.eth.getBalance(account);
        const balanceToken = await tokenContract.methods.balanceOf(account).call();
        if(allowance > 1000000000)
        {
          setHasAllowance(true)
        }
        setPriceETH(web3.utils.fromWei(priceEth)+" BNB");
        setPriceGEN(web3.utils.fromWei(priceGEN)+" GENv3");
        setPendingPrize(web3.utils.fromWei(pendingPrizes)+" GENv3");
        setPrizePool(web3.utils.fromWei(prizesPool)+" GENv3");
        setBNBBalance(web3.utils.fromWei(balanceBNB)+" BNB");
        setTokenBalance(web3.utils.fromWei(balanceToken)+" GENv3")
      }
      catch(ex){
      }
    }
  }



  const rollEth = async () => {
    if(!!slotContract)
    {
      try{
      //Obtain the roll price directly from the contract and update it in the case it gets modified at some point.
      const price = await slotContract.methods.ethSpinPrice().call();
      setPriceETH(web3.utils.fromWei(price)+" BNB");
      //Roll the slot machine
      await slotContract.methods.ethSpin().send({from:account, value:price});
      //Rolling state for the UI
      setIsSlotRolling(true);
      //Obtain the array of round IDs played by the connected wallet (so that we may acquire the latest)
      const roundsplayed = await slotContract.methods.getRoundsPlayed(account).call();
      let resp = await slotContract.methods.roundInfo(roundsplayed[roundsplayed.length -1]).call();
      //While Chainlink is processing the VRF, send a request every three seconds until it's fulfilled.
      while(resp[4] == false)
      {
        await timer(3000);
        resp = await slotContract.methods.roundInfo(roundsplayed[roundsplayed.length -1]).call();
      }
      
      //Finish the rolling state and display the results
      setRoundInfo(resp);
      setIsRoundFetch(true);
      setIsSlotRolling(false)
      
      }
      catch(ex){
      }
    }
  }

  const handleApprove = async () => {
    
    if(!!tokenContract)
    {
        try {
          await tokenContract.methods.approve(slotContractAddy,'115792089237316195423570985008687907853269984665640564039457584007913129639935').send({from:account});  
            setHasAllowance(true);
          
          
        }catch(ex){
          return;
        } 
    }
  }

  const handleClaim = async () => {
    
    if(!!slotContract)
    {
        try {
          await slotContract.methods.claimPrizes().send({from:account});  
          setPendingPrize("0");
        }catch(ex){
          console.log(ex);
          return;
        } 
    }
  }

  const rollToken = async () => {
    if(!!slotContract)
    {
      try{
      //Obtain the roll price directly from the contract and update it in the case it gets modified at some point.
      const price = await slotContract.methods.tokenSpinPrice().call();
      setPriceGEN(web3.utils.fromWei(price)+" GENv3");
      //Roll the slot machine
      await slotContract.methods.tokenSpin().send({from:account});
      //Rolling state for the UI
      setIsSlotRolling(true);
      //Obtain the array of round IDs played by the connected wallet (so that we may acquire the latest)
      const roundsplayed = await slotContract.methods.getRoundsPlayed(account).call();
      let resp = await slotContract.methods.roundInfo(roundsplayed[roundsplayed.length -1]).call();
      //While Chainlink is processing the VRF, send a request every three seconds until it's fulfilled.
      while(resp[4] == false)
      {
        await timer(3000);
        resp = await slotContract.methods.roundInfo(roundsplayed[roundsplayed.length -1]).call();
      }
      
      //Finish the rolling state and display the results
      setRoundInfo(resp);
      setIsRoundFetch(true);
      setIsSlotRolling(false)
      
      }
      catch(ex){
      }
    }
  }

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.warn("Couldn't load page", err));
  };

  const displayWC = () => {
    const connector = useWalletConnect();
    if (!connector.connected) {
      /**
       *  Connect! 🎉
       */
      return (
        <Button primary onPress={() => connector.connect()}>
          Use WalletConnect
        </Button>
      );
    }
    return (
      <Button primary onPress={() => connector.killSession()}>
        Disconnect WalletConnect
      </Button>
    );
  };
  
  const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign);
  const DURATION = 1000;
  const TEXT_DURATION = DURATION * 0.8;

const quotes = [
    {
      quote:
        'For the things we have to learn before we can do them, we learn by doing them.',
      author: 'Aristotle, The Nicomachean Ethics',
    },
    {
      quote: 'The fastest way to build an app.',
      author: 'The Expo Team',
    },
    {
      quote:
        'The greatest glory in living lies not in never falling, but in rising every time we fall.',
      author: 'Nelson Mandela',
    },
    {
      quote: 'The way to get started is to quit talking and begin doing.',
      author: 'Walt Disney',
    },
    {
      quote:
        "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking.",
      author: 'Steve Jobs',
    },
    {
      quote:
        'If life were predictable it would cease to be life, and be without flavor.',
      author: 'Eleanor Roosevelt',
    },
    {
      quote:
        "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
      author: 'Oprah Winfrey',
    },
    {
      quote:
        "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
      author: 'James Cameron',
    },
    {
      quote: "Life is what happens when you're busy making other plans.",
      author: 'John Lennon',
    },
  ];
  
  const onPress = () => {
    animatedValue.setValue(0);
    animatedValue2.setValue(0);
    animate((index + 1) % colors.length).start();
    setIndex((index + 1) % colors.length);
  };
  
  const animate = (i) =>
  Animated.parallel([
    Animated.timing(sliderAnimatedValue, {
      toValue: i,
      duration: TEXT_DURATION,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: DURATION,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue2, {
      toValue: 1,
      duration: DURATION,
      useNativeDriver: false,
    }),
  ]);

const colors = [
    {
      initialBgColor: 'goldenrod',
      bgColor: '#222',
      nextBgColor: '#222',
    },
    {
      initialBgColor: 'goldenrod',
      bgColor: '#222',
      nextBgColor: 'yellowgreen',
    },
    {
      initialBgColor: '#222',
      bgColor: 'yellowgreen',
      nextBgColor: 'midnightblue',
    },
    {
      initialBgColor: 'yellowgreen',
      bgColor: 'midnightblue',
      nextBgColor: 'turquoise',
    },
    {
      initialBgColor: 'midnightblue',
      bgColor: 'turquoise',
      nextBgColor: 'goldenrod',
    },
    {
      initialBgColor: 'turquoise',
      bgColor: 'goldenrod',
      nextBgColor: '#222',
    },
  ];

  /*const connectToMM = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
<<<<<<< HEAD
  };*/
  
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const animatedValue2 = React.useRef(new Animated.Value(0)).current;
  const sliderAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRange = [...Array(quotes.length).keys()];
  const [index, setIndex] = React.useState(0);
  
const Circle = ({ onPress, index, quotes, animatedValue, animatedValue2 }) => {
    const { initialBgColor, nextBgColor, bgColor } = colors[index];
    const inputRange = [0, 0.001, 0.5, 0.501, 1];
    const backgroundColor = animatedValue2.interpolate({
      inputRange,
      outputRange: [
        initialBgColor,
        initialBgColor,
        initialBgColor,
        bgColor,
        bgColor,
      ],
    });
    const dotBgColor = animatedValue2.interpolate({
      inputRange: [0, 0.001, 0.5, 0.501, 0.9, 1],
      outputRange: [
        bgColor,
        bgColor,
        bgColor,
        initialBgColor,
        initialBgColor,
        nextBgColor,
      ],
    });
  
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          styles.container,
          { backgroundColor },
        ]}
      >
        <Animated.View
          style={[
            styles.circle,
            {
              backgroundColor: dotBgColor,
              transform: [
                { perspective: 200 },
                {
                  rotateY: animatedValue2.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: ['0deg', '-90deg', '-180deg'],
                  }),
                },
  
                {
                  scale: animatedValue2.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 6, 1],
                  }),
                },
  
                {
                  translateX: animatedValue2.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: ['0%', '50%', '0%'],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity onPress={onPress}>
            <Animated.View
              style={[
                styles.button,
                {
                  transform: [
                    {
                      scale: animatedValue.interpolate({
                        inputRange: [0, 0.05, 0.5, 1],
                        outputRange: [1, 0, 0, 1],
                        // extrapolate: "clamp"
                      }),
                    },
                    {
                      rotateY: animatedValue.interpolate({
                        inputRange: [0, 0.5, 0.9, 1],
                        outputRange: ['0deg', '180deg', '180deg', '180deg'],
                      }),
                    },
                  ],
                  opacity: animatedValue.interpolate({
                    inputRange: [0, 0.05, 0.9, 1],
                    outputRange: [1, 0, 0, 1],
                  }),
                },
              ]}
            >
              <AnimatedAntDesign name='arrowright' size={28} color={'white'} />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <AppBar style={styles.header}>
          <View style={styles.logo}>
            <Image style={styles.logoImage} source={GenericLogo} />
            <Text style={styles.heading} bold disabled>
              Generic Coin App
            </Text>
          </View>
          <Button
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
          </Button>
        </AppBar>
        {/* <ScrollPanel style={styles.scrollPanel}>
            {themes.map(theme => (
              <ThemeButton
                theme={theme}
                currentTheme={currentTheme}
                selected={theme.name === currentTheme.name}
                onPress={() => setThemeProp(theme)}
                key={theme.name}
              />
            ))}
          </ScrollPanel> */}
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
                <Text
                  bold
                  style={{
                    fontSize: 22,
                    margin: 12,
                    marginBottom: 24,
                  }}
                >
                  Calls
                </Text>
                <Text style={styles.textIndent}>
                  <div>
                    
                    {active ? 
                    <>
                      <p><b>Roll with BNB:</b></p>
                      {isSlotRolling ?
                        <>
                          {/*Remove the ability to roll again from the frontend while waiting for the results of the current roll*/}
                          <Button  primary>
                            <span style={{color:"#8c8c8c"}}>Roll</span>
                          </Button>
                        </>
                        :
                          <Button primary onPress={() => rollEth()}>
                            Roll
                          </Button>
                      }
                      
                      <p>Price: {priceETH}</p>
                      <p>Your BNB Balance: {BNBBalance}</p>

                      <p><b>Roll with GENv3:</b></p>
                      {hasAllowance ?
                        <>
                          {isSlotRolling ?
                            <>
                              {/*Remove the ability to roll again from the frontend while waiting for the results of the current roll*/}
                              <Button  primary>
                                <span style={{color:"#8c8c8c"}}>Roll</span>
                              </Button>
                            </>
                            :
                              <Button primary onPress={() => rollToken()}>
                                Roll
                              </Button>
                          }
                        </>
                        :
                        <>
                          <Button primary onPress={() => handleApprove()}>
                            Approve
                          </Button>
                        </>
                      }
                          
                      <p>Price: {priceGEN}</p>
                      <p>Your GENv3 Balance: {tokenBalance}</p>
                      {isRoundFetch ? 
                      <Panel >
                      <Text >
                        <b>Round results:</b>
                        <p>
                          First Symbol: {roundInfo["symbols"][0]}
                        </p>
                        <p>
                          Second Symbol: {roundInfo["symbols"][1]}
                        </p>
                        <p>
                          Third Symbol: {roundInfo["symbols"][2]}
                        </p>
                        <p>
                          <b>Payout: {roundInfo["payout"]}</b>
                        </p>
                      </Text>
                    </Panel>
                    :
                    <>
                    {isSlotRolling ? 
                    <>
                      Slot machine rolling...
                    </>
                    :
                    <></>
                    }
                  </>
                  }
                    <p><b>Prize Pool: </b> {prizePool}</p>
                    <p><b>Unclaimed Prizes:</b> {pendingPrize}</p>
                    {(Number(pendingPrize) > 0) ?
                    <>
                      <Button primary onPress={() => handleClaim()}>
                        Claim Prizes
                      </Button>
                    </>
                    :
                    <Button primary>
                      <span style={{color:"#8c8c8c"}}>Claim Prizes</span>
                    </Button>
                    

                    }
                    
                    </>
                    :
                    <>
                    <Button primary onPress={() => connect()}>
                      Use MetaMask
                    </Button>
                    {isWrongNetwork ?
                      <p>
                        Wrong Network! Please switch to Binance Smart Chain.
                      </p>
                      :
                      <></>
                    }
                    
                    </>
                    }
                    
                    
                    {/*displayWC()*/}

                    {/* {ViewClaimable()} */}
                    {/* {ViewLockDuration()}
                    {ViewClaimTime()}
                    {ViewUserStaked()}
                    {ViewTokensToLock}
                    {ViewHoldersLength}
                    {ViewTokenBalance}
                    {ViewUserTimeLeft}
                    {CheckHolderAddress(uint256 i)}
                    {SetLockDuration(uint256 secs)}
                    {WithdrawTokens(uint256 amount)}
                    {UserStakeTokens}
                    {UserClaimTokens} */}
                    <br />
                    <br />
                  </div>
                </Text>
              </Panel>
              <Panel variant='raised' style={[styles.zpanel]}>
                <Text
                  bold
                  style={{
                    fontSize: 22,
                    margin: 12,
                    marginBottom: 24,
                  }}
                >
                  Animation Testing
                </Text>
                
                <Animated.View
                  style={[
                    StyleSheet.absoluteFillObject,
                    styles.container,
                    {  },
                  ]}
                >
                <Circle
                  index={index}
                  onPress={onPress}
                  quotes={quotes}
                  animatedValue={animatedValue}
                  animatedValue2={animatedValue2}
                />
                  <Text style={styles.textIndent}>
                    <View>
                      <View style={styles.machine}>
                        <View style={styles.reel}>
                          <View style={styles.reelitem}>1</View>
                          <View style={styles.reelitem}>2</View>
                          <View style={styles.reelitem}>3</View>
                          <View style={styles.reelitem}>4</View>
                          <View style={styles.reelitem}>5</View>
                        </View>
                        <View style={styles.reel}>
                          <View style={styles.reelitem}>1</View>
                          <View style={styles.reelitem}>2</View>
                          <View style={styles.reelitem}>3</View>
                          <View style={styles.reelitem}>4</View>
                          <View style={styles.reelitem}>5</View>
                        </View>
                        <View style={styles.reel}>
                          <View style={styles.reelitem}>1</View>
                          <View style={styles.reelitem}>2</View>
                          <View style={styles.reelitem}>3</View>
                          <View style={styles.reelitem}>4</View>
                          <View style={styles.reelitem}>5</View>
                        </View>
                      </View>
                    </View>
                  </Text>
                </Animated.View>

              </Panel>
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
                    href="mailto:genericcoin@outlook.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    genericcoin@outlook.com
                  </a>
                </Text> */}
            </Panel>
          </View>
        </Panel>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  machine: {
    
  },
  reel: {
    
  },
  reelitem: {
    
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
    paddingBottom: 384,
    marginBottom: 18,
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

{
  /* export default AppScreen; */
}
export default withWalletConnect(AppScreen, {
  redirectUrl:
    Platform.OS === 'web' ? window.location.origin : 'yourappscheme://',
  storageOptions: {
    asyncStorage: AsyncStorage,
  },
});
