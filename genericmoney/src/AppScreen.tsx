import React, { useState, useEffect } from 'react';
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
  // List,
  Text,
  ScrollView,
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

const AppScreen = () => {
  const visibility = false;
  // Web3 implementation
  const web3 = new Web3(Web3.givenProvider);
  const { active, account, activate } = useWeb3React();
  // Load Slot Machine Interface
  const slotContractAddy = '0xF05FD4FdEcb26bAD729f05FE9267aEFb397Bb826';
  const slotContract = new web3.eth.Contract(slotContractABI, slotContractAddy);
  // Load GENv3 Interface
  const tokenContractAddy = '0xe541eC6E868E61c384d2d0B16b972443cc1D8996';
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

  // Define timer for usage with Async requests
  const timer = ms => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    if (web3.givenProvider !== null) {
      const id = setInterval(() => {
        fetchContractData();
      }, 5000);

      fetchContractData();

      return () => clearInterval(id);
    }
  }, [active]);

  async function connect() {
    await activate(injected);
    if (web3.givenProvider !== null) {
      web3.eth.net.getId().then(async function(result) {
        if (result === 97) {
          // fetchContractData();
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
    if (!!slotContract) {
      try {
        const priceEth = await slotContract.methods.ethSpinPrice().call();
        const priceGEN = await slotContract.methods.tokenSpinPrice().call();
        const allowance = await tokenContract.methods
          .allowance(account, slotContractAddy)
          .call();
        const pendingPrizes = await slotContract.methods
          .pendingWinnings(account)
          .call();
        const prizesPool = await slotContract.methods.prizePool().call();
        const balanceBNB = await web3.eth.getBalance(account);
        const balanceToken = await tokenContract.methods
          .balanceOf(account)
          .call();
        if (allowance > 1000000000) {
          setHasAllowance(true);
        }
        setPriceETH(web3.utils.fromWei(priceEth) + ' BNB');
        setPriceGEN(web3.utils.fromWei(priceGEN) + ' GENv3');
        setPendingPrize(web3.utils.fromWei(pendingPrizes) + ' GENv3');
        setPrizePool(web3.utils.fromWei(prizesPool) + ' GENv3');
        setBNBBalance(web3.utils.fromWei(balanceBNB) + ' BNB');
        setTokenBalance(web3.utils.fromWei(balanceToken) + ' GENv3');
      } catch (ex) { }
    }
  };

  const rollEth = async () => {
    setIsRoundFetch(false);
    if (!!slotContract) {
      try {
        // Obtain the roll price directly from the contract and update it in the case it gets modified at some point.
        const price = await slotContract.methods.ethSpinPrice().call();
        setPriceETH(web3.utils.fromWei(price) + ' BNB');
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
        while (resp[4] === false) {
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

  const handleClaim = async () => {
    if (!!slotContract) {
      try {
        await slotContract.methods.claimPrizes().send({ from: account });
        setPendingPrize('0');
      } catch (ex) {
        console.log(ex);
        return;
      }
    }
  };

  const rollToken = async () => {
    setIsRoundFetch(false);
    if (!!slotContract) {
      try {
        // Obtain the roll price directly from the contract and update it in the case it gets modified at some point.
        const price = await slotContract.methods.tokenSpinPrice().call();
        setPriceGEN(web3.utils.fromWei(price) + ' GENv3');
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
        while (resp[4] === false) {
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
  const connectToMM = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
  };

  /*const connectToMM = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
  };*/


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

        <Panel variant='raised' style={styles.panel}>
          <Panel variant='cutout' background='canvas' style={styles.cutout}>
            <ScrollView
              style={styles.scrollView}
              scrollViewProps={{
                contentContainerStyle: styles.content,
              }}
              alwaysShowScrollbars
            >

              {visibility ? (
                <Panel variant='raised' style={[styles.slotpanel]}>
                  <Image style={styles.slotmachine} source={SlotMachine} />
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
                </svg> */}
                </Panel>
              ) : (
                <p></p>
              )}



              <Panel variant='raised' style={[styles.zpanel]}>
                <div style={{width: '100%', display: 'flex'}}>
                  <div style={{float: 'left', margin: '.75rem 0'}}>
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
                  <div style={{float: 'right', right: '0.7rem', position: 'absolute',}}>
                    <Button primary onPress={() => connect()}>Use MetaMask</Button>
                    {isWrongNetwork ? (
                      <p>Wrong Network! Please switch to Binance Smart Chain.</p>
                    ) : (<></>)}
                  </div>
                </div>
                
                <Text style={styles.textIndent}>
                  <div>
                    
                    <div style={{width: '100%', display: 'flex'}}>
                      <div style={{paddingRight: '2%', float: 'left'}}>
                        <p><b>Roll with BNB:</b></p>
                        <Button primary disabled={isSlotRolling || !active} onPress={() => rollEth()}>Roll</Button>
                        {priceETH ? (<p></p>) : (<p>Price: {priceETH}</p>)}
                        {BNBBalance ? (<p></p>) : (<p>Your BNB Balance: {BNBBalance}</p>)}
                      </div>
                      <div style={{paddingRight: '2%', float: 'left'}}>
                        <p><b>Roll with GENv3:</b></p>
                        {hasAllowance ? (
                          <Button primary disabled={isSlotRolling || !active} onPress={() => rollToken()}>Roll</Button>
                          ) : (
                            // <Button primary disabled={!hasAllowance} onPress={() => handleApprove()}>Approve</Button>
                            <Button primary disabled={!hasAllowance} onPress={() => handleApprove()}>Approve</Button>
                          )
                        }
                      </div>
                    </div>

                    <div style={{width: '100%'}}>
                      {priceGEN ? (<p></p>) : (<p>Price: {priceGEN}</p>)}
                      
                      {tokenBalance ? (<p></p>) : (<p>Your GENv3 Balance: {tokenBalance}</p>)}
                      
                      {isRoundFetch === true ? (
                          <Text>
                            <b>Round results:</b>
                            <p
                            bold
                            style={{
                              fontSize: 26,
                            }}>{roundInfo.['symbols'][0]} | {roundInfo['symbols'][1]} | {roundInfo['symbols'][2]}</p>
                            <p>
                              <b>Payout: {roundInfo['payout']}</b>
                            </p>
                          </Text>
                      ) : (
                          <>
                            {isSlotRolling ? (
                              <p>Slot machine rolling...</p>
                            ) : (
                                <p></p>
                              )}
                          </>
                        )}
                      <p>
                        {prizePool ? (<p></p>) : (<p><b>Prize Pool: </b> {prizePool}</p>)}
                      </p>
                      <p>
                        {pendingPrize ? (<p></p>) : (<p><b>Unclaimed Prizes:</b> {pendingPrize}</p>)}
                      </p>
                      <Button primary disabled={!Boolean(Number(pendingPrize) > 0)}>Claim Prizes</Button>
                    </div>


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
    </View>
  );
};

const styles = StyleSheet.create({
  slotmachine: {
    flex: 1,
    padding: 8,
    marginTop: -4,
    paddingTop: 12,
    paddingBottom: 100,
    marginBottom: 18,
    minHeight: '76.6vw',
    // width: '100%',
    height: '34rem',
    maxHeight: '76vw',
    position: 'absolute',
    // padding: 0,
    maxWidth: '97%',
    margin: 'auto',
    left: 0,
    right: 0,
    // top: '1.2vw',
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  machine: {
    flexbox: 'inline-flex',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  reel: {
    zIndex: -1,
    position: 'relative',
    top: '-24.5vw',
    margin: 'auto',
    bottom: 0,
    left: '-.6vw',
    right: 0,
    padding: '32wv',
    overflow: 'hidden',
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

export default withWalletConnect(AppScreen, {
  redirectUrl:
    Platform.OS === 'web' ? window.location.origin : 'yourappscheme://',
  storageOptions: {
    asyncStorage: AsyncStorage,
  },
});
