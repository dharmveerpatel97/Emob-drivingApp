import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Header,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import battery from '../../Assests/image/car-battery.png';
import {color} from '../../utils/color';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import {getDriverProfileInfo} from '../../Redux/appSlice';
import Loader from '../customComp/Loader';
import {useDispatch} from 'react-redux';
import Pie from 'react-native-pie';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import {formatDate,formattedRegistrationNumber} from '../../utils/commonFunction';
import CustomPressable from '../customComp/CustomPressable';
import {useTranslation} from 'react-i18next';

export default function Myvehicle({navigation}) {
  const {t} = useTranslation();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState([]);
  const [selcolor, setselcolor] = useState(color.purpleborder);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsFetching(true);
      getUserProfileInfo();
    });
    return unsubscribe;
  }, [navigation]);

  const dispatch = useDispatch();

  const getUserProfileInfo = async () => {
    dispatch(getDriverProfileInfo())
      .then(async res => {
        let allottedVehicleDetail = res?.payload?.allottedVehicleDetail;
        console.log('allottedVehicleDetail', allottedVehicleDetail);
        let details = [];
        if (allottedVehicleDetail) {
          details = [
            {
              name: 'Registration Number',
              value: allottedVehicleDetail?.regNumber,
            },
            {
              name: 'Brand',
              value: allottedVehicleDetail?.brand,
            },
            {
              name: 'Model Number',
              value: allottedVehicleDetail?.modelNumber,
            },
            {
              name: 'Seating Capacity',
              value: allottedVehicleDetail?.seatingCapacity,
            },
            {
              name: 'Manufacture Date',
              value: allottedVehicleDetail?.manufactureDate
                ? formatDate(
                    allottedVehicleDetail?.manufactureDate,
                    'MM/DD/YYYY',
                  )
                : '',
            },
            {
              name: 'Last Service Date',
              value: allottedVehicleDetail?.lastServiceDate
                ? formatDate(
                    allottedVehicleDetail?.lastServiceDate,
                    'MM/DD/YYYY',
                  )
                : '',
            },
            // {
            //   name: 'Service Periodicity',
            //   value: '94 Days / 3 Months 4 Days',
            // },
            {
              name: 'Insurance Valid Until',
              value: allottedVehicleDetail?.insuranceValidUntil
                ? formatDate(
                    allottedVehicleDetail?.insuranceValidUntil,
                    'MM/DD/YYYY',
                  )
                : '',
            },
            {
              name: 'Road Tax Valid Until',
              value: allottedVehicleDetail?.roadTaxValidUntil
                ? formatDate(
                    allottedVehicleDetail?.roadTaxValidUntil,
                    'MM/DD/YYYY',
                  )
                : '',
            },
            {
              name: 'IMEI Number',
              value: allottedVehicleDetail?.imei,
            },
          ];
          setData([...details]);
          setUserInfo({...allottedVehicleDetail});
          const socbattery =
            allottedVehicleDetail?.vehicleBattery[0].socPercent;

          if (socbattery < 20) {
            setselcolor(color.red);
          } else if (socbattery > 20 && socbattery < 70) {
            setselcolor(color.yellow);
          } else if (socbattery > 70) {
            setselcolor(color.purpleborder);
          }
        }
        setIsFetching(false);
      })
      .catch(error => {
        setIsFetching(false);
      });
  };

  const renderItem = ({item}) => {
    return item.value || item.value === 0 ? (
      <View
        style={{
          paddingTop: 10,
          marginLeft: 15,
          paddingHorizontal: 10,
          flexDirection: 'row',
        }}>
        <Text style={[styles.titlelist, {opacity: 0.7}]}>{t(`${item.name}`)}</Text>
        <Text style={styles.titlelist}>{item.value}</Text>
      </View>
    ) : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <ExpirePlan
        onclose={() => {
          setshowexpireplan(false);
        }}
        onswipe={() => {
          navigation.navigate('Myplans');
        }}
        showExpirePlan={showexpireplan}/> */}
      <StatusBar translucent barStyle="light-content" />
      <Loader visible={isFetching} />

      <View style={styles.headerSubBox}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="arrowleft" color={color.white} size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.headerTitle}> {t('My Electric Vehicle')} </Text>
        </TouchableOpacity>
        <TouchableOpacity></TouchableOpacity>
      </View>

      {userInfo ? (
        <ScrollView
          contentContainerStyle={{flexGrow: 1, paddingBottom: mobH * 0.08}}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <View style={styles.headerBox}>
            <View style={styles.sectionWrapper}>
              <Pie
                radius={90}
                innerRadius={70}
                sections={[
                  {
                    percentage: userInfo?.vehicleBattery ? userInfo?.vehicleBattery[0].socPercent : 0,
                    color: selcolor,
                  },
                  {
                    percentage: userInfo?.vehicleBattery ? 100 - userInfo?.vehicleBattery[0].socPercent: 0,
                    color: color.black_medum_50,
                  },
                ]}
                backgroundColor="#10281C"
              />
              <View style={styles.gauge}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  source={battery}
                />
                <Text style={styles.gaugeText}>
                  {userInfo?.vehicleBattery[0].socPercent}
                  {'%'}
                </Text>
                <Text style={styles.chargeLevel}>{t('Charge Level')}</Text>
              </View>
            </View>

            <View>
              <Text
                style={[
                  styles.titlelist,
                  {paddingLeft: 10,marginTop:10, marginLeft: 15, color: color.white},
                ]}>
                {t('Vehicle Details:')}
              </Text>
            </View>

            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.name}
            />

            {/* <View style={{marginTop: 30, width: mobW, paddingHorizontal: 30}}>
            <TouchableOpacity
              style={{
                height: 70,
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 0.5,
                borderColor: '#FE4A5E',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  paddingHorizontal: 30,
                  lineHeight: 26,
                  color: '#FE4A5E',
                  fontFamily: REGULAR,
                  textAlign: 'center',
                  width: '100%',
                }}>
                {' '}
                {
                  'Your dropoff is in 30 mins EXTEND PLAN to avoid paying any penalty'
                }{' '}
              </Text>
            </TouchableOpacity>
          </View> */}

           <CustomPressable
              text={t('myPlans_EXTEND_PLAN')}
              marginTop={30}
              btnWidth={mobW - 60}
              route={'ExtendPlans'}
              isGradient={true}
              backgroundColor="#10281C"
              onPress={() => {
                navigation.navigate('ExtendPlans');
              }}
              position={'relative'}
              bottom={0}
            />

            <View style={{marginTop: 20, width: mobW, paddingHorizontal: 30}}>
              <TouchableOpacity
                style={{
                  height: 50,
                  width: '100%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#00AF66',
                  borderRadius: 10,
                }}
                onPress={() => {
                  navigation.navigate('ReturnEv');
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    alignSelf: 'center',
                    color: '#ffffff',
                    fontFamily: 'Roboto-Bold',
                  }}>
                  {' '}
                  {t('RETURN EV')}{' '}
                </Text>
              </TouchableOpacity>
            </View> 
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.black_BG,
          }}>
          <Text style={{color: '#ffffff', fontSize: 18}}>
            {t('EV not assigned')}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: color.black_BG, flex: 1, paddingVertical: 20},
  titlelist: {
    fontSize: 14,
    width: '50%',
    color: color.white,
    fontFamily: REGULAR,
  },
  headerBox: {paddingTop: mobH * 0.032},
  headerSubBox: {
    paddingTop: mobH * 0.032,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0.037 * mobW,
  },
  headerTitle: {color: color.white, fontSize: 20, fontFamily: BOLD},
  headerTitle1: {
    color: color.white,
    fontSize: 14,
    fontFamily: REGULAR,
  },
  sectionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25,
  },

  gauge: {
    position: 'absolute',
    width: 100,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: 24,
    marginTop: 5,
  },
  chargeLevel: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    marginTop: 5,
    fontSize: 12,
    opacity: 0.8,
  },
});
