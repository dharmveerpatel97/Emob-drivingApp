import React, {useState, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import battery from '../../Assests/image/battery.png';
import {color} from '../../utils/color';
import {BOLD, REGULAR} from '../../utils/fonts';
import CustomPressable from '../customComp/CustomPressable';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import StorageProvider from '../../Session/StorageProvider';
import Pie from 'react-native-pie';
const BottomSheetLayout = ({
  onOffDutyPressed,
  isLoading = false,
  status,
  texttt,
  percentage,
}) => {
  const app = useSelector(state => state.app);
  const [socval, setsocval] = useState(0);
  const [selcolor, setselcolor] = useState(color.yellow);
  const {t} = useTranslation();
  useEffect(() => {
    StorageProvider.getItem('socpertage')
      .then(res => {
        setsocval(res ? res : 0);
        if (parseInt(res) < 20) {
          setselcolor(color.red);
        } else if (parseInt(res) > 20 && parseInt(res) < 70) {
          setselcolor(color.yellow);
        } else if (parseInt(res) > 70) {
          setselcolor(color.acceptGreenColor);
        }
      })
      .catch(() => {});
  });

  return (
    <View>
      <Text
        style={{
          fontFamily: BOLD,
          color:
            app?.driverAllocationStatus?.status == 'accepting'
              ? '#1B7547'
              : '#CB0017',
          fontsize: 18,
          alignSelf: 'center',
        }}>
        {app?.driverAllocationStatus?.status == 'accepting'
          ? t('dutyModelOnline')
          : t('dutyModelOffLine')}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 12,
          marginTop: 15,
          justifyContent: 'center',
        }}>
        <View>
          {app.driverDetail && (
            <Image
              source={
                app.driverDetail?.profilePicPath != ''
                  ? {uri: app.driverDetail?.profilePicPath}
                  : require('../../Assests/image/user_avtar.png')
              }
              style={
                app.driverDetail?.profilePicPath != ''
                  ? {
                      width: 45,
                      height: 45,
                      borderRadius: 45 / 2,
                      alignSelf: 'center',
                      borderWidth: 1,
                      borderColor: '#ffffff',
                      resizeMode: 'cover',
                    }
                  : {height: 30, width: 30, resizeMode: 'contain'}
              }
            />
          )}

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#FF9500',
              height: 13,
              position: 'absolute',
              top: 35,
              left: 3,
              width: 40,
              justifyContent: 'center',
              borderRadius: 2,
            }}>
            <Image
              style={{width: 9, height: 9, alignSelf: 'center'}}
              source={require('../../Assests/image/ratingstar.png')}
            />
            <Text
              style={{
                fontSize: 10,
                color: color.white,
                fontFamily: REGULAR,
                alignSelf: 'center',
                marginStart: 2,
              }}>
              {app?.driverDetail?.avgRating
                ? app?.driverDetail?.avgRating.toFixed(2)
                : 0}
            </Text>
          </View>
        </View>
        <View style={{flex: 1, justifyContent: 'center', marginStart: 10}}>
          <Text style={{color: color.white, fontSize: 16, fontFamily: BOLD}}>
            {app?.driverDetail?.firstName + ' ' + app?.driverDetail?.lastName}
          </Text>
          <Text
            style={{
              color: '#1B7547',
              fontSize: 12,
              marginTop: 5,
              fontFamily: REGULAR,
            }}>
            {t('dutyModelAvailable')}
          </Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View style={{alignSelf: 'center', marginRight: 8}}>
            <Text
              style={{color: color.white, fontSize: 14, fontFamily: REGULAR}}>
              {t('home_battry_life')}
            </Text>
            {console.log('socpercentage bottomsheet', '0')}
            <Text
              style={{
                color: color.white,
                fontSize: 16,
                fontFamily: BOLD,
                textAlign: 'right',
              }}>
              {parseFloat(socval).toFixed(2)} {'%'}
            </Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Pie
              radius={25}
              innerRadius={20}
              sections={[
                {
                  percentage: socval,
                  color: selcolor,
                },
                {
                  percentage: 100 - socval,
                  color: "#00000070",
                },
              ]}
              backgroundColor="#10281C"
            />

            <View
              style={{
                position: 'absolute',
                width: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  width: 15,
                  height: 15,
                }}
                source={require('../../Assests/image/car-battery.png')}
              />
            </View>
          </View>
        </View>
      </View>
      {status == 'accepting' ? (
        <CustomPressable
          text={t('OFF DUTY')}
          isGradient={false}
          marginTop={35}
          btnWidth={'90%'}
          backgroundColor={'#CB0017'}
          route={'Verify'}
          isLoading={isLoading}
          onPress={() => {
            onOffDutyPressed();
          }}
          position={'relative'}
          bottom={0}
        />
      ) : (
        <CustomPressable
          text={t('ON DUTY')}
          isGradient={false}
          marginTop={35}
          btnWidth={'90%'}
          route={'Verify'}
          isLoading={isLoading}
          onPress={() => {
            onOffDutyPressed();
          }}
          position={'relative'}
          bottom={0}
        />
      )}
    </View>
  );
};
export default BottomSheetLayout;
