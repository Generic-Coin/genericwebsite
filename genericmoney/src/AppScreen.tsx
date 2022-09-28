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
import ReelMetaMask from './assets/images/slots.png';
import Reel from './assets/images/slots.png';

const AppScreen = () => {
  //Web3 implementation
  const web3 = new Web3(Web3.givenProvider);
  const { active, account, activate } = useWeb3React();
  //Load Slot Machine Interface
  const slotContractAddy = '0xF05FD4FdEcb26bAD729f05FE9267aEFb397Bb826';
  const slotContract = new web3.eth.Contract(slotContractABI, slotContractAddy);
  //Load GENv3 Interface
  const tokenContractAddy = '0xe541eC6E868E61c384d2d0B16b972443cc1D8996';
  const tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddy);

  //React states for the dApp
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

  //Define timer for usage with Async requests
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
      web3.eth.net.getId().then(async function (result) {
        if (result == 97) {
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
      .catch(ex => {});
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
      } catch (ex) {}
    }
  };

  const rollEth = async () => {
    if (!!slotContract) {
      try {
        //Obtain the roll price directly from the contract and update it in the case it gets modified at some point.
        const price = await slotContract.methods.ethSpinPrice().call();
        setPriceETH(web3.utils.fromWei(price) + ' BNB');
        //Roll the slot machine
        await slotContract.methods
          .ethSpin()
          .send({ from: account, value: price });
        //Rolling state for the UI
        setIsSlotRolling(true);
        //Obtain the array of round IDs played by the connected wallet (so that we may acquire the latest)
        const roundsplayed = await slotContract.methods
          .getRoundsPlayed(account)
          .call();
        let resp = await slotContract.methods
          .roundInfo(roundsplayed[roundsplayed.length - 1])
          .call();
        //While Chainlink is processing the VRF, send a request every three seconds until it's fulfilled.
        while (resp[4] == false) {
          await timer(3000);
          resp = await slotContract.methods
            .roundInfo(roundsplayed[roundsplayed.length - 1])
            .call();
        }

        //Finish the rolling state and display the results
        setRoundInfo(resp);
        setIsRoundFetch(true);
        setIsSlotRolling(false);
      } catch (ex) {}
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
    if (!!slotContract) {
      try {
        //Obtain the roll price directly from the contract and update it in the case it gets modified at some point.
        const price = await slotContract.methods.tokenSpinPrice().call();
        setPriceGEN(web3.utils.fromWei(price) + ' GENv3');
        //Roll the slot machine
        await slotContract.methods.tokenSpin().send({ from: account });
        //Rolling state for the UI
        setIsSlotRolling(true);
        //Obtain the array of round IDs played by the connected wallet (so that we may acquire the latest)
        const roundsplayed = await slotContract.methods
          .getRoundsPlayed(account)
          .call();
        let resp = await slotContract.methods
          .roundInfo(roundsplayed[roundsplayed.length - 1])
          .call();
        //While Chainlink is processing the VRF, send a request every three seconds until it's fulfilled.
        while (resp[4] == false) {
          await timer(3000);
          resp = await slotContract.methods
            .roundInfo(roundsplayed[roundsplayed.length - 1])
            .call();
        }

        //Finish the rolling state and display the results
        setRoundInfo(resp);
        setIsRoundFetch(true);
        setIsSlotRolling(false);
      } catch (ex) {}
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
                    {active ? (
                      <>
                        <p>
                          <b>Roll with BNB:</b>
                        </p>
                        {isSlotRolling ? (
                          <>
                            {/*Remove the ability to roll again from the frontend while waiting for the results of the current roll*/}
                            <Button primary>
                              <span style={{ color: '#8c8c8c' }}>Roll</span>
                            </Button>
                          </>
                        ) : (
                          <Button primary onPress={() => rollEth()}>
                            Roll
                          </Button>
                        )}

                        <p>Price: {priceETH}</p>
                        <p>Your BNB Balance: {BNBBalance}</p>

                        <p>
                          <b>Roll with GENv3:</b>
                        </p>
                        {hasAllowance ? (
                          <>
                            {isSlotRolling ? (
                              <>
                                {/*Remove the ability to roll again from the frontend while waiting for the results of the current roll*/}
                                <Button primary>
                                  <span style={{ color: '#8c8c8c' }}>Roll</span>
                                </Button>
                              </>
                            ) : (
                              <Button primary onPress={() => rollToken()}>
                                Roll
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            <Button primary onPress={() => handleApprove()}>
                              Approve
                            </Button>
                          </>
                        )}

                        <p>Price: {priceGEN}</p>
                        <p>Your GENv3 Balance: {tokenBalance}</p>
                        {isRoundFetch ? (
                          <Panel>
                            <Text>
                              <b>Round results:</b>
                              <p>First Symbol: {roundInfo['symbols'][0]}</p>
                              <p>Second Symbol: {roundInfo['symbols'][1]}</p>
                              <p>Third Symbol: {roundInfo['symbols'][2]}</p>
                              <p>
                                <b>Payout: {roundInfo['payout']}</b>
                              </p>
                            </Text>
                          </Panel>
                        ) : (
                          <>
                            {isSlotRolling ? (
                              <>Slot machine rolling...</>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                        <p>
                          <b>Prize Pool: </b> {prizePool}
                        </p>
                        <p>
                          <b>Unclaimed Prizes:</b> {pendingPrize}
                        </p>
                        {Number(pendingPrize) > 0 ? (
                          <>
                            <Button primary onPress={() => handleClaim()}>
                              Claim Prizes
                            </Button>
                          </>
                        ) : (
                          <Button primary>
                            <span style={{ color: '#8c8c8c' }}>
                              Claim Prizes
                            </span>
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button primary onPress={() => connect()}>
                          Use MetaMask
                        </Button>
                        {isWrongNetwork ? (
                          <p>
                            Wrong Network! Please switch to Binance Smart Chain.
                          </p>
                        ) : (
                          <></>
                        )}
                      </>
                    )}

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

              <Panel variant='raised' style={[styles.slotpanel]}>

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
    width: '100%',
    height: '74vw',
    position: 'relative',
    padding: 0,
    maxWidth: '97%',
    margin: 'auto',
    left: 0,
    right: 0,
    top: '1.2vw',
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
