import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Linking,
    Platform,
} from 'react-native';
import {
    Panel,
    AppBar,
    Button,
    Text,
    ScrollView,
    TextInput,
} from 'react95-native';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    useWalletConnect,
    withWalletConnect,
} from '@walletconnect/react-native-dapp';
import GenericLogo from './assets/images/gcp.png';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import tokenABI from './assets/contracts/tokenABI.json';
import stakingABI from './assets/contracts/stakingABI.json';
import stakingTokenABI from './assets/contracts/stakingTokenABI.json';
import ADDRESSES from './constants/addresses';
import ConnectMetamask from './components/ConnectMetamask';
import type { Contract } from 'web3-eth-contract';

const StakingScreen = () => {
    // Web3 implementation
    const web3 = new Web3(Web3.givenProvider);
    const { active, account, chainId } = useWeb3React();

    var tokenContractAddress = ADDRESSES['97'].genericToken;
    var tokenContract = new web3.eth.Contract(tokenABI, tokenContractAddress);

    // LP Staking contract
    var stakingContractAddress = ADDRESSES['97'].staking;
    var stakingContract = new web3.eth.Contract(stakingABI, stakingContractAddress);

    // The LP token
    var stakingTokenContractAddress = ADDRESSES['97'].stakingToken;
    var stakingTokenContract = new web3.eth.Contract(stakingTokenABI, stakingTokenContractAddress);

    //var selectedAccount = '';

    // React states for the dApp
    const [tokenBalance, setTokenBalance] = useState('Loading...');
    const [stakingTokenBalance, setStakingTokenBalance] = useState('Loading...');
    const [stakingAmount, setStakingAmount] = useState('Loading...');
    const [pendingRewards, setPendingRewards] = useState('Loading...');
    const [depositAmount, setDepositAmount] = useState('0');
    const [allowance, setAllowance] = useState('0');
    const [hasAllowance, setHasAllowance] = useState(false);

    useEffect(() => {
        /*ethereum.on('accountsChanged', function (accounts) {
            selectedAccount = accounts[0];
            fetchContractData();
          });*/

        if (web3.givenProvider !== null) {
            const id = setInterval(() => {
                fetchContractData();
            }, 5000);
            fetchContractData();
            return () => clearInterval(id);
        } else {
            return null;
        }
    }, [active]);

    const fetchContractData = async () => {
        try {
            const tokenBalance = await tokenContract.methods
                .balanceOf(account)
                .call();
            const stakingTokenBalance = await stakingTokenContract.methods
                .balanceOf(account)
                .call();

            const stakingAmount = (await stakingContract.methods.poolStakers(account).call()).amount;
            const pendingRewards = await stakingContract.methods.pendingRewards(account).call();

            const allowance = await stakingTokenContract.methods
                .allowance(account, ADDRESSES['97'].staking)
                .call();

            const hasAllowance = web3.utils.toBN(allowance).gte(web3.utils.toBN(depositAmount));

            setStakingAmount(web3.utils.fromWei(stakingAmount).toLocaleString());
            setStakingTokenBalance(web3.utils.fromWei(stakingTokenBalance));
            setPendingRewards(web3.utils.fromWei(pendingRewards));
            setTokenBalance(web3.utils.fromWei(tokenBalance).toLocaleString());
            setAllowance(allowance);
            setHasAllowance(hasAllowance);
        } catch (ex) { }
    };

    const deposit = async () => {
        try {
            await stakingContract.methods
                .deposit(web3.utils.toWei(depositAmount, 'ether'))
                .send({ from: account });
        }
        catch (ex) { }
    };

    const withdraw = async () => {
        try {
            await stakingContract.methods
                .withdraw()
                .send({ from: account });
        }
        catch (ex) { }
    };

    const claimRewards = async () => {
        try {
            await stakingContract.methods
                .harvestRewards()
                .send({ from: account });
        }
        catch (ex) { }
    };

    const handleApprove = async () => {
        try {
            await stakingTokenContract.methods
                .approve(
                    ADDRESSES['97'].staking,
                    web3.utils.toWei(depositAmount, 'ether'),
                )
                .send({ from: account });
            setHasAllowance(true);
        } catch (ex) {
            return;
        }
    };

    const handleDepositAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDepositAmount(e.target.value);
        var trimmed = String(e.target.value).trim();

        if (trimmed !== '') {

            const hasAllowance = web3.utils.toBN(allowance).gte(web3.utils.toBN(web3.utils.toWei(trimmed, 'ether')));
            setHasAllowance(hasAllowance);
        }
    }

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

                            <div>
                                <div style={{ width: '100%', display: 'flex' }}>
                                    <div style={{ float: 'left', margin: '.75rem 0' }}>
                                        <Text
                                            bold
                                            style={{
                                                fontSize: 22,
                                                margin: 12,
                                                marginBottom: 24,
                                            }}
                                        >
                                            Generic Staking
                                        </Text>
                                    </div>
                                </div>
                                <ConnectMetamask />
                                {active ? (
                                    <div>
                                        <Text style={[styles.textInput]}>
                                            {tokenBalance ? (<p>Your GENv3 Balance: {tokenBalance} GEN</p>) : (<p></p>)}
                                            {stakingTokenBalance ? (<p>Stake token balance: {stakingTokenBalance} LP tokens</p>) : (<p></p>)}
                                            {stakingAmount ? (<p>Staked amount: {stakingAmount} LP tokens</p>) : (<p></p>)}
                                            {pendingRewards ? (<p>Claimable rewards: {pendingRewards} GEN</p>) : (<p></p>)}
                                            <input value={depositAmount} onChange={handleDepositAmountChange} />
                                            {hasAllowance ? (
                                                <Button primary disabled={!hasAllowance} onPress={() => deposit()}>Deposit</Button>
                                            ) : (
                                                <>
                                                    <Button primary disabled={hasAllowance} onPress={() => handleApprove()}>Approve</Button>
                                                    <Button primary disabled={hasAllowance} onPress={() => deposit()}>Deposit</Button>
                                                </>
                                            )
                                            }
                                            <Button primary onPress={() => withdraw()}>Withdraw stake</Button>
                                            <Button primary onPress={() => claimRewards()}>Claim rewards</Button>
                                        </Text>
                                    </div>
                                ) : (<></>)}
                            </div>

                        </ScrollView>
                    </Panel>
                </Panel>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textInput: {
        input: {
            fontSize: '3rem',
        }
    },
    textCenter: {
        textAlign: 'center',
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

export default StakingScreen;

