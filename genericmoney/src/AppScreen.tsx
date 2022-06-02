import React from 'react';
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
import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useWalletConnect,
  withWalletConnect,
} from '@walletconnect/react-native-dapp';

const AppScreen = () => {
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

  const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign);
  const DURATION = 500;
  const TEXT_DURATION = DURATION * 0.8;

  const onPress = () => {
    animatedValue.setValue(0);
    animatedValue2.setValue(0);
    animate((index + 1) % colors.length).start();
    setIndex((index + 1) % colors.length);
  };

  const animate = i =>
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

  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const animatedValue2 = React.useRef(new Animated.Value(0)).current;
  const sliderAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const [index, setIndex] = React.useState(0);

  const Circle = ({ onPress, index, animatedValue, animatedValue2 }) => {
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
                    <Button primary onPress={() => connectToMM()}>
                      Use MetaMask
                    </Button>
                    <br />
                    <br />
                    {displayWC()}

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
                  style={[StyleSheet.absoluteFillObject, styles.container, {}]}
                >
                  <Circle
                    index={index}
                    onPress={onPress}
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
  machine: {},
  reel: {},
  reelitem: {},
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
    paddingBottom: 128,
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

export default withWalletConnect(AppScreen, {
  redirectUrl:
    Platform.OS === 'web' ? window.location.origin : 'yourappscheme://',
  storageOptions: {
    asyncStorage: AsyncStorage,
  },
});
