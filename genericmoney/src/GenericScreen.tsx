import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Linking,
  ImageBackground,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import {
  Panel,
  AppBar,
  Button,
  List,
  Text,
  ScrollView,
  Divider,
  Window,
  Anchor,
  Select,
  Fieldset,
  Menu,
  Title,
} from 'react95-native';
import GenericLogo from './assets/images/gcp.png';
import GenericSizzle from './assets/genericday.mp4';
import GenericWhitepaper from './assets/generic-whitepaper.pdf';
import Roadmap from './assets/images/roadmap.png';
import James from './assets/images/james.png';
import ComingSoon from './assets/images/comingsoon.png';
import BlockSpot from './assets/images/bs.png';
import CoinPaprika from './assets/images/cp.png';
import EmailIcon from './assets/images/em.png';
import TelegramIcon from './assets/images/te.png';
import TwitterIcon from './assets/images/tw.png';
import MediumIcon from './assets/images/me.png';
import YouTubeIcon from './assets/images/yt.png';
import GitHubIcon from './assets/images/gh.png';
import CoinWatchIcon from './assets/images/cw.png';
import TokenPieIcon from './assets/images/tp.png';
import ApeSwapIcon from './assets/images/as.png';
import PancakeSwapIcon from './assets/images/ps.png';
import CoinCheckupIcon from './assets/images/cc.png';

import { notificationService } from './util/notifications';

const GenericScreen = () => {
  useEffect(() => {
    getPrices();
  }, []);

  const [verticalMenuOpen, setVerticalMenuOpen] = React.useState(false);

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

  const [showAboutModal, setShowAboutModal] = useState(false);
  const openLink = (url: string) => {
    // Linking.openURL(url).catch(err => console.warn("Couldn't load page", err));
    Linking.openURL(url).catch(err => console.warn("Couldn't load page", err));
  };

  const [memberImage, setMemberImage] = useState({ uri: James });
  const renderMemberImage = () => {
    return (
      <ImageBackground source={memberImage} resizeMode='cover'>
        <div style={{ width: 190, height: 180 }}>&nbsp;</div>
      </ImageBackground>
    );
  };

  const [memberTitle, setMemberTitle] = useState('Generic CEO');
  const renderMemberTitle = () => {
    if (memberTitle) {
      return (
        <Text>
          {memberTitle}
          <br />
        </Text>
      );
    } else return null;
  };


  
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  return (
    <View style={styles.background}>
      <View style={styles.container}>
      <>
            <AppBar style={styles.header}>
              <View style={styles.logo}>
                <Image style={styles.logoImage} source={GenericLogo} />
                <Text style={styles.heading} bold disabled>
                  Generic Coin
                </Text>
              </View>
            </AppBar>
            <Panel variant='raised' style={styles.panel}>
              <Panel variant='cutout' background='canvas' style={styles.cutout}>
                <ScrollView
                  style={styles.scrollView}
                  scrollViewProps={{
                    contentContainerStyle: styles.content,
                  }}
                >
                  <div style={{  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{flex: 1, margin:'.5rem', minWidth:'10rem'}}>
                      <a href='https://app.uniswap.org/#/swap?outputCurrency=0x884e1db2bde9023203aa900a5f35b87bbab001b9&chain=arbitrum'
                          target='_blank'
                          rel='noreferrer'
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            primary
                          >
                            Buy Generic Coin
                          </Button>
                        </a>
                    </div>
                    <div style={{flex: 1, margin:'.5rem', minWidth:'10rem'}}>
                        <Button
                            onPress={() => openLink(GenericWhitepaper)}
                            primary
                          >
                            View Whitepaper
                        </Button>
                    </div>
                    <div style={{flex: 1, margin:'.5rem', minWidth:'10rem'}}>
                      <a href='https://arbiscan.io/address/0x884e1dB2Bde9023203Aa900A5f35B87BbAb001B9'
                          target='_blank'
                          rel='noreferrer'
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            primary
                          >
                            View Contract
                          </Button>
                        </a>
                    </div>
                  </div>

                  <div style={{
                    color: '#fff',
                    background: '#000',
                    border: '.5rem solid #6a6a6a',
                    padding: '.5rem',
                    marginBottom: '1rem',
                  }}>
                    <Video
                      style={styles.video}
                      source={GenericSizzle}
                      useNativeControls
                      isLooping
                      resizeMode={ResizeMode.CONTAIN}
                      onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                  </div>


                  {/* <List.Accordion
                    title='Contract'
                    style={styles.section}
                    defaultExpanded
                  >
                    <Text style={styles.centered}>
                      <a
                        href='https://arbiscan.io/address/0x98a61ca1504b92ae768ef20b85aa97030b7a1edf'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <br />
                        <marquee width='100%' direction='left' height='30px'>
                          0x98a61ca1504b92ae768ef20b85aa97030b7a1edf
                        </marquee>
                      </a>
                      <br />
                      <div style={{  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}>
                        <a
`                          href='https://arbiscan.io/address/0x884e1dB2Bde9023203Aa900A5f35B87BbAb001B9'
                          target='_blank'
                          rel='noreferrer'
                          style={{ textDecoration: 'none' }}`
                        >
                          <Button
                            primary
                          >
                            View on ArbiScan
                          </Button>
                        </a>
                      </div>

                      <br />
                      <br />
                    </Text>
                  </List.Accordion> */}

                  {/* <Button>
                    <a
                      href={GenericWhitepaper}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <p>View Whitepaper</p>
                    </a><br/>
                  </Button> */}
                  
                  <div style={{
                    color: '#fff',
                    background: '#000',
                    border: '.5rem solid #6a6a6a',
                    padding: '.5rem',
                    marginBottom: '2rem',
                    textAlign: 'center',
                  }}>
                    <Text><h3 style={{color:'white'}}>ROADMAP</h3></Text>
                    <div style={{padding:'0 1rem', margin:'auto 0', width:'auto', background:'#008080'}}>
                      <img style={{width:'100%'}} src={Roadmap} />
                    </div>
                  </div>
                  
                  {/* <List.Accordion title='Tokenomics' style={styles.section}>
                    <table border='2'>
                      <thead>
                        <tr>
                          <td>
                            <Text>Buy</Text>
                          </td>
                          <td>
                            <Text>Sell</Text>
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <Text>1% Team/Marketing Tax</Text>
                          </td>
                          <td>
                            <Text>
                              1% Team/Marketing Tax
                              <br />
                              4% Locked LP Tax
                            </Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table border='2'>
                      <thead>
                        <tr>
                          <td>
                            <Text>1,000,000,000,000 Total Supply</Text>
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <Text>
                              <a
                                href='https://dxsale.app/app/v3_3/dxlockview?id=0&add=0x98a61CA1504b92Ae768eF20b85aa97030b7a1Edf&type=tokenlock&chain=BSC'
                                target='_blank'
                                rel='noreferrer'
                              >
                                50% for Community Events
                              </a>
                            </Text>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <Text>
                              <a
                                href='https://dxsale.app/app/v3_3/dxlockview?id=1&add=0x98a61CA1504b92Ae768eF20b85aa97030b7a1Edf&type=tokenlock&chain=BSC'
                                target='_blank'
                                rel='noreferrer'
                              >
                                15% for ApeSwap Partnership Provisions
                              </a>
                            </Text>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <Text>
                              <a
                                href='https://dxsale.app/app/v3_3/dxlockview?id=2&add=0x98a61CA1504b92Ae768eF20b85aa97030b7a1Edf&type=tokenlock&chain=BSC'
                                target='_blank'
                                rel='noreferrer'
                              >
                                13% for Team and Development
                              </a>
                            </Text>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <Text>
                              <a
                                href='https://dxsale.app/app/v3_3/dxlockview?id=2&add=0x98a61CA1504b92Ae768eF20b85aa97030b7a1Edf&type=tokenlock&chain=BSC'
                                target='_blank'
                                rel='noreferrer'
                              >
                                22% in Circulation (~6% in liquidity, ~3.5%
                                presale)
                              </a>
                            </Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </List.Accordion> */}

                  {/* <List.Accordion title='Roadmap' style={styles.section}>
                    <Text style={styles.textIndent}>
                      <p>
                        <s>CEX Listing</s> <i>completed</i>
                      </p>
                      <p>
                        <s>LP Farming</s> <i>completed</i>
                      </p>
                      <p>CoinGecko Listing</p>
                      <p>
                        <s>CoinPaprika Listing</s> <i>completed</i>
                      </p>
                      <p>CoinMarketCap Listing</p>
                      <p>
                        <s>ApeSwap Partnership</s> <i>completed</i>
                      </p>
                      <p>
                        ****** Partnership <i>(Coming Soon)</i>
                      </p>
                      <p>
                        <s>Generic LP Farming</s> <i>completed</i>
                      </p>
                      <p>
                        <s>Generic PCS LP</s> <i>completed</i>
                      </p>
                      <p>
                        <s>Generic Website Expansion 1</s> <i>completed</i>
                      </p>
                      <p>Generic Website Expansion 2</p>
                      <p>Generic Website Expansion 3</p>
                      <p>Generic Launchpad</p>
                      <p>Generic Slots</p>
                      <p>Generic App</p>
                      <p>Generic NFTs</p>
                      <p>Generic Ad Campaign</p>
                    </Text>
                  </List.Accordion> */}

                  <div style={{  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', margin:'.5rem .5rem 1rem' }}>
                    <div style={{flex: 1, margin:'.5rem', minWidth:'10rem'}}>
                      <a href='http://dextools.io/app/arbitrum/pair-explorer/0x0095D76b6fAE5A178f3F26aE42ffe82234d131D6'
                          target='_blank'
                          rel='noreferrer'
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            primary
                          >
                            DEXTools
                          </Button>
                        </a>
                    </div>
                    <div style={{flex: 1, margin:'.5rem', minWidth:'10rem'}}>
                      <a href='https://www.geckoterminal.com/arbitrum/pools/0x0095d76b6fae5a178f3f26ae42ffe82234d131d6'
                          target='_blank'
                          rel='noreferrer'
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            primary
                          >
                            GeckoTerminal
                          </Button>
                        </a>
                    </div>
                    <div style={{flex: 1, margin:'.5rem', minWidth:'10rem'}}>
                      <a href='https://www.dexview.com/arbitrum/0x884e1dB2Bde9023203Aa900A5f35B87BbAb001B9'
                          target='_blank'
                          rel='noreferrer'
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            primary
                          >
                            DEXView
                          </Button>
                        </a>
                    </div>
                    <div style={{flex: 1, margin:'.5rem', minWidth:'10rem'}}>
                      <a href='https://dexscreener.com/arbitrum/0x0095d76b6fae5a178f3f26ae42ffe82234d131d6'
                          target='_blank'
                          rel='noreferrer'
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            primary
                          >
                            DEXSCREENER
                          </Button>
                        </a>
                    </div>

                  </div>

                  <List.Accordion title='Partnerships' style={styles.section}>
                    <Text style={styles.textIndent}>
                      <p>
                        <a
                          href='https://chain.link/'
                          target='_blank'
                          rel='noreferrer'
                        >
                          Chainlink
                        </a>
                      </p>
                      <p>
                        <a
                          href='https://apeswap.finance/'
                          target='_blank'
                          rel='noreferrer'
                        >
                          ApeSwap
                        </a>
                      </p>
                    </Text>
                  </List.Accordion>

                  <List.Accordion
                    title='Connect'
                    style={styles.section}
                    defaultExpanded
                  >
                    <View style={styles.associatedContainer}>
                      <View style={styles.associatedItem}>
                        <a
                          href='mailto:admin@generic.money'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <Image
                            style={styles.associatedImage}
                            source={EmailIcon}
                          />
                        </a>
                      </View>
                      <View style={styles.associatedItem}>
                        <a
                          href='https://t.me/genericcoin'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <Image
                            style={styles.associatedImage}
                            source={TelegramIcon}
                          />
                        </a>
                      </View>
                      <View style={styles.associatedItem}>
                        <a
                          href='https://twitter.com/thegenericcoin'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <Image
                            style={styles.associatedImage}
                            source={TwitterIcon}
                          />
                        </a>
                      </View>
                      <View style={styles.associatedItem}>
                        <a
                          href='https://medium.com/@genericcoin'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <Image
                            style={styles.associatedImage}
                            source={MediumIcon}
                          />
                        </a>
                      </View>
                      <View style={styles.associatedItem}>
                        <a
                          href='https://www.youtube.com/channel/UCQXvW-5S9fsfNvWMvri7jdw/videos'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <Image
                            style={styles.associatedImage}
                            source={YouTubeIcon}
                          />
                        </a>
                      </View>
                      <View style={styles.associatedItem}>
                        <a
                          href='https://github.com/Generic-Coin'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <Image
                            style={styles.associatedImage}
                            source={GitHubIcon}
                          />
                        </a>
                      </View>
                    </View>
                  </List.Accordion>

                  {/* <View style={styles.associatedContainer}>
                    <View style={styles.associatedItem}>
                      <a
                        href='https://coinpaprika.com/coin/genv3-generic-coin/'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <Image
                          style={styles.associatedImage}
                          source={CoinPaprika}
                        />
                      </a>
                    </View>
                    <View style={styles.associatedItem}>
                      <a
                        href='https://blockspot.io/coin/generic-coin/'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <Image
                          style={styles.associatedImage}
                          source={BlockSpot}
                        />
                      </a>
                    </View>
                    <View style={styles.associatedItem}>
                      <a
                        href='https://www.livecoinwatch.com/price/GenericCoin-GENV3'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <Image
                          style={styles.associatedImage}
                          source={CoinWatchIcon}
                        />
                      </a>
                    </View>
                    <View style={styles.associatedItem}>
                      <a
                        href='https://tokpie.com/view_exchange/genv3-bnb/'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <Image
                          style={styles.associatedImage}
                          source={TokenPieIcon}
                        />
                      </a>
                    </View>
                    <View style={styles.associatedItem}>
                      <a
                        href='https://apeswap.finance/swap/?outputCurrency=0x98a61CA1504b92Ae768eF20b85aa97030b7a1Edf'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <Image
                          style={styles.associatedImage}
                          source={ApeSwapIcon}
                        />
                      </a>
                    </View>
                    <View style={styles.associatedItem}>
                      <a
                        href='https://pancakeswap.finance/swap?outputCurrency=0x98a61CA1504b92Ae768eF20b85aa97030b7a1Edf'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <Image
                          style={styles.associatedImage}
                          source={PancakeSwapIcon}
                        />
                      </a>
                    </View>
                    <View style={styles.associatedItem}>
                      <a
                        href='https://coincheckup.com/coins/generic-coin'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <Image
                          style={styles.associatedImage}
                          source={CoinCheckupIcon}
                        />
                      </a>
                    </View>
                  </View> */}
                </ScrollView>
              </Panel>
              <View style={[styles.statusBar]}>
                <Panel
                  variant='well'
                  style={[
                    styles.statusBarItem,
                    { flexGrow: 1, marginRight: 4 },
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
  associatedContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '1rem 0',
    margin: '1rem 0',
  },
  associatedItem: {
    marginTop: '1rem',
    marginBottom: '1rem',
    position: 'relative',
    width: '3rem',
  },
  associatedImage: {
    width: '2rem',
    height: '2rem',
  },
  // price: {
  //   position: 'absolute',
  //   top: '1rem',
  //   left: '1rem',
  // },
  // priceText: {
  //   fontSize: '.75rem',
  // },
  // tokenomicText: {
  //   margin: 12,
  // },
  // centered: {
  //   textAlign: 'center',
  // },
  // infoView: {
  //   maxWidth: '40rem',
  //   width: '100%',
  //   margin: 'auto',
  // },
  // videoPresentation: {
  //   position: 'relative',
  //   width: '100%',
  //   height: 'auto',
  //   margin: '2rem auto',
  // },
  background: {
    flex: 1,
    backgroundColor: '#008080',
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
  // startText: {
  //   fontFamily: 'MS Sans Serif',
  //   float: 'left',
  // },
  startLogoImage: {
    float: 'left',
    position: 'relative',
    height: 24,
    width: 24,
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
  // zpanel: {
  //   flex: 1,
  //   padding: 8,
  //   paddingTop: 32,
  //   paddingBottom: 128,
  //   margin: 18,
  //   position: 'relative',
  //   zIndex: -1,
  // },
  // zlink: {
  //   position: 'relative',
  //   zIndex: 9001,
  // },
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
  // aboutButton: {
  //   position: 'absolute',
  //   right: 8,
  //   height: 40,
  //   width: 40,
  // },
  // questionMark: {
  //   width: 26,
  //   height: 26,
  // },
  // scrollPanel: {
  //   zIndex: -1,
  // },
  // video: {
  //   margin: '2rem 0',
  // },
});

export default GenericScreen;