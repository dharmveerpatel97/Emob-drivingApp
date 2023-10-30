import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import RentalEVStyle from '../../styles/RentalEVStyle';
import React, {useEffect, useState} from 'react';
import arrowRight from '../../Assests/image/arrowRight.png';
import supportImage from '../../Assests/image/supportN.png';
import {color} from '../../utils/color';
import { mobW, mobH} from '../../utils/commonFunction';
import {DrawerActions} from '@react-navigation/native';
import CustomPressable from '../customComp/CustomPressable';
import { useTranslation } from 'react-i18next';
import { REGULAR } from '../../utils/fonts';


global.userdata = null;
export default function Operation_otp({navigation}) {
  const {t} = useTranslation();
  const [modalVisible, setmodalVisible] = useState(false);
  const [userInfo, setuserInfo] = useState({});

  useEffect(() => {
    getUserData();
  }, []);

  function formatUnixTimestamp(timestamp, format) {
    const date = new Date(timestamp * 1000);
    return moment(date).format(format);
  }

  const getUserData = async () => {
    await StorageProvider.getItem('userInfo').then(userInfo1 => {
      userInfo1 = JSON.parse(userInfo1);
      setuserInfo(userInfo1);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: mobH * 0.08}}
        scrollEnabled={true}>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor={color.black_BG}
        />
        <View style={RentalEVStyle.topContainer}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Pressable
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}
              style={{width: 20, marginTop: 10, height: 30}}>
              <Image
                style={{
                  width: mobW * 0.06,
                  height: mobW * 0.06,
                  color: '#6F74F9',
                }}
                source={require('../../Assests/image/blueBars.png')}
              />
            </Pressable>
            <View style={RentalEVStyle.topContainer_text}>
              <Text style={RentalEVStyle.innerText}>
                {' '}
                {t('Hello')}, {userInfo?.firstName}!{' '}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  opacity: 70,
                  fontFamily: REGULAR,
                }}>
                {' '}
                {t('hometag')}...
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Notification');
              }}
              style={{
                right: 0,
                position: 'absolute',
                alignItems: 'flex-end',
                marginRight: 10,
              }}>
              <Image
                style={{width: 40, height: 40}}
                source={require('../../Assests/image/notification_white.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            borderRadius: 15,
            marginTop: 40,
            alignItems: 'center',
          }}></View>
        <View>
          <Text
            style={{
              color: color.white,
              textAlign: 'left',
              paddingLeft: 20,
              fontSize: 20,
              fontFamily: BOLD,
            }}>
            {t('Bronze - Monthly (₹4,999)')}
          </Text>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flexDirection: 'row', paddingLeft: 20}}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../Assests/image/calendar.png')}
              />
              <Text
                style={{
                  color: color.white,
                  justifyContent: 'flex-start',
                  marginHorizontal: 5,
                  fontSize: 14,
                  fontFamily: REGULAR,
                }}>
                {formatUnixTimestamp(
                  userInfo?.rentalOrderDetails?.startTime,
                  'DD MMM YYYY',
                )}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                right: 0,
                position: 'absolute',
                marginRight: 20,
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../Assests/image/timee.png')}
              />
              <Text
                style={{
                  color: color.white,
                  fontFamily: REGULAR,
                  justifyContent: 'flex-end',
                  marginHorizontal: 5,
                  fontSize: 14,
                }}>
                {formatUnixTimestamp(
                  userInfo?.rentalOrderDetails?.startTime,
                  'h:mm A',
                )}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Text
              style={{
                color: color.white,
                justifyContent: 'flex-start',
                fontFamily: BOLD,
                paddingLeft: 20,
                fontSize: 16,
              }}>
              {t('EV Pickup Process')}
            </Text>
            <Text
              style={{
                color: color.white,
                justifyContent: 'flex-end',
                fontFamily: BOLD,
                right: 0,
                position: 'absolute',
                marginRight: 20,
                fontSize: 16,
              }}>
              {userInfo?.allottedVehicleDetail?.regNumber}
            </Text>
          </View>
        </View>

        <View
          style={{
            borderRadius: 20,
            margin: 16,
            borderWidth: 1,
            backgroundColor: '#10281C',
            paddingBottom: 20,
            height: 300,
          }}>
          <View style={{flexDirection: 'row', height: 80, marginLeft: 20}}>
            <View>
              <Image
                style={styles.rideIcons}
                source={require('../../Assests/image/nav-fill.png')}
              />
              <View style={styles.dotedIcons} />
            </View>
            <View style={styles.secondBox}>
              <Text style={styles.startPointTxt} numberOfLines={1}>
                {' '}
                {t('Step 1')}
              </Text>
              <Text
                style={{
                  color: color.white,
                  marginTop: 10,
                  fontSize: 16,
                  fontFamily: BOLD,
                }}
                numberOfLines={1}>
                {' '}
                {t('Way to Operation Hub')}{' '}
              </Text>
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: color.white,
                  width: mobW * 0.75,
                  marginVertical: 20,
                  height: 1,
                }}></View>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginLeft: 20}}>
            <View style={{justifyContent: 'center', height: mobW * 0.2}}>
              <Image
                style={styles.rideIcons}
                source={require('../../Assests/image/search_fill.png')}
              />
              <View style={styles.dotedIcons} />
            </View>
            <View style={styles.secondBox}>
              <Text style={styles.startPointTxt} numberOfLines={1}>
                {' '}
                {t('Step 2')}
              </Text>
              <Text
                style={{
                  color: color.white,
                  marginTop: 10,
                  fontSize: 16,
                  fontFamily: BOLD,
                }}
                numberOfLines={1}>
                {' '}
                {t('Inspect Vehicle')}{' '}
              </Text>
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: color.white,
                  width: mobW * 0.75,
                  marginVertical: 20,
                  height: 1,
                }}></View>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginLeft: 20}}>
            <View>
              <View
                style={{
                  borderStyle: 'dotted',
                  height: 10,
                  borderLeftWidth: 2,
                  borderColor: color.white,
                  marginLeft: mobW * 0.015,
                }}
              />
              <Image
                style={{height: 20, width: 20}}
                source={require('../../Assests/image/start.png')}
              />
            </View>
            <View style={styles.secondBox}>
              <Text style={styles.startPointTxt} numberOfLines={1}>
                {' '}
                {t('Step 3')}
              </Text>
              <Text
                style={{
                  color: color.white,
                  fontSize: 16,
                  fontFamily: BOLD,
                }}
                numberOfLines={1}>
                {' '}
               {t(' Start your EV')}{' '}
              </Text>
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  position: 'relative',
                  width: mobW * 0.4,
                  height: 30,
                  marginTop: 20,
                }}
                onPress={() => {
                  navigation.navigate('home');
                }}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={['#00AF66', '#00AF66']}
                  width={mobW * 0.4}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    height: 40,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: 'center',
                      color: '#ffffff',
                      fontFamily: BOLD,
                    }}>
                    {t('CONTINUE')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            alignSelf: 'center',
            marginStart: 5,
            marginEnd: 5,
          }}>
          <Image
            style={{
              borderRadius: 15,
              width: Dimensions.get('screen').width,
              height: 180,
            }}
            source={require('../../Assests/image/accept_rej.png')}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('HelpandSupport')}
          style={RentalEVStyle.FifthContainer}>
          <Image
            style={{
              width: 50,
              height: 50,
              backgroundColor: '#001A0F',
              borderRadius: 40,
            }}
            source={supportImage}
          />
          <View>
            <Text
              style={{
                fontSize: 21,
                color: 'white',
              }}>
              {' '}
              {t('home_help_support')}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: 'white',
              }}>
              {' '}
              {t('home_click_here')}
            </Text>
          </View>
          <Image
            style={{
              width: 50,
              height: 50,
              backgroundColor: '#001A0F',
              borderRadius: 40,
            }}
            source={arrowRight}
          />
        </TouchableOpacity>
      </ScrollView>

      <View style={RentalEVStyle.bottomContainer}></View>
      <Modal transparent visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                setmodalVisible(false);
                navigation.navigate('Home');
              }}
              style={{
                right: 0,
                top: 40,
                marginHorizontal: 30,
                position: 'absolute',
              }}>
              <Image
                style={{width: 40, height: 40, resizeMode: 'cover'}}
                source={require('../../Assests/image/close_blue.png')}
              />
            </TouchableOpacity>
            <View
              style={{
                marginTop: -30,
                backgroundColor: color.black_BG,
                height: 100,
                width: 100,
                borderRadius: 50,
              }}>
              <Image
                style={{
                  width: 50,
                  resizeMode: 'cover',
                  margin: 25,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                source={require('../../Assests/image/ev_comp.png')}
              />
            </View>
            <Text
              style={{
                color: color.white,
                marginVertical: 25,
                fontSize: 20,
                fontFamily: BOLD,
              }}
              numberOfLines={1}>
              {' '}
              {t('Thanks for picking up the EV')}
            </Text>
            <Text
              style={{
                color: color.white,
                fontSize: 14,
                fontFamily: BOLD,
              }}
              numberOfLines={1}>
              {t("Go out there and make a difference")}
            </Text>
            <CustomPressable
              text={'Continue'}
              marginTop={20}
              btnWidth={mobW - 60}
              route={''}
              isGradient={true}
              backgroundColor="#10281C"
              onPress={() => {
                navigation.navigate('Home');
                setmodalVisible(false);
              }}
              position={'absolute'}
              bottom={7}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#00AF66'},
  rideIcons: {
    height: 20,
    width: 20,
    marginTop: 10,
  },
  dotedIcons: {
    borderStyle: 'dotted',
    height: 60,
    borderLeftWidth: 2,
    borderColor: color.white,
    marginLeft: mobW * 0.015,
  },
  secondBox: {
    justifyContent: 'space-between',
    height: 70,
    paddingVertical: mobW * 0.02,
    marginLeft: mobW * 0.03,
  },
  otpContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  roundedTextInput: {
    borderRadius: 4,
    borderWidth: 1,
    marginHorizontal: 5,
    borderColor: color.Border_color,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: color.white,
    backgroundColor: color.black_BG,
    width: 32,
    height: 32,
  },
  dotedIcons1: {
    borderStyle: 'dotted',
    height: mobW * 0.6,
    borderLeftWidth: 2,
    borderColor: color.white,
    marginLeft: mobW * 0.015,
  },
  startPointTxt: {color: '#fff', fontSize: 12, fontFamily: REGULAR},
  startRideTimeBox: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: mobW * 0.75,
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
    height: '100%',
    borderWidth: 1,
  },
  modalView: {
    backgroundColor: '#10281C',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: mobH / 5,
  },
});
