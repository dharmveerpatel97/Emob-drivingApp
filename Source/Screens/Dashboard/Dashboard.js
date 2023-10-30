import { 
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  Image,
  Pressable, 
  TouchableOpacity,
  StatusBar,
  ScrollView, 
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
getDriverEarning,getRideHistory,
} from '../../Redux/rideSlice';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import {useSelector, useDispatch} from 'react-redux';
import {localNotificationService} from '../../FCM_notification/LocalNotificationService';
import RentalEVStyle from '../../styles/RentalEVStyle'; 
import React, {useEffect, useState} from 'react'; 
import view_plan from '../../Assests/image/view_plan.png';
import navigationImage from '../../Assests/image/navigation.png';
import rupee from '../../Assests/image/rupee.png';
import arrowRight from '../../Assests/image/arrowRight.png';
import supportImage from '../../Assests/image/supportN.png';
import auto from '../../Assests/image/auto.png';
import {color} from '../../utils/color';
import {mobW, mobH, formatDate} from '../../utils/commonFunction';
import {DrawerActions, useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {fcmService} from '../../FCM_notification/FCMService';
import CustomPressable from '../customComp/CustomPressable';
import {getDriverProfileInfo, setFCMToken} from '../../Redux/appSlice';
import {useTranslation} from 'react-i18next'; 
import AlertModal from '../component/AlertModal';
import LinearGradient from 'react-native-linear-gradient';
import {reAssignEV, refundRequest} from '../../Redux/evSlice';
import Loader from '../customComp/Loader';

global.userdata = null;

export default function Dashboard({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const ride = useSelector(state => state.ride); 
  const [Visibility, SetVisibility] = useState(false); 
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefundConfirmModelOpen, setIsRefundConfirmModelOpen] = useState(false);
  const [isRefundSuccesModelOpen, setIsRefundSuccesModalOpen] = useState(false);

  const onRegister = async token => {
    console.log('onRegister', token);
    addFcmToken(token);
  };

  const setupNotification = () => {
    console.log('setupNotification');
    try {
      fcmService.register(
        token => onRegister(token),
        notify => onNotification(notify),
        notify => onOpenNotification(notify),
      );
      localNotificationService.configure(notify => {
        onOpenNotification(notify);
      });
    } catch (error) {
      console.log('error: sad' + error);
    }
  };
  let notificationMessageId;

  const onNotification = async notify => {
    console.log('onNotificationSplash', notify);
    localNotificationService.cancelAllLocalNotifications();
    let uniquedNotifId = Math.floor(Math.random() * 1000 + 1);
    const options = {
      soundName: 'notify_ring.wav',
      playSound: true,
    };
    if (notify.title) {
      if (notificationMessageId != notify.messageId) {
        localNotificationService.showNotification(
          uniquedNotifId,
          notify.title,
          notify.message,
          notify,
          options,
        );
        notificationMessageId = notify.messageId;
      }
      if (notify?.data) {
      }
    }
  };

  const addFcmToken = async fcmToken => {
    StorageProvider.saveItem('fcmToken', fcmToken);
    let isNotificationAdded = await StorageProvider.getItem(
      'isNotificationAdded',
    );
    console.log('isNotificationAdded', isNotificationAdded);
    if (fcmToken && isNotificationAdded != 'true') {
      dispatch(setFCMToken({fcmToken: fcmToken}));
    }
  };

  const onOpenNotification = async notify => {
    getUserProfileInfo();
    console.log('notify', notify);
    console.log(
      '---notification typessss----',
      notify?.data?.notificationTopic,
    );
    if (notify?.data) {
      if (notify?.data?.notificationTopic == 'vehicleAssigned') {
        navigation.navigate('WaytoOperationHub');
      } else if (notify?.data?.notificationTopic == 'rideCancelled') {
      } else if (notify?.data?.notificationTopic == 'rideRequestDriver') {
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      getUserProfileInfo();
    }, []),
  );

  useEffect(() => {
    setupNotification();
    dispatch(getDriverEarning());
    dispatch(getRideHistory());
  }, []);

  const getUserProfileInfo = async () => {
    dispatch(getDriverProfileInfo())
      .then(async res => {
        setUserInfo(res?.payload);
        userdata = res?.payload;
        if (!res?.payload?.rentalOrderDetails) {
          setTimeout(() => {
            onDuty();
          }, 5000);
        }
        if (res?.payload?.rentalOrderDetails?.status === 'assigned') {
          navigation.navigate('WaytoOperationHub');
        }
        setIsLoading(false);
        await StorageProvider.setObject('userInfo', res?.payload);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onDuty = () => {
    SetVisibility(true);
    setTimeout(() => {
      SetVisibility(false);
    }, 15000);
  };

  const onPageRefresh = () => {
    setIsRefreshing(true);
    dispatch(getDriverProfileInfo())
      .then(async res => {
        setUserInfo(res?.payload);
        userdata = res?.payload;
        setIsRefreshing(false);
        if (res?.payload?.rentalOrderDetails?.status === 'assigned') {
          navigation.navigate('WaytoOperationHub');
        }
        await StorageProvider.setObject('userInfo', res?.payload);
      })
      .catch(() => {
        setIsRefreshing(false);
      });
  };

  const onPageRefresh1 = () => {
    dispatch(getDriverProfileInfo())
      .then(async res => {
        setUserInfo(res?.payload);
        userdata = res?.payload;
        if (res?.payload?.rentalOrderDetails?.status === 'assigned') {
          navigation.navigate('WaytoOperationHub');
        }
        await StorageProvider.setObject('userInfo', res?.payload);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const [loaderType, setLoaderType] = useState(null);

  const btnRefundRequest = () => {
    setLoaderType('btnRefundRequest');
    dispatch(refundRequest(userInfo?.rentalOrderDetails?.id))
      .then(res => {
        console.log('btnRefundRequest result', res);
        setIsRefundConfirmModelOpen(false);
        setIsRefundSuccesModalOpen(true);
        onPageRefresh1();
        setLoaderType(null);
      })
      .catch(error => {
        setLoaderType(null);
        console.log('btnRefundRequest error', error);
      });
  };

  const btnreassignEv = () => {
    setLoaderType('btnreassignEv');
    dispatch(reAssignEV(userInfo?.rentalOrderDetails?.id))
      .then(res => {
        console.log('btnreassignEv result', res);
        // onPageRefresh();
        onPageRefresh1()
        setLoaderType(null);
      })
      .catch(error => {
        setLoaderType(null);
        console.log('btnreassignEv error', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={isLoading} />
      <ScrollView
        colors={['red', 'green', 'blue']}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              onPageRefresh();
            }}
          />
        }
        contentContainerStyle={{flexGrow: 1, paddingBottom: mobH * 0.085}}
        scrollEnabled={true}>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor={color.black_BG}
        />

        {/* header */}
        <View style={styles.topContainer}>
          <View style={{flexDirection: 'row', flex: 1, marginTop: 20}}>
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

            <View style={styles.topContainer_text}>
              <Text style={styles.innerText} numberOfLines={1}>
                {' '}
                {t('hello')}, {userInfo?.firstName}!
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  marginLeft: 5,
                  opacity: 0.7,
                  fontFamily: REGULAR,
                }}>
                {t('hometag')}...
              </Text>
            </View>
            <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Notification');
                }}
                style={{
                  right: 10,
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end',
                }}>
                <Image
                  style={{width: mobW * 0.1, height: mobW * 0.1}}
                  source={require('../../Assests/image/notification_white.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* end header */}

        {/* refund and return box */}
        {(
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#00AF66', '#00AF66']}
            width={mobW * 0.85}
            style={{alignSelf: 'center', borderRadius: 10}}>
            <View
              style={{
                justifyContent: 'center',
                borderRadius: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  marginHorizontal: 50,
                  marginVertical: 25,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: color.white,
                      marginTop: 10,
                      lineHeight: 20,
                      fontFamily: REGULAR,
                    }}>
                    {t('home_request_refund_des')}{'\n'}{t('home_request_refund_des1')} {'\n'}{t('home_request_refund_des2')}
                  </Text>
                  <Image
                    source={require('../../Assests/image/auto.png')}
                    style={{
                      height: 80,
                      width: 100,
                      resizeMode: 'contain',
                      marginTop: 10,
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 20,
                    width: mobW * 0.76,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      userInfo?.rentalOrderDetails?.status == 'earlyReturned'
                        ? setIsRefundConfirmModelOpen(true)
                        : null;
                    }}
                    style={{
                      width: mobW * 0.36,
                      borderWidth: 1,
                      borderColor:
                        userInfo?.rentalOrderDetails?.status == 'earlyReturned'
                          ? color.white
                          : color.white_50,
                      paddingVertical: 12,
                      borderRadius: 9,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}> 
                      <Text
                        style={{
                          color:
                            userInfo?.rentalOrderDetails?.status ==
                            'earlyReturned'
                              ? color.white
                              : color.white_50,
                          fontWeight: '600',
                        }}>
                        {userInfo?.rentalOrderDetails?.status == 'earlyReturned'
                          ? 'Request Refund'
                          : 'Refund Requested'}
                      </Text> 
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      userInfo?.rentalOrderDetails?.status === 'earlyReturned'
                        ? btnreassignEv()
                        : null;
                    }}
                    style={{
                      width: mobW * 0.36,
                      backgroundColor: '#fff',
                      paddingVertical: 12,
                      borderRadius: 9,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {loaderType === 'btnreassignEv' ? (
                      <ActivityIndicator color={color.white} />
                    ) : (
                      <Text style={{color: '#72a4f3', fontWeight: '600'}}>
                        Request Vehicle
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </LinearGradient>
        )}
        {/* end refund and return box */}

        {userInfo?.rentalOrderDetails?.status == 'inService' && (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              alignSelf: 'center',
              marginTop: 10,
              marginEnd: 10,
            }}>
            <Image
              style={{
                borderRadius: 15,
                width: Dimensions.get('screen').width,
                height: 180,
                marginStart: 10,
                marginEnd: 10,
              }}
              source={require('../../Assests/image/banner.png')}
            />
          </TouchableOpacity>
        )}

        {/* Not have rental order box */}
        {!userInfo?.rentalOrderDetails && (
          <View
            style={{
              justifyContent: 'center',
              borderRadius: 15,
              alignItems: 'center',
            }}>
            <ImageBackground
              style={{width: '100%', height: 260, resizeMode: 'contain'}}
              source={require('../../Assests/image/banner_dash.png')}>
              <View
                style={{
                  flexDirection: 'column',
                  marginHorizontal: 50,
                  marginVertical: 25,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: color.white,
                    fontFamily: BOLD,
                  }}>
                  Rent An EV and
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: color.white,
                    fontFamily: BOLD,
                  }}>
                  Start Earning
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: color.white,
                    marginTop: 10,
                    lineHeight: 20,
                    fontFamily: REGULAR,
                  }}>
                  Select you plan in 3 easy steps: {'\n'}1. Choose Operation
                  Hub. {'\n'}2. Select suitable dates. {'\n'}3. Choose Plan &
                  Start your journey.
                </Text>

                <TouchableOpacity
                  style={{height: 50, marginTop: 20}}
                  onPress={() => {
                    navigation.navigate('Operationhub');
                  }}>
                  <Image
                    style={{
                      width: '100%',
                      resizeMode: 'contain',
                      height: 50,
                    }}
                    source={view_plan}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        )}
        {/*End Not have rental order box */}

        {/* rental order related box */}
        {(userInfo?.rentalOrderDetails?.status == 'ordered' ||
          userInfo?.rentalOrderDetails?.status == 'reserved') && (
          <View>
            <View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: color.white,
                  textAlign: 'left',
                  fontWeight: '800',
                  paddingLeft: 20,
                  fontSize: 20,
                  fontFamily: BOLD,
                }}>
                {userInfo?.rentalOrderDetails?.rentalPlanName}
              
              </Text>
              <Text
                style={{
                  color: color.white,
                  right: 0,
                    position: 'absolute',
                    marginRight: 20,
                  fontWeight: '800',
                  paddingLeft: 20,
                  fontSize: 20,
                  fontFamily: BOLD,
                }}>
                 {'  ₹'}
                {userInfo?.rentalOrderDetails?.amount}
                {'/-'}
              </Text>

              </View>

              <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text
                  style={{
                    color: color.white,
                    opacity: 0.8,
                    fontWeight: '700',
                    justifyContent: 'flex-start',
                    paddingTop: 10,
                    paddingLeft: 20,
                    fontSize: 12,
                    fontFamily: REGULAR,
                  }}>
                  {'EV Pick Up Details'}
                </Text>
                <Image
                  style={{
                    width: 100,
                    height: 30,
                    right: 0,
                    position: 'absolute',
                    marginRight: 20,
                  }}
                  source={require('../../Assests/image/evInProcess.png')}
                />

                {/* } */}
              </View>

              <View style={{flexDirection: 'row', marginTop: 25}}>
                <View style={{flexDirection: 'row', paddingLeft: 20}}>
                  <Image
                    style={{width: 20, height: 20}}
                    source={require('../../Assests/image/calendar.png')}
                  />
                  <Text
                    style={{
                      color: color.white,
                      justifyContent: 'flex-start',
                      paddingLeft: 10,
                      marginHorizontal: 5,
                      fontSize: 14,
                      fontFamily: REGULAR,
                    }}>
                    {formatDate(
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
                    {formatDate(
                      userInfo?.rentalOrderDetails?.startTime,
                      'h:mm A',
                    )}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                // navigation.navigate('WaytoOperationHub');
              }}>
              <View
                style={{
                  borderWidth: 1.5,
                  borderColor: '#FF940185',
                  borderRadius: 10,
                  backgroundColor: color.cardColor,
                  marginHorizontal: 20,
                  marginTop: 15,
                  marginBottom: 5,
                }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    style={{
                      width: 130,
                      height: 80,
                      resizeMode: 'cover',
                      marginTop: 25,
                      marginBottom: 10,
                    }}
                    source={require('../../Assests/image/wait_ev_app.png')}
                  />
                </View>
                {userInfo?.rentalOrderDetails?.status == 'ordered' ? (
                  <Text style={styles.listTitle1}>
                    {' '}
                    Kindly visit your chosen operation hub to pay for your
                    rental order
                  </Text>
                ) : (
                  <Text style={styles.listTitle1}>
                    {' '}
                    We have accepted your booking request. Your vehicle will be
                    assigned 2 hrs prior to your booking time
                  </Text>
                )}

                <Text style={styles.listTitle1}> Thank You</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {/*End  rental order related box */}

        {/* Earning and mytrip box */}
        {userInfo?.rentalOrderDetails?.status === 'inService' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 16,
              marginTop: 20,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('MyTrips');
              }}
              style={styles.ThirdContainer_child}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginTop: 5,
                }}>
                <Image
                  style={{
                    width: 44,
                    resizeMode: 'contain',
                    height: 44,
                    backgroundColor: '#001A0F',
                    borderRadius: 40,
                  }}
                  source={navigationImage}
                />
                <Image
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: '#001A0F',
                    borderRadius: 40,
                  }}
                  source={arrowRight}
                />
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  marginHorizontal: 20,
                  marginTop: 10,
                }}>
                <Text style={{color: 'white', fontSize: 15}}>
                  {t('home_my_trip')}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: BOLD,
                    fontSize: 24,
                  }}>
                  {ride?.rideHistory?.totalCount
                  ? ride?.rideHistory?.totalCount
                  : 0}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('MyTrips');
              }}
              style={styles.ThirdContainer_child}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginTop: 5,
                }}>
                <Image
                  style={{
                    width: 44,
                    resizeMode: 'contain',
                    height: 44,
                    backgroundColor: '#001A0F',
                    borderRadius: 40,
                  }}
                  source={rupee}
                />
                <Image
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: '#001A0F',
                    borderRadius: 40,
                  }}
                  source={arrowRight}
                />
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  marginHorizontal: 20,
                  marginTop: 10,
                }}>
                <Text style={{color: 'white', fontSize: 15}}>
                  {t('home_my_earning')}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: BOLD,
                    fontSize: 24,
                  }}>
                  {'₹ '}
                {ride?.driverTotalEarning == 0 ? '0' : ride?.driverTotalEarning.toFixed(2)}
            
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {/*End Earning and mytrip box */}

        {/* Veehicle box */}
        {userInfo?.allottedVehicleDetail &&
          userInfo?.rentalOrderDetails?.status == 'inService' && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('MyEV');
              }}
              style={RentalEVStyle.FifthContainer}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                }}
                source={auto}
              />
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: color.white_50,
                  }}>
                  Current Vehicle Allotted
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    // fontWeight: 'bold',
                    color: 'white',
                  }}>
                  {userInfo?.allottedVehicleDetail?.regNumber}
                </Text>
              </View>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: '#001A0F',
                  borderRadius: 40,
                }}
                source={arrowRight}
              />
            </TouchableOpacity>
          )}
        {/*End Veehicle box */}

        {/* help and support box */}
        {userInfo?.rentalOrderDetails?.status != 'inService' && (
          <TouchableOpacity  onPress={() => {
            navigation.navigate('Support')
          
           }}  style={[RentalEVStyle.FifthContainer, {marginBottom: 10}]}>
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
                  // fontWeight: 'bold',
                  color: 'white',
                }}>
                {' '}
                {t('home_click_here')}
              </Text>
            </View>
            <Image
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#001A0F',
                borderRadius: 40,
              }}
              source={arrowRight}
            />
          </TouchableOpacity>
        )}
        {/*End help and support box */}
      </ScrollView>

      {userInfo?.rentalOrderDetails?.status === 'inService' ||
      userInfo?.rentalOrderDetails?.status === 'earlyReturned' ? (
        <View
          style={{
            height: mobH * 0.08,
            backgroundColor: '#10281C',
            paddingHorizontal: 30,
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <CustomPressable
            text={'GO ON DUTY'}
            marginTop={20}
            btnWidth={mobW - 140}
            route={''}
            isGradient={true}
            backgroundColor="#10281C"
            onPress={() => {
              // setmodalVisible(false);
            }}
            position={'relative'}
            bottom={7}
          />
          <TouchableOpacity   onPress={() => {
           navigation.navigate('Support')
        
              }}
            activeOpacity={0.7}
            style={{
              width: 45,
              height: 45,
              borderRadius: 8,
              borderColor: color.purpleborder,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={supportImage}
              style={{height: 25, width: 25}}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bottomContainer}>
          {Visibility ? (
            <View
              style={{
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity>
                <Image
                  style={{width: 300, height: 70, resizeMode: 'contain'}}
                  source={require('../../Assests/image/rentev.png')}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          <View
            style={{
              height: mobH * 0.08,
              alignItems: 'center',
              backgroundColor: '#10281C',
              justifyContent: 'space-between',
              paddingHorizontal: 30,
              borderTopEndRadius: 20,
              borderTopStartRadius: 20,
            }}>
            <CustomPressable
              text={t('ON DUTY')}
              marginTop={0}
              btnWidth={200}
              route={''}
              isGradient={false}
              backgroundColor="#10281C"
              onPress={() => {
                onDuty();
              }}
              position={'relative'}
              bottom={0}
            />
          </View>
        </View>
      )}

      <AlertModal
        isSuccessAlert={false}
        loading={loaderType=='btnRefundRequest' ? true:false}
        isVisible={isRefundConfirmModelOpen}
        alertMsg={`Refund generated your vehicle is ₹ ${
          userInfo?.rentalOrderDetails?.amount
            ? userInfo?.rentalOrderDetails?.amount
            : 0
        }. Are you sure you wish to request refund ?`}
        alertTitle="Request Refund"
        yesButtonText="YES"
        noButtonText="NO"
        noButton={() => {
          setIsRefundConfirmModelOpen(false);
        }}
        yesButton={() => {
          btnRefundRequest(); 
        }}
      />
      <AlertModal
        isSuccessAlert={true}
        isVisible={isRefundSuccesModelOpen}
        alertMsg="We are processing your refund request. Kindly collect your refund from Operator."
        alertTitle="Refund Request is in Process"
        yesButtonText="YES"
        yesButton={() => {
          setIsRefundSuccesModalOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00AF66',
  },
  topContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    marginVertical: 40,
    marginHorizontal: 16,
  },
  listTitle1: {
    width: '100%',
    textAlign: 'center',
    lineHeight: 25,
    marginVertical: 10,
    color: color.white,
    paddingHorizontal: 30,
    fontSize: 14,
    fontFamily: REGULAR,
  },
  topContainer_text: {
    display: 'flex',
    justifyContent: 'center',
    marginStart: 25,
    width: '62%',
  },
  innerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  ThirdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 20,
  },
  ThirdContainer_child: {
    width: '47%',
    height: 130,
    borderRadius: 10,
    borderColor: '#10281C',
    justifyContent: 'space-evenly',
    borderWidth: 2,
    backgroundColor: '#10281C',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'column',
    right: 0,
    borderRadius: 10,
  },
  modalView: {
    position: 'absolute',
    width: '85%',
    backgroundColor: '#10281C',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

