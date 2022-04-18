import React, { useState } from 'react';
import { StyleSheet, View, Image, Linking } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
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
  useTheme,
} from 'react95-native';
import type { Theme } from 'react95-native';
import GenericLogo from './assets/images/gcp.png';
import GenericSizzle from "./genericday.mp4";

type Props = {
  setTheme: (theme: Theme) => void;
};

const ExamplesScreen = ({ setTheme: setThemeProp }: Props) => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const navigation = useNavigation();
  // const { theme: currentTheme, setTheme } = useContext(LocalThemeContext);

  const currentTheme = useTheme();
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.warn("Couldn't load page", err));
  };

  return (
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
            <Panel variant='cutout' background='material' style={styles.cutout}>
              <ScrollView
                style={styles.scrollView}
                scrollViewProps={{
                  contentContainerStyle: styles.content,
                }}
              >
                <View>

                  <Text style={{ lineHeight: 24 }}>

                    <Text
                      bold
                      style={{
                        fontSize: 22,
                        marginBottom: 16,
                      }}
                    >
                      Team
                    </Text>
                    <p>
                      <a
                        href="mailto:genericcoin@outlook.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        James Smith - Generic CEO
                      </a>
                      <br />
                      <a href="https://t.me/stinkitylinkity" target="_blank" rel="noreferrer">
                        Lord Johnson - Developer
                      </a>
                      <br />
                      <a
                        href="https://t.me/sevenmilesbeneathcariboucoffee"
                        target="_blank"
                        rel="noreferrer"
                      >
                        caribou - UI / UX
                      </a>
                      <br />
                      <a href="https://t.me/Mrdoodley" target="_blank" rel="noreferrer">
                        Charlie Doodle - Designer
                      </a>
                    </p>
                    <br />
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
                        href="mailto:genericcoin@outlook.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        genericcoin@outlook.com
                      </a>
                    </p>
                    
                    {/* This <Text style={{ color: 'red' }}>PRERELEASE</Text>{' '}
                    version of React95 Native is under construction!
                    {'\n'}
                    {'\n'}
                    Please remember that the components, themes and API will
                    continue to change through the product&apos;s development
                    cycle.
                    {'\n'}
                    {'\n'}
                    If you find this project interesting consider doing the
                    following:
                    {'\n'}
                    {'\n'}- follow our{' '}
                    <Anchor
                      underline
                      onPress={() => openLink('https://twitter.com/react95_io')}
                    >
                      Twitter account
                    </Anchor>
                    {'\n'}- visit our{' '}
                    <Anchor
                      underline
                      onPress={() => openLink('https://react95.io/')}
                    >
                      Website
                    </Anchor>
                    {'\n'}- sponsor us on{' '}
                    <Anchor
                      underline
                      onPress={() =>
                        openLink('https://www.patreon.com/arturbien')
                      }
                    >
                      Patreon
                    </Anchor>
                    {'\n'}- donate through{' '}
                    <Anchor
                      underline
                      onPress={() =>
                        openLink('https://www.paypal.com/paypalme/react95')
                      }
                    >
                      PayPal
                    </Anchor>
                    {'\n'}- tell your friends!
                    {'\n'}
                    {'\n'}
                    Thanks!
                    {'\n'}
                    {'\n'}- the React95 team */}
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
              <Image
                style={styles.logoImage}
                source={GenericLogo}
              />
              <Text style={styles.heading} bold disabled>
                Generic Coin
              </Text>
            </View>
            <Button
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
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABeElEQVR4AcXBgW0cMQxFwUfl+qI641dnYmWMZSCAsdmzV+szPGPcIFF8QcK4wNggUbzpfeLuZCbuzpKZuDuZyTJnZ5EwPmFcIFG8iSgyE3cnM3F3MhN3Z8lM3J3M5J85OxLGE8YXJCqiuCozOZqzI2GcMD4hUREFGNcVS2by0ZwdCeOg8YRERRRg7DHAOCNRHDROSFREAcZd7p0jif80fpB7Z5mz80zjQKIiCjBeYc7OZx5sGoN3Eu+q+JbGhjE4MjO+pXGDxGK8kcR3NDZJLMYmicU4aGyQWIxNEotx4sEJM+MJ4wOJighAnBkDJBbjCeMmiYoowDgzBkgsxieMGyQqogDjzBggsRhfaGySqIgCjDNjsKVxi/EqjQ0SFVE8MwbbGr+s8csaP0BiMS5ovJjEYlz0YJOZ8UrGDRLFQe+TOTuLxGJc8GCTpIoQR2N07mhskFQR4kwEtzR+WePFJBbjoj9smHMOM6n3ydEYILEYG4x7inPGpr+fbJEGoinDewAAAABJRU5ErkJggg==',
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
              
              <Text>
                Generic Coin is a Binance Smart Chain project that focuses on features
                that users find important in today's evolving crypto landscape.
                <br />
                You can buy Generic Coin
                <br />
                You can sell Generic Coin
                <br />
                You can send Generic Coin
                <br />
                Have a Generic Day! - The Generic Coin Team.
              </Text>
              <br /><br />
    
              <List.Accordion
                title='Video Presentation'
                style={styles.section}
              >
                <Video
                  source={GenericSizzle}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  style={styles.videoPresentation}
                /> 
              
                {/* <video poster={GenericPoster} controls>
                  <source src={GenericSizzle} type="video/mp4" />
                </video> */}
              </List.Accordion>
              <br />
              
              <Anchor
                onPress={() => openLink('https://apeswap.finance/swap/?outputCurrency=0x98a61CA1504b92Ae768eF20b85aa97030b7a1Edf')}
              >
                <Button primary variant='default'>
                  Buy on ApeSwap (Official Partner)
                </Button>
              </Anchor>
              <br />
              <Anchor
                onPress={() => openLink('https://pancakeswap.finance/swap?outputCurrency=0x98a61CA1504b92Ae768eF20b85aa97030b7a1Edf')}
              >
                <Button primary variant='default'>
                  Buy on PancakeSwap
                </Button>
              </Anchor>
              <br />
            
                <List.Accordion
                  title='Contract'
                  style={styles.section}
                  defaultExpanded
                >
                <Text>        
                  <a
                    href="https://bscscan.com/token/0x98a61ca1504b92ae768ef20b85aa97030b7a1edf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <br />
                    <marquee width="100%" direction="left" height="30px">
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
                
                <List.Accordion
                  title='Roadmap'
                  style={styles.section}
                >
                <Text style={styles.textIndent}>
                  <p>Generic LP Farming</p>
                  <p><s>Generic PCS LP</s> <i>completed</i></p>
                  <p><s>Generic Website Expansion 1</s> <i>completed</i></p>
                  <p>Generic Website Expansion 2</p>
                  <p>Generic Website Expansion 3</p>
                  <p>Generic Launchpad</p>
                  <p>Generic Game</p>
                  <p>Generic Ad Campaign</p>
                 </Text>
                </List.Accordion>
                
                <List.Accordion
                  title='Partnerships'
                  style={styles.section}
                >
                  <Text style={styles.textIndent}>
                    <p>
                      <a href="https://apeswap.finance/" target="_blank" rel="noreferrer">
                        ApeSwap
                      </a>
                    </p>
                    <p>
                      <a href="https://t.me/partyhat" target="_blank" rel="noreferrer">
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
                      href="mailto:genericcoin@outlook.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      genericcoin@outlook.com
                    </a>
                    <br /><br />
                    <a href="https://t.me/genericcoin" target="_blank" rel="noreferrer">
                      t.me/genericcoin
                    </a>
                    <br /><br />
                    <a href="https://discord.gg/j8FgQ2X3Rz" target="_blank" rel="noreferrer">
                      discord.gg/j8FgQ2X3Rz
                    </a>
                    <br /><br />
                    <a
                      href="https://twitter.com/thegenericcoin"
                      target="_blank"
                      rel="noreferrer"
                    >
                      twitter.com/TheGenericCoin
                    </a>
                    <br /><br />
                    <a
                      href="https://medium.com/@genericcoin"
                      target="_blank"
                      rel="noreferrer"
                    >
                      medium.com/@genericcoin
                    </a>
                    <br /><br />
                    <a
                      href="https://www.youtube.com/channel/UCQXvW-5S9fsfNvWMvri7jdw/videos"
                      target="_blank"
                      rel="noreferrer"
                    >
                      youtube.com/channel/UCQXvW-5S9fsfNvWMvri7jdw
                    </a>
                  </p>  
                </Text>
                </List.Accordion>
                
              </ScrollView>
            </Panel>
            <View style={[styles.statusBar]}>
              <Panel
                variant='well'
                style={[styles.statusBarItem, { flexGrow: 1, marginRight: 4 }]}
              >
              <Text>0x98a61CA1504b92Ae768eF20b85aa97030b7a1Edf</Text>
              </Panel>
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
  );
};


const styles = StyleSheet.create({
  videoPresentation: {
    width: '70vw',
    margin: 'auto',
  },
  container: {
    flex: 1,
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

export default ExamplesScreen;
