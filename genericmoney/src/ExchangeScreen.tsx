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

const ExchangeScreen = () => {

  const [verticalMenuOpen, setVerticalMenuOpen] = React.useState(false);

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
                    <div>aaaa</div>
                  </div>
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
                // disabled
                onPress={() => openLink('http://bingo.generic.money')}
                title='Bingo'
              />
              <Menu.Item
                size='lg'
                disabled
                onPress={() => openLink('/staking')}
                title='Staking'
              />
              <Menu.Item
                size='lg'
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

export default ExchangeScreen;