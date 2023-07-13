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

const TeamScreen = () => {
  useEffect(() => {
    getPrices();
  }, []);

  const [verticalMenuOpen, setVerticalMenuOpen] = React.useState(false);

  const [showGenericPrice, setShowGenericPrice] = useState(0);
  const getPrices = async () => {
    try {
      // const response = await fetch(
      //   'https://api.coinpaprika.com/v1/tickers/genv3-generic-coin',
      // );
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
    // 'https://www.linkedin.com/in/james-smith-770045238/',
  );
  const renderMemberLink = () => {
    if (memberUrl) {
      // return (
      //   <a href={memberUrl} target='_blank' rel='noreferrer'>
      //     LinkedIn
      //   </a>
      // );
    } else return null;
  };

  const options = [
    'James Smith',
    'Eric Estrada',
    'Robert Stevenson',
    'Katsu Mori',
    'Rick Gene',
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
      // setMemberUrl('https://www.linkedin.com/in/james-smith-770045238/');
    }
    if (newValue === 'Eric Estrada') {
      setMemberTitle('CEO');
      setMemberImage({ uri: ComingSoon });
      // setMemberUrl('https://www.linkedin.com/in/lord-johnson-91561a240/');
    }
    if (newValue === 'Robert Stevenson') {
      setMemberTitle('Developer');
      setMemberImage({ uri: ComingSoon });
      // setMemberUrl('https://www.linkedin.com/in/joelcuthriell/');
    }
    if (newValue === 'Katsu Mori') {
      setMemberTitle('Web Developer');
      setMemberImage({ uri: ComingSoon });
      // setMemberUrl('https://www.linkedin.com/in/charlie-doodle-bab078239/');
    }
    if (newValue === 'Rick Gene') {
      setMemberTitle('Community Manager');
      setMemberImage({ uri: ComingSoon });
      // setMemberUrl('https://www.linkedin.com/in/larry-smitt-957052238/');
    }
  };
  
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  return (
    <View style={styles.background}>
      <View style={styles.container}>
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
              alwaysShowScrollbars
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
    width: '100%',
    height: 'auto',
    margin: '2rem auto',
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

export default TeamScreen;