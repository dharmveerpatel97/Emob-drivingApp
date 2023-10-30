import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  NativeModules,
  Modal,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import RentalEVStyle from '../../styles/RentalEVStyle';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useState} from 'react';
import arrowRight from '../../Assests/image/arrowRight.png';
import supportImage from '../../Assests/image/supportN.png';
import {color} from '../../utils/color';
import {
  resetStack,
  mobW,
  mobH,
  locationPermission,
  getCurrentLocation,
  formattedRegistrationNumber,
} from '../../utils/commonFunction';
import {DrawerActions, useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {
  GetOperatorHUbDetails,
  getDriverProfileInfo,
} from '../../Redux/appSlice';
import StorageProvider from '../../Session/StorageProvider';
import RedirectionButton from '../component/RedirectionButton';
import {AcceptVehicle, RejectVehicle} from '../../Redux/rideSlice';
import CustomPressable from '../customComp/CustomPressable';
import Loader from '../customComp/Loader';
import {BOLD, REGULAR} from '../../utils/fonts';
import HomePlanDetailBox from '../component/HomeComp/HomePlanDetailBox';
global.userdata = null;

export default function WaytoOperationHub({navigation}) {
  const {SDKNAvigationModule} = NativeModules;
  const {t} = useTranslation();
  const [Visibility, SetVisibility] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [operationhubDetails, setoperationhubDetails] = useState({});
  const [centerCordinates, setCenterCordinates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => { 
      setIsLoading(true);
      getLiveLocation();
      getDriverProfile();
    }, []),
  );
  const getLiveLocation = async () => {
    const locPermissionDenied = await locationPermission();
    console.log('locPermissionDenied', locPermissionDenied);
    if (locPermissionDenied == 'granted') {
      const {latitude, longitude, heading} = await getCurrentLocation();
      setCenterCordinates([longitude, latitude]);
    } else {
      console.log('isLocPermissionDenied  error');
    }
  };

  function formatUnixTimestamp(timestamp, format) {
    const date = new Date(timestamp * 1000);
    return moment(date).format(format);
  }

  const getDriverProfile = async () => {
    dispatch(getDriverProfileInfo())
      .then(async res => {
        console.log('getDriverProfilegetDriverProfile', res);
        setUserInfo(res?.payload);
        dispatch(
          GetOperatorHUbDetails(
            res?.payload?.rentalOrderDetails?.operatorHubId,
          ),
        )
          .then(async res => {
            setIsLoading(false);
            setoperationhubDetails(res?.payload);
          })
          .catch(() => {
            setIsLoading(false);
          });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const [loaderType, setLoaderType] = useState(null);

  const btnAcceptVehicle = () => {
    setLoaderType('btnAcceptVehicle');
    console.log('userInfo?.rentalOrderDetails?.id',userInfo?.rentalOrderDetails?.id);
    dispatch(AcceptVehicle(userInfo?.rentalOrderDetails?.id))
      .then(response => {
        setLoaderType(null);
        console.log('AcceptVehicle response', response);
        if (response?.payload?.message == 'Success') {
          setModalVisible(true);
          setTimeout(() => {
            navigation.navigate('Home');
            setModalVisible(false);
          }, 10000);
        }
      })
      .catch(error => {
        setLoaderType(null);
        console.log('AcceptVehicle error', error);
      });
  };

  const btnRejectVehicle = () => {
    setLoaderType('btnRejectVehicle');
    dispatch(RejectVehicle(userInfo?.rentalOrderDetails?.id))
      .then(response => {
        console.log('RejectVehicle response', response);
        setLoaderType(null);
        if (response?.payload?.message == 'Success') {
          navigation.navigate('Home');
        }
      })
      .catch(error => {
        setLoaderType(null);
        console.log('RejectVehicle error', error);
      });
  };

  const openMap = () => {
    let destination = operationhubDetails?.address?.location;
    console.log('destination', destination);
    console.log('centerCordinates', centerCordinates);
    centerCordinates.length > 0 &&
      destination &&
      SDKNAvigationModule.NavigateMe(
        centerCordinates[1],
        centerCordinates[0],
        destination?.coordinates[1],
        destination?.coordinates[0],
      );
  };

  return (
    <SafeAreaView style={RentalEVStyle.container}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: mobH * 0.08}}
        scrollEnabled={true}>
        <Loader visible={isLoading} />
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor={color.black_BG}
        />
        {/* header */}
        <View style={styles.topContainer}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Pressable
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}>
              <Image
                style={{
                  width: mobW * 0.18,
                  height: mobW * 0.18,
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
            <View style={{flex: 1, marginTop: 15}}>
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
                  style={{width: mobW * 0.12, height: mobW * 0.12}}
                  source={require('../../Assests/image/notification_white.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* end header */}

        {userInfo?.rentalOrderDetails && (
          <HomePlanDetailBox
            rentalPlanName={userInfo?.rentalOrderDetails?.rentalPlanName}
            rentalPlanAmount={userInfo?.rentalOrderDetails?.amount}
            rentalPlanStartDate={userInfo?.rentalOrderDetails?.startTime}
            rentalPlanEndDate={userInfo?.rentalOrderDetails?.endTime}
            rentalPlanStartTime={userInfo?.rentalOrderDetails?.startTime}
            rentalPlanEndTime={userInfo?.rentalOrderDetails?.endTime}
          />
        )}

        {/* progress box */}
        <View style={RentalEVStyle.progressBox}>
          {/* step 1 */}
          <View style={{flexDirection: 'row', height: mobH * 0.24}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={RentalEVStyle.progressIcons}
                source={require('../../Assests/image/nav_unfill.png')}
              />
              <View style={RentalEVStyle.wayToOperationDottedLine1} />
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={RentalEVStyle.startPointTxt} numberOfLines={1}>
                {t('Step 1')}
              </Text>
              <Text style={RentalEVStyle.progresSubHead} numberOfLines={1}>
                {t('Way to Operation Hub')}
              </Text>
              <Text style={RentalEVStyle.startPointTimeTxt}>
                {t(
                  'Get directions to the exact location where your EV is parked.',
                )}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={{
                    height: mobW * 0.038,
                    marginTop: 15,
                    width: mobW * 0.038,
                    resizeMode: 'contain',
                  }}
                  source={require('../../Assests/image/location1.png')}
                />
                <Text
                  style={{
                    color: color.white,
                    marginTop: 10,
                    fontSize: 14,
                    marginLeft: 10,
                    lineHeight: 20,
                    fontWeight: '500',
                    fontFamily: REGULAR,
                    marginRight: mobW * 0.04,
                    width: '70%',
                  }}>
                  {operationhubDetails?.address?.street +
                    ' ' +
                    operationhubDetails?.address?.city +
                    ' ' +
                    operationhubDetails?.address?.state +
                    ',' +
                    operationhubDetails?.address?.pinCode}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    openMap();
                  }}
                  activeOpacity={0.8}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 38 / 2,
                    backgroundColor: '#363B45',
                    justifyContent: 'center',
                    marginTop: 15,
                  }}>
                  <Image
                    style={{width: 20, height: 20, alignSelf: 'center'}}
                    source={require('../../Assests/image/direction_1.png')}
                  />
                </TouchableOpacity>
              </View>

              {/* <TouchableOpacity
                style={{
                  marginTop: 10,
                }}
                onPress={() => {
                  navigation.navigate('WayHub', {
                    btnname: 'I HAVE ARRIVED',
                    screenname: 'Accept_reject_operation',
                  });
                }}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={['#69A0F3', '#00AF66']}
                    width={mobW*0.78}
                    style={RentalEVStyle.linearButton}>
                      <Text style={{
                        color:color.white,fontWeight:'600',marginRight:12
                      }}>WAY TO OPERATION HUB</Text>
                      <Image source={require('../../Assests/image/direction1.png')} style={{height:20,width:20,marginLeft:12}}/>
                  </LinearGradient>
             
              </TouchableOpacity> */}
              <View style={RentalEVStyle.divider}></View>
            </View>
          </View>
          {/* step 2 */}
          {/* step 2 */}
          <View style={{flexDirection: 'row', height: mobH * 0.24}}>
            {/* <View style={{alignItems:'center',justifyContent:"center"}}> */}
            <Image
              style={RentalEVStyle.progressIcons}
              source={require('../../Assests/image/search_unfill.png')}
            />
            {/* <View
                style={RentalEVStyle.acceRejectProgressDotline2}
              /> */}
            {/* </View> */}
            <View style={{marginLeft: 10}}>
              <Text style={RentalEVStyle.startPointTxt} numberOfLines={1}>
                {t('Step 2')}
              </Text>
              <Text style={RentalEVStyle.progresSubHead} numberOfLines={1}>
                {t('Inspect Vehicle')}
              </Text>
              <Text style={RentalEVStyle.startPointTimeTxt}>
                {t('Kindly inspect your vehicle thoroughly before accepting.')}
              </Text>
              <View style={{flexDirection: 'row', height: 40, marginTop: 20}}>
                <TouchableOpacity
                  onPress={() => {
                    btnRejectVehicle();
                  }}
                  style={RentalEVStyle.vehicleAcceptBtn}>
                  {loaderType === 'btnRejectVehicle' ? (
                    <ActivityIndicator color={color.white} />
                  ) : (
                    <Text style={RentalEVStyle.vehicleAcceptBtnTxt}>
                      {' '}
                      {t('REJECT')}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    btnAcceptVehicle();
                  }}
                  style={RentalEVStyle.vehicleRejectBtn}>
                  {loaderType === 'btnAcceptVehicle' ? (
                    <ActivityIndicator color={color.white} />
                  ) : (
                    <Text style={RentalEVStyle.vehicleAcceptBtnTxt}>
                      {' '}
                      {t('ACCEPT')}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              {/* <View
                style={RentalEVStyle.divider}
              /> */}
            </View>
          </View>
          {/* <View style={{flexDirection: 'row', height: mobH * 0.12}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={RentalEVStyle.progressIcons}
                source={require('../../Assests/image/search_unfill.png')}
              />
              <View style={RentalEVStyle.wayToOperationDottedLine2} />
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={RentalEVStyle.startPointTxt} numberOfLines={1}>
                Step 2
              </Text>
              <Text style={RentalEVStyle.progresSubHead} numberOfLines={1}>
                Inspect Vehicle
              </Text>
              <View style={RentalEVStyle.divider} />
            </View>
          </View> */}
          {/* step 3 */}
          {/* <View style={{flexDirection: 'row', height: mobH * 0.12}}>
            <View>
              <Image
                style={{
                  height: mobH * 0.025,
                  width: mobH * 0.025,
                }}
                source={require('../../Assests/image/start_unfill.png')}
              />
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={RentalEVStyle.startPointTxt} numberOfLines={1}>
                Step 3
              </Text>
              <Text style={RentalEVStyle.progresSubHead} numberOfLines={1}>
                Start your EV
              </Text>
              <View style={RentalEVStyle.divider} />
            </View>
          </View> */}
        </View>
        {/*end progress box */}

        <View
          style={{
            width: mobW * 0.94,
            backgroundColor: color.black_medum,
            borderRadius: 10,
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 35,
          }}>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: color.white,
                fontFamily: 'Roboto-Bold',
              }}>
              {t('Drive 25 trips,')}
              {'\n'}
              {t('Make 250 Extra')}
            </Text>

            <Text
              style={{
                fontSize: 13,
                color: color.white,
                marginTop: 10,
                lineHeight: 20,
                fontFamily: 'Roboto-Regular',
              }}>
              {t('inServiceBoxdes1')} {'\n'}
              {t('inServiceBoxdes2')} {'\n'}
              {t('inServiceBoxdes3')}
            </Text>
          </View>
          <Image
            source={require('../../Assests/image/auto.png')}
            style={{
              height: mobW * 0.35,
              width: mobW * 0.35,
              resizeMode: 'contain',
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('HelpandSupport')}
          style={RentalEVStyle.FifthContainer}>
          <View
            style={{
              backgroundColor: color.black_BG,
              height: 40,
              width: 40,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={supportImage}
            />
          </View>
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

        <View style={RentalEVStyle.bottomContainer}>
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
        </View>
      </ScrollView>

      <Modal transparent visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                console.log('setModalVisiblesetModalVisible', navigation);
                navigation.navigate('Home');
                setModalVisible(false);
              }}
              style={{
                right: 15,
                top: 20,
                position: 'absolute',
                zIndex: 99,
              }}>
              <Image
                style={{width: 30, height: 30, resizeMode: 'cover'}}
                source={require('../../Assests/image/close_blue.png')}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: color.black_BG,
                borderRadius: 50,
                marginTop: 50,
                padding: 20,
              }}>
              <Image
                style={{
                  width: 45,
                  resizeMode: 'cover',
                  height: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                source={require('../../Assests/image/ev_comp.png')}
              />
            </View>
            <Text
              style={{
                color: color.white,
                marginTop: 25,
                marginBottom: 10,
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
                marginBottom: 20,
                fontSize: 14,
                fontFamily: BOLD,
              }}
              numberOfLines={1}>
              {t('Go out there and make a difference')}
            </Text>
            {/* <CustomPressable
              text={'Continue'}
              marginTop={50}
              btnWidth={mobW - 90}
              route={''}
              isGradient={true}
              backgroundColor={'#10281C'}
              onPress={() => {
                navigation.navigate('Home');
                // navigation.navigate('Operation_otp');
                setModalVisible(false);
              }}
              position={'relative'}
              bottom={10}
            /> */}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: mobW * 0.02,
    marginTop: mobH * 0.056,
  },
  topContainer_text: {
    display: 'flex',
    justifyContent: 'center',
    width: '62%',
  },
  innerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  modalView: {
    position: 'absolute',
    width: '92%',
    backgroundColor: '#10281C',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 25,
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
