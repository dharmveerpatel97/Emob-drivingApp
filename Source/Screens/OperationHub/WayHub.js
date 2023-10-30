import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Modal,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import StorageProvider from '../../Session/StorageProvider';
import MapContainerWay from '../component/MapContainerWay';
import {point} from '@turf/helpers';
import carIcon from '../../Assests/image/auto.png';
import RentalEVStyle from '../../styles/RentalEVStyle';
import MapPath from '../../locationManaget/MapPath';
import CustomBtn from '../customComp/customBtn';
import startIcon from '../../Assests/image/current_loc_pin.png';
import MapplsGL from 'mappls-map-react-native';
import React, {useEffect, useState, useRef} from 'react';
import {color} from '../../utils/color';
import {
  getCurrentLocation,
  locationPermission,
  redirectToMap,
} from '../../utils/commonFunction';
import {resetStack, mobW, mobH} from '../../utils/commonFunction';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {DrawerActions, useFocusEffect} from '@react-navigation/native';
import {methods, endPoints, urlReqType} from '../../utils/config';
import {useCallback} from 'react';
import CustomPressable from '../customComp/CustomPressable';
import {useSelector, useDispatch} from 'react-redux';
import {BOLD, REGULAR, MEDIUM} from '../../utils/fonts';
import {GetOperatorHUbDetails, getDriverProfileInfo} from '../../Redux/appSlice';
import { useTranslation } from 'react-i18next';
import startIcon1 from '../../Assests/image/calout_icon.png';
global.userdata = null;
const layerStyles = {
  iconStartPosition: {
    iconImage: startIcon,
    iconAllowOverlap: true,
    iconSize: 0.4,
    iconAnchor: 'bottom',
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
  },
  iconCallout: {
    iconImage: startIcon1,
    iconAllowOverlap: true,
    iconSize: 0.5,
    iconAnchor: 'bottom',
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
  },
};

export default function WayHub({route, navigation}) {
  const {t} = useTranslation();
  
  const [showpath, setshowpath] = useState(false);
  const [centerCordinates, setCenterCordinates] = useState([]);
  const setCenterCoOrdi = data => {
    // setCenterCordinates(data);
    // Camera.current.fitBounds(
    //   [centerCordinates[0], centerCordinates[1]],
    //   [
    //     operationhubDetails?.address?.location?.coordinates[1],
    //     operationhubDetails?.address?.location?.coordinates[0],
    //   ],
    //   [50, 50, 255, 50],
    //   5000,  
    // );
  };
  const [operationhubDetails, setoperationhubDetails] = useState({});
  const dispatch = useDispatch();
  let cameraRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
    },[]),
  );

  const getUserData = async () => {

    dispatch(getDriverProfileInfo()).then(async res => {
      console.log('way hub rentalOrderDetails--',res?.payload?.rentalOrderDetails);
      dispatch(GetOperatorHUbDetails(res?.payload?.rentalOrderDetails?.operatorHubId)).then(async res1 => {
        setoperationhubDetails(res1?.payload);
        setshowpath(true);
      });
      }).catch(err => {
        console.log('error',err);
      }); 
  };

  useFocusEffect(
    useCallback(() => {
      getLiveLocation();
      getUserData();
    }, []),
  );
  const getLiveLocation = async () => {
    const locPermissionDenied = await locationPermission();
    console.log('locPermissionDenied',locPermissionDenied);
    if (locPermissionDenied == 'granted') {
      const {latitude, longitude, heading} = await getCurrentLocation();
      setCenterCordinates([longitude,latitude])
    } else {
      console.log('isLocPermissionDenied  error');
    }
  };

  return (
    <SafeAreaView style={RentalEVStyle.container}>
      <StatusBar translucent barStyle="light-content" />
      <View style={styles.mapBox}>
        <MapContainerWay navigation={navigation}>
          {
            centerCordinates.length > 0 &&
            <MapplsGL.MapView
              animated={'trans'}
              animationMode="moveTo"
              tintColor="#001A0F"
              mapplsStyle={'standard_night'}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
              //  styleURL={MapplsGL.StyleURL.Dark}
              didLoadedMapmyIndiaMapsStyles={data => {
                color: '#001A0F';
              }}>
              <MapplsGL.Camera
                minZoomLevel={5}
                maxZoomLevel={23}
                zoomLevel={12}
                animationMode="moveTo"
                ref={cameraRef}
                centerCoordinate={centerCordinates}
              />

              {showpath && (
                <MapPath
                  destination={`${operationhubDetails?.address?.location?.coordinates[1]},${operationhubDetails?.address?.location?.coordinates[0]}`}
                  source={`${centerCordinates[0]},${centerCordinates[1]}`}
                  setCenterCordinates={setCenterCoOrdi}
                  centerCordinates={`${centerCordinates[0]},${centerCordinates[1]}`}
                  centerNoString={centerCordinates}
                  showpath={true}
                />
              )}
            </MapplsGL.MapView>
          }
        </MapContainerWay>
      </View>
      
      <View style={styles.placeBox}>
        <View style={{flexDirection: 'row', marginHorizontal: 10}}>
          <Image
            style={{height: mobW * 0.045, marginTop: 15, width: mobW * 0.045}}
            source={require('../../Assests/image/location1.png')}
          />
          <View style={{flexDirection: 'column', margin: 10}}>
            <Text
              style={{
                color: color.white,
                fontSize: 16,
                lineHeight: 20,
                fontFamily: 'Roboto-Medium',
              }}>
              {t('Way to Operation Hub')}
            </Text>

            <Text
              style={{
                marginBottom: 20,
                lineHeight: 20,
                paddingRight: 20,
                color: color.white,
                fontSize: 14,
                opacity: 0.7,
                fontFamily: REGULAR,
                marginTop: 10,
              }}>
              {operationhubDetails?.address?.street +
                ' ' +
                operationhubDetails?.address?.city +
                ' ' +
                operationhubDetails?.address?.state +
                ',' +
                operationhubDetails?.address?.pinCode}
            </Text>
          </View>
        </View>
      </View>

      <CustomPressable
        text={route.params.btnname}
        marginTop={20}
        btnWidth={mobW - 60}
        route={''}
        isGradient={true}
        backgroundColor="#10281C"
        onPress={() => {
          {
            route.params.btnname == 'SCAN QR'
              ? navigation.navigate('Scan')
              : navigation.navigate(route.params.screenname);
          }
        }}
        position={'absolute'}
        bottom={30}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSubBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0.037 * mobW,
    marginTop: 60,
  },

  mapBox: {
    width: '100%',
    height: mobH * 0.9,
    backgroundColor: '#10281C',
    marginTop: mobH * 0.02,
  },
  placeBox: {
    borderWidth: 1,
    backgroundColor: '#10281C',
    borderRadius: 10,
    bottom: 100,
    position: 'absolute',
    marginHorizontal: 20,
    width: '90%',
  },
});
