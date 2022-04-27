import React, { useState } from 'react';
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
} from 'react95-native';
import GenericLogo from './assets/images/gcp.png';
import GenericSizzle from './genericday.mp4';
import James from './james.png';
import Caribou from './caribou.png';
import Larry from './larry.png';
import ComingSoon from './comingsoon.png';

const GenericScreen = () => {
  let pricesResponse = 'a';
  const getPrices = () => {
    return fetch('https://api.apeswap.finance/tokens')
      .then(response => response.json())
      .then(response => {
        console.log(response);
        let pricesResponse = response;
      })
      .catch(error => {
        console.error(error);
      });
  };

  const [showAboutModal, setShowAboutModal] = useState(false);
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.warn("Couldn't load page", err));
  };

  let [memberImage, setMemberImage] = useState({ uri: James });
  let renderMemberImage = () => {
    console.log('contact');
    return (
      <ImageBackground source={memberImage} resizeMode='cover'>
        <div style={{ width: 190, height: 180 }}></div>
      </ImageBackground>
    );
  };

  let [memberUrl, setMemberUrl] = useState(
    'https://www.linkedin.com/in/james-smith-770045238/',
  );
  let renderMemberLink = () => {
    if (memberUrl) {
      return (
        <a href={memberUrl} target='_blank' rel='noreferrer'>
          LinkedIn
        </a>
      );
    } else {
      return null;
    }
  };

  const options = [
    'James Smith - Generic CEO',
    'Lord Johnson - Developer',
    'Joel Cuthriell - UI/UX',
    'Charlie Doodle - Designer',
    'Larry Smitt - Advisor',
  ].map(o => ({
    label: o,
    value: o,
  }));
  let [value, setValue] = useState(options[0].value);

  const changeMember = (newValue: string) => {
    setValue(newValue);

    if (newValue == 'James Smith - Generic CEO') {
      console.log(newValue);
      setMemberImage({ uri: James });
      setMemberUrl('https://www.linkedin.com/in/james-smith-770045238/');
    }
    if (newValue == 'Lord Johnson - Developer') {
      console.log(newValue);
      setMemberImage({ uri: ComingSoon });
      setMemberUrl('');
    }
    if (newValue == 'Joel Cuthriell - UI/UX') {
      console.log(newValue);
      setMemberImage({ uri: Caribou });
      setMemberUrl('https://www.linkedin.com/in/joelcuthriell/');
    }
    if (newValue == 'Charlie Doodle - Designer') {
      console.log(newValue);
      setMemberImage({ uri: ComingSoon });
      setMemberUrl('');
    }
    if (newValue == 'Charlie Doodle - Designer') {
      console.log(newValue);
      setMemberImage({ uri: ComingSoon });
      setMemberUrl('');
    }
    if (newValue == 'Larry Smitt - Advisor') {
      console.log(newValue);
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
                      <div></div>

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
                            href='mailto:genericcoin@outlook.com'
                            target='_blank'
                            rel='noreferrer'
                          >
                            genericcoin@outlook.com
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
                  {/* attempting to call price data */}
                  {/* <Button primary onPress={() => getPrices()}>call</Button>
                  {pricesResponse && pricesResponse} */}
                  <Text>
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

                    {/* <video poster={GenericPoster} controls>
                  <source src={GenericSizzle} type="video/mp4" />
                </video> */}
                  </List.Accordion>
                  <br />
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

                  <List.Accordion
                    title='Contract'
                    style={styles.section}
                    defaultExpanded
                  >
                    <Text>
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
                    </Text>
                  </List.Accordion>

                  {/* <List.Accordion
                  title='Tokenomics'
                  style={styles.section}
                >
                  <table border="2">
                    <thead>
                      <tr>
                        <td><Text>Buy</Text></td>
                        <td><Text>Sell</Text></td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><Text>1% Team/Marketing Tax</Text></td>
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
                  <table border="2">
                    <thead>
                      <tr>
                        <td><Text>1,000,000,000,000 Total Supply</Text></td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><Text>39.3% of the Total Supply for Presale</Text></td>
                      </tr>
                      <tr>
                        <td><Text>50% of Total Supply for Liquidity (100% Locked for 1 Year)</Text></td>
                      </tr>
                      <tr>
                        <td>
                          <Text>
                          15% of Total Supply for Private Sale to Raise BUSD to be used for
                          Buyback and Burns to Correct Dumps
                          </Text>
                        </td>
                      </tr>
                      <tr>
                        <td><Text>0.7% of Total Supply for Apeswap's IAO Listing Fee</Text></td>
                      </tr>
                    </tbody>
                  </table>
                </List.Accordion> */}

                  <List.Accordion title='Roadmap' style={styles.section}>
                    <Text style={styles.textIndent}>
                      <p>CoinGecko Listing</p>
                      <p>CoinMarketCap Listing</p>
                      <p>Generic LP Farming</p>
                      <p>
                        <s>Generic PCS LP</s> <i>completed</i>
                      </p>
                      <p>
                        <s>Generic Website Expansion 1</s> <i>completed</i>
                      </p>
                      <p>Generic Website Expansion 2</p>
                      <p>Generic Website Expansion 3</p>
                      <p>Generic Launchpad</p>
                      <p>Generic Game</p>
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
                                style={[{ width: '100%', minWidth: 250 }]}
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
                      <p>
                        <a
                          href='https://t.me/partyhat'
                          target='_blank'
                          rel='noreferrer'
                        >
                          Partyhat - t.me/partyhat
                        </a>
                      </p>
                    </Text>
                  </List.Accordion>

                  <List.Accordion
                    title='Connect'
                    style={styles.section}
                    defaultExpanded
                  >
                    <Text style={styles.textIndent}>
                      <p>
                        <a
                          href='mailto:genericcoin@outlook.com'
                          target='_blank'
                          rel='noreferrer'
                        >
                          genericcoin@outlook.com
                        </a>
                        <br />
                        <br />
                        <a
                          href='https://t.me/genericcoin'
                          target='_blank'
                          rel='noreferrer'
                        >
                          t.me/genericcoin
                        </a>
                        <br />
                        <br />
                        <a
                          href='https://discord.gg/j8FgQ2X3Rz'
                          target='_blank'
                          rel='noreferrer'
                        >
                          discord.gg/j8FgQ2X3Rz
                        </a>
                        <br />
                        <br />
                        <a
                          href='https://twitter.com/thegenericcoin'
                          target='_blank'
                          rel='noreferrer'
                        >
                          twitter.com/TheGenericCoin
                        </a>
                        <br />
                        <br />
                        <a
                          href='https://medium.com/@genericcoin'
                          target='_blank'
                          rel='noreferrer'
                        >
                          medium.com/@genericcoin
                        </a>
                        <br />
                        <br />
                        <a
                          href='https://www.youtube.com/channel/UCQXvW-5S9fsfNvWMvri7jdw/videos'
                          target='_blank'
                          rel='noreferrer'
                        >
                          youtube.com/channel/UCQXvW-5S9fsfNvWMvri7jdw
                        </a>
                        <br />
                        <br />
                        <a
                          href='https://github.com/Generic-Coin'
                          target='_blank'
                          rel='noreferrer'
                        >
                          github.com/Generic-Coin
                        </a>
                      </p>
                    </Text>
                  </List.Accordion>
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
                  {/* <Text>        
                  <a
                    href="mailto:genericcoin@outlook.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    genericcoin@outlook.com
                  </a>
                </Text> */}
                  <Anchor
                    underline
                    onPress={() => openLink('mailto:genericcoin@outlook.com')}
                  >
                    genericcoin@outlook.com
                  </Anchor>
                </Panel>
              </View>
            </Panel>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
