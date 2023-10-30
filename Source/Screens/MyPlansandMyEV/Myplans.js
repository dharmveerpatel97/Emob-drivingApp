import React, { useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text, 
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import CustomPressable  from '../customComp/CustomPressable';
import {color} from '../../utils/color';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import {BOLD, REGULAR} from '../../utils/fonts';
import Check from '../../Assests/image/Check.png';
import {useTranslation} from 'react-i18next';
import {
  getDriverProfileInfo,
  getPreviousRentalPlan,
  GetOperatorHUbDetails
} from '../../Redux/appSlice';
import {useDispatch} from 'react-redux';
import {formatDate, getPriceWithSymbol} from '../../utils/commonFunction';
export default function Myplans({navigation}) {
  const {t} = useTranslation();
  const [rentalOrderDetails, setRentalOrderDetails] = useState();
  const [previousPlanList, setPreviousPlanList] = useState();
  const [operationhubDetails, setoperationhubDetails] = useState({});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUserProfileInfo();
      getPreviousRentalOrder();
    });
    return unsubscribe;
  }, [navigation]);

  const dispatch = useDispatch();
  const capitalizeFirstCharacter = str => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getUserProfileInfo = async () => {
    dispatch(getDriverProfileInfo()).then(async res => {
      let rentalOrderDetails1 = res?.payload;
      if (rentalOrderDetails1?.rentalOrderDetails) {
        setRentalOrderDetails({...rentalOrderDetails1});
        dispatch(
          GetOperatorHUbDetails(
            rentalOrderDetails1?.rentalOrderDetails.operatorHubId,
          ),
        ).then(async res => {
          setoperationhubDetails(res?.payload);
        });
      }
    });
  };

  const getPreviousRentalOrder = async () => {
    dispatch(getPreviousRentalPlan()).then(res => {
      const myArray = res?.payload?.rentalHistory;
      if (myArray.length > 0) {
        myArray.shift();
        setPreviousPlanList([...myArray]);
      }
      console.log('getPreviousRentalPlan', res);
    });
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          marginHorizontal: 15,
          borderRadius: 10,
          flexDirection: 'row',
          height: 24,
          marginVertical: 10,
        }}>
        <Image
          style={{width: 24, marginHorizontal: 15, height: 24}}
          source={Check}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            marginVertical: 2,
            fontFamily: REGULAR,
          }}>
          {' '}
          {item.title}{' '}
        </Text>
      </View>
    );
  };

  const renderItem_offer = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PreviousPlanDetails', {
            value: item,
          });
        }}
        style={{
          marginHorizontal: 16,
          backgroundColor: '#10281C',
          paddingHorizontal: 20,
          borderColor:color.Blue_light,
          borderWidth:1,
          borderRadius: 10,
          paddingVertical: 10,
          marginVertical: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: color.white, fontSize: 16}}>
            {capitalizeFirstCharacter(item?.rentalPlanDetail[0]?.planName)}{' '}
            {' - '}{' '}
            {capitalizeFirstCharacter(item?.rentalPlanDetail[0]?.planType)}
          </Text>
          <Image
            source={require('../../Assests/image/next.png')}
            style={{height: 12, width: 12}}
          />
        </View>

        {item?.vehicleDetails && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 40,
            }}>
            <View style={{width: '50%'}}>
              <Text style={{color: color.white, fontSize: 14, opacity: 0.7}}>
                {t('EV Registeration Number')}
              </Text>
            </View>
            <Text style={{color: color.white, fontSize: 15, marginLeft: 20}}>
              {item?.vehicleDetails[0]?.regNumber}
            </Text>
          </View>
        )}

        <View
          style={{
            marginLeft: 5,
            marginVertical: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../Assests/image/pickup.png')}
              style={{height: 10, width: 10}}
            />
            <Text style={{color: color.white_50, fontSize: 12, marginLeft: 10}}>
              {t('Pickup Location')}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={{
              color: color.white,
              fontSize: 14,
              marginLeft: 19,
              marginTop: 5,
            }}>
            {item?.operatorHubDetail[0].address?.street}
            {', '}
            {item?.operatorHubDetail[0].address?.city}
          </Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              marginLeft: 5,
              marginTop: 15,
              borderColor: color.white_50,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 60,
          }}>
          <View style={{width: '30%',flexDirection:'column'}}>
            <Text
              style={{
                color: color.white,
                fontSize: 14,
                opacity: 0.8,
                lineHeight: 20,
              }}>
              {formatDate(item?.startTime, 'ddd, DD MMM YY')}
            </Text>
            <Text
              style={{
                color: color.white,
                fontSize: 14,
                opacity: 0.8,
                lineHeight: 20,
              }}>
              {formatDate(item?.startTime, 'hh:mm A')}
            </Text>
          </View>
          <View
            style={{
              width: '20%',opacity:0.7,
              justifyContent: 'center',
              alignItems: 'center',
              height: 40,
            }}>
            <Image
              source={require('../../Assests/image/right_icon.png')}
              style={{width: 25, resizeMode: 'contain', opacity: 0.8}}
            />
          </View>
          <View style={{width: '40%',flexDirection:'column'}}>
            <Text
              style={{
                color: color.white,
                fontSize: 14,
                width: '100%',
                opacity: 0.8,
                lineHeight: 20,
              }}>
              {formatDate(item?.endTime, 'ddd, DD MMM YY')}
            </Text>
            <Text
              style={{
                color: color.white,
                fontSize: 14,
                width: '100%',
                opacity: 0.8,
                lineHeight: 20,
              }}>
              {formatDate(item?.endTime, 'hh:mm A')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{paddingBottom: mobH * 0.02, flexGrow: 1}}
        scrollEnabled={true}>
        <StatusBar translucent barStyle="light-content" />
        <View style={styles.headerBox}>
          <View style={styles.headerSubBox}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="arrowleft" color={color.white} size={24} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.headerTitle}> {t('My Plans')} </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Notification');
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <Image
                style={{width: 40, height: 40}}
                source={require('../../Assests/image/notification_white.png')}
              />
            </TouchableOpacity>
          </View>

          {/* plan details */}
          {rentalOrderDetails?.rentalOrderDetails ? (
            <View>
              <View
                style={{
                  marginHorizontal: 30,
                  flexDirection: 'row',
                  marginTop: 20,
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.headerTitle1}>
                  {t('Your plan start on')}
                </Text>
                <Text style={styles.headerTitle1}>
                  {formatDate(
                    rentalOrderDetails?.rentalOrderDetails?.startTime,
                    'DD MMM YYYY, hh:mm A',
                  )}
                </Text>
              </View>
              <View
                style={{
                  marginHorizontal: 30,
                  flexDirection: 'row',
                  marginTop: 20,
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.headerTitle1}>
                  {t('Your plan expires on')}
                </Text>
                <Text style={styles.headerTitle1}>
                  {formatDate(
                    rentalOrderDetails?.rentalOrderDetails?.endTime,
                    'DD MMM YYYY, hh:mm A',
                  )}
                </Text>
              </View>

              {rentalOrderDetails?.allottedVehicleDetail && (
                <View
                  style={{
                    marginHorizontal: 30,
                    flexDirection: 'row',
                    marginTop: 20,
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.headerTitle1}>
                    {t('EV Registeration Number')}
                  </Text>

                  <Text style={styles.headerTitle1}>
                    {rentalOrderDetails?.allottedVehicleDetail?.regNumber}
                  </Text>
                </View>
              )}
              <View
                style={{
                  marginHorizontal: 30,
                  flexDirection: 'row',
                  marginVertical: 20,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: color.white,
                    fontSize: 18,
                    fontFamily: 'Roboto-Bold',
                    fontWeight: '800',
                  }}>
                  {capitalizeFirstCharacter(
                    rentalOrderDetails?.rentalOrderDetails?.rentalPlanName,
                  )}{' '}
                </Text>
                <Text
                  style={{
                    color: color.white,
                    fontSize: 16,
                    fontFamily: 'Roboto-Bold',
                    fontWeight: '800',
                  }}>
                  {rentalOrderDetails?.rentalOrderDetails?.amount &&
                    getPriceWithSymbol(
                      rentalOrderDetails?.rentalOrderDetails?.amount,
                    )}
                </Text>
              </View>

              <View
                style={{
                  marginLeft: 30,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../Assests/image/pickup.png')}
                    style={{height: 10, width: 10}}
                  />
                  <Text
                    style={{
                      color: color.white_50,
                      fontSize: 12,
                      marginLeft: 10,
                    }}>
                    {t('Pickup Location')}
                  </Text>
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    color: color.white,
                    fontSize: 14,
                    marginLeft: 19,
                    marginTop: 5,
                  }}>
                  {operationhubDetails?.address?.street}
                  {', '}
                  {operationhubDetails?.address?.city}
                </Text>
                <View
                  style={{
                    marginLeft: 9,
                    marginTop: 10,
                  }}
                />
              </View>

              {/* <View
                style={{
                  borderColor: color.white_50,
                  marginHorizontal: 50,
                  marginVertical: 20,
                  borderStyle: 'dashed',
                  borderWidth: 1,
                  borderRadius: 1,
                }}></View> */}
              {/* <Text
                style={{
                  width: '100%',
                  textAlign: 'center',
                  justifyContent: 'center',
                  color: color.white,
                  fontFamily: REGULAR,
                  fontSize: 14,
                  paddingHorizontal: 50,
                  lineHeight: 22,
                }}>
                {t(
                  'Reference site about Lorem Ipsum, giving information on its origins',
                )}
              </Text>

              {/* <CustomPressable
                text={'EXTEND PLAN'}
                marginTop={20}
                btnWidth={mobW - 60}
                route={''}
                isGradient={true}
                backgroundColor={'#10281C'}
                onPress={() => {
                  navigation.navigate('ExtendPlans');
                }}
                position={'relative'}
                bottom={0}
              /> */}

              {/* <BorderPressable
                text={'UPGRADE PLAN'}
                marginTop={20}
                isLoading={false}
                btnWidth={mobW - 60}
                borderColor="#00AF66"
                onPress={() => {
                  navigation.navigate('UpgradedPlans');
                }}
                position={'relative'}
                bottom={0}
              /> */}
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: mobH * 0.45,
              }}>
              <Text
                style={{fontSize: 16, color: color.white, textAlign: 'center'}}>
                  {t('myPlansNothvaeEvDes1')}{'\n'}{t('myPlansNothvaeEvDes2')}
              </Text>
              <CustomPressable
                text={t('myPlans_BUY_PLAN')}
                marginTop={20}
                btnWidth={mobW - 60}
                route={''}
                isGradient={true}
                backgroundColor="#10281C"
                onPress={() => {
                  navigation.navigate('Operationhub');
                }}
                position={'absolute'}
                bottom={0}
              />
            </View>
          )}
          {/* end plan details */}

          {previousPlanList && (
            <Text style={[styles.headerTitle, {margin: 30}]}>
              {t('Previous Subscriptions')}
            </Text>
          )}
          {previousPlanList && (
            <FlatList
              data={previousPlanList}
              contentContainerStyle={{height: '100%'}}
              renderItem={renderItem_offer}
              keyExtractor={item => item.id}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: color.black_BG, flex: 1, paddingVertical: 20},
  headerBox: {paddingTop: mobH * 0.032},
  headerSubBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0.037 * mobW,
  },
  headerTitle: {
    color: color.white,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: BOLD,
  },
  headerTitle1: {
    color: color.white,
    fontSize: 14,
    fontFamily: REGULAR,
  },
});
