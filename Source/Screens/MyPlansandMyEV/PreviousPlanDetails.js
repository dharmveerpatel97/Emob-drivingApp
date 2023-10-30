import React, { useEffect,  useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {formatDate, getPriceWithSymbol,formattedRegistrationNumber} from '../../utils/commonFunction';
import CustomPressable, {BorderPressable} from '../customComp/CustomPressable';
import {color} from '../../utils/color';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import Check from '../../Assests/image/Check.png';
import {getDriverProfileInfo} from '../../Redux/appSlice';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import StarRating from 'react-native-star-rating-widget';
import battery from '../../Assests/image/battery.png';
import view_plan from '../../Assests/image/view_plan.png';
import navigationImage from '../../Assests/image/navigation.png';
import arrowRight from '../../Assests/image/arrowRight.png';
import supportImage from '../../Assests/image/supportN.png';
import RentalEVStyle from '../../styles/RentalEVStyle';
import {useTranslation} from 'react-i18next';
export default function PreviousPlanDetails({navigation, route}) {
  const [previousPlanList1, setPreviousPlanList1] = useState(false);

  const {t} = useTranslation();

  useEffect(() => {
    if (route.params.value.vehicleDetails.length > 0) {
      setPreviousPlanList1(true);
    }
  }, []);

  const capitalizeFirstCharacter = str => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderItem_offer = item => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {}}
        style={{
          paddingHorizontal: mobW * 0.037,
          marginTop: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{color: color.white, fontSize: 16}}>
            {capitalizeFirstCharacter(item?.rentalPlanDetail[0].planName)}{' '}
            {' - '}{' '}
            {capitalizeFirstCharacter(item?.rentalPlanDetail[0].planType)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: 7,
          }}>
          <Text style={{color: color.white_50, fontSize: 15}}>
            {t('EV Registeration Number')}
          </Text>
          {previousPlanList1 ? (
            <Text style={{color: color.white, fontSize: 15, marginLeft: 20}}>
              {item?.vehicleDetails[0].regNumber}
            </Text>
          ) : (
            <Text
              style={{
                color: color.white,
                fontSize: 15,
                marginLeft: 20,
                opacity: 0.8,
              }}>
              {t('Vehicle not assigned')}
            </Text>
          )}
        </View>
        <View
          style={{
            marginLeft: 9,
            paddingVertical: 10,
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
                color: color.white,
                fontSize: 12,
                marginLeft: 10,
                opacity: 0.7,
              }}>
              {t('Operation Hub')}
            </Text>
          </View>
          <Text
            style={{
              color: color.white,
              fontSize: 16,
              marginLeft: 19,
              marginTop: 5,
            }}>
            {item?.operatorHubDetail[0].address?.street}
            {', '}
            {item?.operatorHubDetail[0].address?.city}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexDirection: 'row',
            alignItems: 'center',
            height: 60,
          }}>
          <View style={{width: '40%'}}>
            <Text style={{color: color.white, fontSize: 13, lineHeight: 20}}>
              {formatDate(item?.startTime, 'DD MMM YYYY, hh:mm A')}
            </Text>
          </View>
          <View
            style={{
              width: '10%',
              justifyContent: 'center',
              alignItems: 'center',
              height: 40,
            }}>
            <Image
              source={require('../../Assests/image/right_icon.png')}
              style={{width: 30, resizeMode: 'contain'}}
            />
          </View>
          <View style={{width: '40%', alignItems: 'flex-end'}}>
            <Text style={{color: color.white, fontSize: 13, lineHeight: 20}}>
              {formatDate(item?.endTime, 'DD MMM YYYY, hh:mm A')}
            </Text>
          </View>
        </View>
        {/* <View
          style={{
            alignItems: 'flex-start',
            width: mobW * 0.5,marginTop:30
          }}>
          <Text style={{color: color.white, fontSize: 16}}>
            {'Vehicle Rating'}
          </Text>
          <StarRating
            style={{marginTop: 10, marginLeft: -5}}
            starSize={mobW * 0.05}
            color={'#f4cc25'}
            emptyColor={'#ffffff'}
            rating={3.5}
            onChange={rating => {}}
          />
        </View> */}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}} scrollEnabled={true}>
        <StatusBar translucent barStyle="light-content" />
        <View style={styles.headerBox}>
          <View style={styles.headerSubBox}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="arrowleft" color={color.white} size={24} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.headerTitle}>
                {' '}
                {t('Previous Subscriptions')}{' '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity></TouchableOpacity>
          </View>
          {renderItem_offer(route.params.value)}
          {/* <BorderPressable
                text={'Download Invoice'}
                marginTop={50}
                isLoading={false}
                btnWidth={mobW*0.923}
                borderColor="#00AF66"
                onPress={() => {
                  //  navigation.navigate('ExtendPlans');
                }}
                position={'relative'}
                bottom={0}
              /> */}
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Support');
          }}
          style={{position: 'absolute', bottom: 20, right: 0, left: 0}}>
          <View style={RentalEVStyle.FifthContainer}>
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
                  // fontWeight: 'bold',
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
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: color.black_BG, flex: 1, paddingTop: 20},
  headerBox: {paddingTop: mobH * 0.032},
  headerSubBox: {
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
});
