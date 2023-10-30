import {View, Dimensions, Text, Modal, StyleSheet, Image} from 'react-native';
import CircularCustomProfile from './CircularCustomProfile';
import {BOLD, REGULAR} from '../../utils/fonts';
import Seperator from '../customComp/Seperator';
import CircularButton from '../customComp/arrivedStarttripButton/CircularButton';
import {t} from 'i18next';
import CustomPressable from '../customComp/CustomPressable';
import RedirectionBtn from './RedirectionBtn';
import SwipeButton from '../../rn-swipe-button';
import {redirectToMap} from '../../utils/commonFunction';
import {useEffect, useRef, useState} from 'react';
import {getCurrentLocation} from '../../utils/commonFunction';

import CustomToastProvider from '../customComp/CustomToastProvider';
import {urls} from '../../utils/config'; 
import { useTranslation } from 'react-i18next';
import { color } from '../../utils/color';

// import SwipeButton from  'rn-swipe-button'
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const ArrivedStartTrip = ({
  isStartTrip,
  onArrivedStartTripPressed,
  rideDetails,
  navigation = {},
}) => {
  const {t} = useTranslation();

  const [Sdistance, setSdistance] = useState(0);
  const [Stime, setStime] = useState(0);

  const matrix = async () => {
    const {latitude, longitude, heading} = await getCurrentLocation();
    let accessToken = '';
    await StorageProvider.getObject('accessToken').then(responce => {
      accessToken = responce.accesstoken;
    });

    let apiUrl = `${urls.DMS_BASE_URL}mapservice/e-mob/maps/v1/distance?source=${longitude},${latitude}&destination=${rideDetails.source.longitude},${rideDetails.source.latitude}`;

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    };
    fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data, '-------response---------');
        setSdistance(Math.round(data.results.distances / 1000));
        setStime(Math.round(data.results.durations / 60));
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isStartTrip) {
      matrix();
    }
  }, [isStartTrip]);

  const CheckoutButton = () => {
    return (
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: '#ffffff',
          borderWidth: 0,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  };
  const rideIcon = require('../../Assests/image/estprice.png');
  return (
    // <Modal transparent visible={isStartTrip}>
    <View style={styles.container}>
      {/* <CustomToastProvider/> */}
      <View style={styles.innerContainer}>
        <View style={{marginHorizontal: 16}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <CircularCustomProfile rideDetails={rideDetails} />
              <View style={{justifyContent: 'center', marginStart: 10}}>
                <Text
                  style={{fontSize: 16, fontFamily: BOLD, color: '#ffffff'}}>
                  {/* Vikram Khanna */}
                  {rideDetails?.passenger?.name}
                </Text>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <View style={{flexDirection: 'row', marginEnd: 10}}>
                    <Image
                      style={{width: 14, height: 14, marginEnd: 5}}
                      source={require('../../Assests/image/time.png')}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontfamily: REGULAR,
                        color: '#ffffff',
                      }}>
                      {Stime}
                      {t('ArriveStart_min')}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={{width: 14, height: 14, marginEnd: 5}}
                      source={require('../../Assests/image/distance.png')}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontfamily: REGULAR,
                        color: '#ffffff',
                      }}>
                      {Sdistance}
                      {t('ArriveStart_Km')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <RedirectionBtn rideDetails={rideDetails} />
          </View>

          <Seperator />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 40,
              marginTop: 10,
            }}>
            <CircularButton
              title={t('Calls')}
              rideDetails={rideDetails}
              type="calls"
              backgroundColor={color.black_BG}
              source={require('../../Assests/image/phonecall.png')}
            />

            {/* <CircularButton
                title={t('Message')}
              backgroundColor={color.black_BG}
                rideDetails={rideDetails}
                source={require('../../Assests/image/message.png')}
              /> */}

            <CircularButton
              type="cancel"
              title={t('Cancel_Trip')}
              rideDetails={rideDetails}
              backgroundColor={'#CB0017'}
              source={require('../../Assests/image/cancelbutton.png')}
            />
          </View>

          {/* <CustomPressable
              text={t("ARRIVED")}
              btnWidth={Dimensions.get('screen').width / 1.2}
              route={'Verify'}
              isGradient={false}
              onPress={() => {
                onArrivedStartTripPressed()
              }}
              // isLoading={isLoading}
              backgroundColor="#00AF66"
              position={'relative'}
              bottom={0}
            /> */}

          <SwipeButton
            containerStyles={{
              borderRadius: 5,
              color: '#fff',
              backgroundColor: '#00AF66',
              height: 55,
              marginTop: 20,
              paddingRight: 30,
            }}
            onSwipeFail={() => console.log('')}
            onSwipeStart={() => console.log('Swipe started!')}
            onSwipeSuccess={() => onArrivedStartTripPressed()}
            railBackgroundColor="#00AF66"
            railStyles={{borderRadius: 5}}
            thumbIconComponent={CheckoutButton}
            gradientColor={['#00AF66','#00AF66']}
            railFillBackgroundColor={'#699CF340'}
            thumbIconStyles={{borderRadius: 5}}
            titleColor={'#fff'}
            thumbIconWidth={45}
            height={45}
            title={t('ARRIVED')}
          />
        </View>
      </View>
    </View>
    // </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: '100%',
    // width: '100%',
    alignSelf: 'center',
    backgroundColor: '#10281C',
  },
  innerContainer: {
    width: width - 20,
    paddingVertical: 0,
    borderRadius: 10,
    alignSelf: 'center',
  },
});
export default ArrivedStartTrip;
