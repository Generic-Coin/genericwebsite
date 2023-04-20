import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Linking,
  ImageBackground,
} from 'react-native';
import { Video } from 'expo-av';
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
import James from './assets/images/james.png';
import Caribou from './assets/images/caribou.png';
import Larry from './assets/images/larry.png';
import Charlie from './assets/images/charlie.png';
import Lord from './assets/images/lord.png';
import ComingSoon from './assets/images/comingsoon.png';
import BlockSpot from './assets/images/bs.png';
import CoinPaprika from './assets/images/cp.png';
import EmailIcon from './assets/images/em.png';
import TelegramIcon from './assets/images/te.png';
import DiscordIcon from './assets/images/di.png';
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

  const [memberUrl, setMemberUrl] = useState(
    'https://www.linkedin.com/in/james-smith-770045238/',
  );
  const renderMemberLink = () => {
    if (memberUrl) {
      return (
        <a href={memberUrl} target='_blank' rel='noreferrer'>
          LinkedIn
        </a>
      );
    } else return null;
  };

  const options = [
    'James Smith',
    'Lord Johnson',
    'Joel Cuthriell',
    'Charlie Doodle',
    'Garry Schmittens',
  ].map(o => ({
    label: o,
    value: o,
  }));
  const [value, setValue] = useState(options[0].value);

  const changeMember = (newValue: string) => {
    setValue(newValue);

    if (newValue === 'James Smith') {
      setMemberTitle('Generic CEO');
      setMemberImage({ uri: James });
      setMemberUrl('https://www.linkedin.com/in/james-smith-770045238/');
    }
    if (newValue === 'Lord Johnson') {
      setMemberTitle('Developer');
      setMemberImage({ uri: Lord });
      setMemberUrl('https://www.linkedin.com/in/lord-johnson-91561a240/');
    }
    if (newValue === 'Joel Cuthriell') {
      setMemberTitle('UI/UX');
      setMemberImage({ uri: Caribou });
      setMemberUrl('https://www.linkedin.com/in/joelcuthriell/');
    }
    if (newValue === 'Charlie Doodle') {
      setMemberTitle('Designer');
      setMemberImage({ uri: Charlie });
      setMemberUrl('https://www.linkedin.com/in/charlie-doodle-bab078239/');
    }
    if (newValue === 'Garry Schmittens') {
      setMemberTitle('Advisor');
      setMemberImage({ uri: Larry });
      setMemberUrl('https://www.linkedin.com/in/larry-smitt-957052238/');
    }
  };
  

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        {showAboutModal ? (
          <Window
            title='Info'
            style={{ flex: 1 }}
            onClose={() => setShowAboutModal(false)}
          >
            <View
              style={{
                padding: 16,
                justifyContent: 'space-between',
                flex: 1,
              }}
            >
              <Panel
                variant='cutout'
                background='material'
                style={styles.cutout}
              >
                <ScrollView
                  style={styles.scrollView}
                  scrollViewProps={{
                    contentContainerStyle: styles.content,
                  }}
                >
                  <View style={styles.infoView}>
                    <Text style={{ lineHeight: 24 }}>
                      <></>

                      <br />
                      <div style={{ float: 'left', width: '100%' }}>
                        <Text
                          bold
                          style={{
                            fontSize: 22,
                            marginBottom: 16,
                          }}
                        >
                          Contact
                        </Text>
                        <p>
                          <a
                            href='mailto:admin@generic.money'
                            target='_blank'
                            rel='noreferrer'
                          >
                            admin@generic.money
                          </a>
                        </p>
                      </div>
                    </Text>
                  </View>
                </ScrollView>
              </Panel>
              <View>
                <Divider style={{ marginTop: 16 }} />
                <Button
                  primary
                  style={{ marginTop: 16, alignSelf: 'flex-end', width: 150 }}
                  onPress={() => setShowAboutModal(false)}
                >
                  OK
                </Button>
              </View>
            </View>
          </Window>
        ) : (
          <>
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
                  Generic Coin
                </Text>
              </View>
              {/* <Button
                square
                variant='raised'
                size='lg'
                style={styles.aboutButton}
                onPress={() => setShowAboutModal(true)}
              >
                <Image
                  style={styles.questionMark}
                  source={{
                    uri:
                      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAJ1BMVEUAAACAgID///8AAADAwMAAgIAAgAAA/wCAAID/AP+AgAD//wAA///5GE4vAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAHdElNRQflAQwXHQ1lXxPNAAAAq0lEQVQoz2NgIAcIggADI4gUAPOFlIAAShqA+GCmMIhQEjE0YBAVEnIBAmEVIOEkkpYMEgCrcAKrKC9GUwERQFJhbIymwtQATUVHM5qKmZPRVCAJQFQgGQpRgWQoRMWqxWgqdm+Gq1BCEkCyFmIokrUYhoYGo6k4cxjNUAwBsKHgUBdWBJFgQ41BwERYBEyDBEJBINjYGEyHGjAYQ2RCQyEMA2jsMQNNIxYAAJmCSHaZSKbTAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAxLTEyVDIzOjI5OjEzKzAwOjAwyc9MIQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMS0xMlQyMzoyOToxMyswMDowMLiS9J0AAAAASUVORK5CYII=',
                  }}
                />
              </Button> */}
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
                  <Text style={styles.centered}>
                    You can buy it
                    <br />
                    You can sell it
                    <br />
                    You can hold it
                    <br />
                    Solution to all your problems, have a generic day!
                    <br />
                    Fortune favors the brave.
                  </Text>

                  <br />
                  <List.Accordion
                    title='Video Presentation'
                    style={styles.section}
                  >
                    <Video
                      source={GenericSizzle}
                      rate={1.0}
                      volume={1.0}
                      isMuted={false}
                      resizeMode='cover'
                      shouldPlay
                      isLooping
                      style={styles.videoPresentation}
                    />
                  </List.Accordion>

                  <List.Accordion
                    title='Decentralized Exchanges'
                    style={styles.section}
                    defaultExpanded
                  >
                    <br />
                    <Text style={styles.centered}>
                      <a
                        href='https://apeswap.finance/swap/?outputCurrency=0x98a61CA1504b92Ae768eF20b85aa97030b7a1Edf'
                        target='_blank'
                        rel='noreferrer'
                        style={{ textDecoration: 'none' }}
                      >
                        <Button
                          primary
                          style={{
                            width: '100%',
                            maxWidth: '50vw',
                            minWidth: '16rem',
                          }}
                        >
                          Buy on ApeSwap (Official Partner)
                        </Button>
                      </a>
                      <br />
                      <br />
                      <a
                        href='https://pancakeswap.finance/swap?outputCurrency=0x98a61CA1504b92Ae768eF20b85aa97030b7a1Edf'
                        target='_blank'
                        rel='noreferrer'
                        style={{ textDecoration: 'none' }}
                      >
                        <Button
                          primary
                          style={{
                            width: '100%',
                            maxWidth: '50vw',
                            minWidth: '16rem',
                          }}
                        >
                          Buy on PancakeSwap
                        </Button>
                      </a>
                      <br />
                      <br />
                    </Text>
                  </List.Accordion>
                  <List.Accordion
                    title='Centralized Exchanges'
                    style={styles.section}
                    defaultExpanded
                  >
                    <br />
                    <Text style={styles.centered}>
                      <a
                        href='https://tokpie.com/view_exchange/genv3-bnb/'
                        target='_blank'
                        rel='noreferrer'
                        style={{ textDecoration: 'none' }}
                      >
                        <Button
                          primary
                          style={{
                            width: '100%',
                            maxWidth: '50vw',
                            minWidth: '16rem',
                          }}
                        >
                          Buy on Tokpie
                        </Button>
                      </a>
                      <br />
                      <br />
                    </Text>
                  </List.Accordion>

                  <List.Accordion
                    title='Contract'
                    style={styles.section}
                    defaultExpanded
                  >
                    <Text style={styles.centered}>
                      <a
                        href='https://bscscan.com/token/0x98a61ca1504b92ae768ef20b85aa97030b7a1edf'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <br />
                        <marquee width='100%' direction='left' height='30px'>
                          0x98a61ca1504b92ae768ef20b85aa97030b7a1edf
                        </marquee>
                      </a>
                      <br />
                      <a
                        href='https://bscscan.com/token/0x98a61ca1504b92ae768ef20b85aa97030b7a1edf'
                        target='_blank'
                        rel='noreferrer'
                        style={{ textDecoration: 'none' }}
                      >
                        <Button
                          primary
                          style={{
                            width: '100%',
                            maxWidth: '50vw',
                            minWidth: '16rem',
                          }}
                        >
                          View on BscScan
                        </Button>
                      </a>
                      <br />
                      <br />
                    </Text>
                  </List.Accordion>

                  <List.Accordion
                    title='Whitepaper'
                    style={styles.section}
                    defaultExpanded
                  >
                    <Text style={styles.textIndent}>
                      <a
                        href={GenericWhitepaper}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <p>View Whitepaper</p>
                      </a>
                    </Text>
                  </List.Accordion>

                  <List.Accordion title='Tokenomics' style={styles.section}>
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
                  </List.Accordion>

                  <List.Accordion title='Roadmap' style={styles.section}>
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
                  </List.Accordion>

                  <List.Accordion
                    title='Team'
                    style={styles.section}
                    defaultExpanded
                  >
                    <Panel variant='raised' style={[styles.zpanel]}>
                      <Text style={styles.textIndent}>
                        <div>
                          {renderMemberImage()}
                          <br />
                          <br />
                        </div>
                        <div>
                          <Text style={styles.zlink}>
                            {renderMemberTitle()}
                          </Text>
                          <Text style={styles.zlink}>{renderMemberLink()}</Text>
                          <br />
                        </div>
                        <br />
                        <div>
                          <Fieldset label='Members:' style={[{ padding: 20 }]}>
                            <View style={{ zIndex: 999 }}>
                              <Select
                                menuMaxHeight={130}
                                options={options}
                                value={value}
                                onChange={newValue => changeMember(newValue)}
                                style={[{ width: '100%', minWidth: 150 }]}
                              />
                            </View>
                          </Fieldset>
                        </div>
                      </Text>
                    </Panel>
                  </List.Accordion>

                  <List.Accordion title='Partnerships' style={styles.section}>
                    <Text style={styles.textIndent}>
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
                          href='https://discord.gg/j8FgQ2X3Rz'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <Image
                            style={styles.associatedImage}
                            source={DiscordIcon}
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

                  <View style={styles.associatedContainer}>
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
                  </View>
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
        )}
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
  price: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
  },
  priceText: {
    fontSize: '.75rem',
  },
  tokenomicText: {
    margin: 12,
  },
  centered: {
    textAlign: 'center',
  },
  infoView: {
    maxWidth: '40rem',
    width: '100%',
    margin: 'auto',
  },
  videoPresentation: {
    position: 'relative',
    width: '70vw',
    maxWidth: 700,
    height: 'auto',
    margin: 'auto',
  },
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
  container: {
    flex: 1,
    // maxHeight: '80vh',
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
    paddingTop: 32,
    paddingBottom: 128,
    margin: 18,
    position: 'relative',
    zIndex: -1,
  },
  zlink: {
    position: 'relative',
    zIndex: 9001,
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
  video: {
    margin: '2rem 0',
  },
});

export default GenericScreen;