import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import MapplsGL from 'mappls-map-react-native';
import {
  getCurrentLocation,
  getDistanceInKm,
  locationPermission,
} from '../../utils/commonFunction';
import {endPoints} from '../../utils/config';
import {color} from '../../utils/color';
import {urls} from '../../utils/config';
import {mobW, mobH} from '../../utils/config';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import CustomPressable from '../customComp/CustomPressable';
import {point} from '@turf/helpers';
import Toast from 'react-native-toast-message';
import startIcon from '../../Assests/image/current_loc_pin.png';
import startIcon1 from '../../Assests/image/calout_icon.png';
import { t } from 'i18next';
import Loader from '../customComp/Loader';
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

export default function Operationhub({navigation}) {
  const [isLoading, setLoading] = useState(false);
  const [SelectedPlan, setSelectedPlan] = useState([]);
  const [nearcordinate, setnearcordinate] = useState([]);
  const [isLocationAvailable, setIsPremissionAvailbale] = useState(false);
  const [centerCordinates, setCenterCordinates] = useState([
    77.329712, 28.57513,
  ]);

  const getLiveLocation = async () => {
    const locPermissionDenied = await locationPermission();
    console.log('locPermissionDenied', locPermissionDenied);
    if (locPermissionDenied == 'granted') {
      const {latitude, longitude, heading} = await getCurrentLocation();
      setCenterCordinates([longitude, latitude]);
      setIsPremissionAvailbale(true);
    } else {
      console.log('isLocPermissionDenied  error');
    }
  };

  let cameraRef = useRef(null);

  useEffect(() => {
    getLiveLocation();
  }, []);

  useEffect(() => {
    if (isLocationAvailable) {
      setLoading(true);
      NearbyOperator();
    }
  }, [isLocationAvailable]);

  const NearbyOperator = async () => {
    setLoading(true)
    let accessToken = '';
    await StorageProvider.getObject('accessToken').then(responce => {
      accessToken = responce.accesstoken;
    });

    const url =
      urls.DMS_BASE_URL +
      endPoints.Near_By_Operator +
      '/?latitude=' +
      centerCordinates[1] +
      '&longitude=' +
      centerCordinates[0];
    console.log('url', url);
    fetch(url, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('near by operator -------', data);
        const list = [];
        const nearby = [];
        data.operatorHubs.map((element, index) => {
          list.push({
            time:
              element.workingHours.startTime +
              ' - ' +
              element.workingHours.endTime,
            id: index,
            value: true,
            distance: getDistanceInKm(element.distance),
            availble: element.vehicleCapacity + ' available',
            details:
              element.address.street +
              ' ' +
              element.address.city +
              ' ' +
              element.address.state +
              ', ' +
              element.address.pinCode,
            name: element.name,
            selected: false,
            operationHubID: element.id,
          });
          nearby.push({
            lat: element.address.location.coordinates[1],
            long: element.address.location.coordinates[0],
          });
        });
        setoperator_list(list);
        console.log('nearbynearby', nearby);
        setnearcordinate([...nearby]);

        if (cameraRef !== null) {
          cameraRef.current.fitBounds(
            [nearby[0].long, nearby[0].lat],
            [nearby[nearby.length - 1].long, nearby[nearby.length - 1].lat],
            [50, 50, 255, 50],
            1000,
          );
        }

        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  const [operator_list, setoperator_list] = useState([]);
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => onRadioBtnClick(item)}
        style={styles.radioButtonContainer}>
        <Image
          style={{
            width: 80,
            height: 100,
            justifyContent: 'center',
            marginLeft: 10,
            resizeMode: 'cover',
          }}
          source={require('../../Assests/image/operhub.png')}
        />
        <View style={{flexDirection: 'column', width: '70%', marginLeft: 5}}>
          <Text
            style={{
              fontSize: 16,
              color: color.white,
              fontFamily: BOLD,
              marginHorizontal: 10,
            }}>
            {item.name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail"
            style={{
              fontSize: 14,
              color: color.white,width:'85%',
              opacity: 0.7,flexWrap:'nowrap',
              marginHorizontal: 10,
              marginVertical: 5,
              fontFamily: REGULAR,
            }}>
            {item.details}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              width: '60%',
              marginHorizontal: 5,
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', justifycontent: 'center'}}>
              <Image
                style={{
                  width: 12,
                  height: 12,
                  marginHorizontal: 5,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
                source={require('../../Assests/image/dis_away.png')}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: color.white,
                  justifyContent: 'center',
                  fontFamily: 'Roboto-Medium',
                }}>
                {item.distance}{' away'}
              </Text>
            </View>
            <View style={{flexDirection: 'row',marginLeft:10,justifycontent: 'center'}}>
              <Image
                style={{
                  width: 12,
                  height: 12,
                  marginHorizontal: 5,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
                source={require('../../Assests/image/ev.png')}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: color.white,
                  justifyContent: 'center',
                  fontFamily: 'Roboto-Medium',
                }}>
                {10}{' Available'}
              </Text>
            </View>
          </View>

          <View
            style={{flexDirection: 'row', margin: 5, justifycontent: 'center'}}>
            <Image
              style={{
                width: 12,
                height: 12,
                marginHorizontal: 5,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
              source={require('../../Assests/image/clock.png')}
            />
            <Text
              style={{
                fontSize: 12,
                color: color.white,
                justifyContent: 'center',
                fontFamily: 'Roboto-Medium',
              }}>
              {item.time}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{right: 0, position: 'absolute', marginRight: 15}}
          onPress={() => onRadioBtnClick(item)}>
          {item.selected ? (
            <Image
              style={{width: 20, height: 20}}
              source={require('../../Assests/image/radioselected.png')}
            />
          ) : (
            <Image
              style={{width: 20, height: 20}}
              source={require('../../Assests/image/radio_nonselect.png')}
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  const onRadioBtnClick = item => {
    let updatedState = operator_list.map(isLikedItem =>
      isLikedItem.id === item.id
        ? {...isLikedItem, selected: true}
        : {...isLikedItem, selected: false},
    );
    setSelectedPlan([]);
    setSelectedPlan(item);
    setoperator_list(updatedState);
    StorageProvider.setObject('SelOperationHub', item);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent barStyle="light-content" />
      <Loader visible={isLoading} />
      <View style={styles.headerSubBox}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="arrowleft" color={color.white} size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.headerTitle}>{t('Choose Operation Hub')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapBox}>
        {centerCordinates.length > 0 && (
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
            didLoadedMapmyIndiaMapsStyles={data => {
              color: '#001A0F';
            }}>
            <MapplsGL.Camera
              minZoomLevel={8}
              maxZoomLevel={100}
              zoomLevel={12}
              ref={cameraRef}
              centerCoordinate={centerCordinates}
            />
            {nearcordinate.length > 0 &&
              nearcordinate.map((marker, i) => (
                <MapplsGL.ShapeSource
                  id={'origin1' + i}
                  shape={point([marker.long, marker.lat])}>
                  <MapplsGL.SymbolLayer
                    id={'originSymbolLocationSymbols' + i}
                    style={layerStyles.iconCallout}
                  />
                </MapplsGL.ShapeSource>
              ))}
            <MapplsGL.ShapeSource id="origin1" shape={point(centerCordinates)}>
              <MapplsGL.SymbolLayer
                id="originSymbolLocationSymbols"
                style={layerStyles.iconStartPosition}
              />
            </MapplsGL.ShapeSource>
          </MapplsGL.MapView>
        )}
      </View>
      {operator_list.length > 0 ? (
        <FlatList
          contentContainerStyle={{paddingBottom: 44, marginTop: 10}}
          data={operator_list}
          renderItem={renderItem}
        />
      ) : (
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            marginTop: 100,
            fontSize: 16,
          }}>
          {t('Operation hub not available at your location')}
        </Text>
      )}

      <View style={{height: 20}}></View>
      {operator_list.length > 0 ? (
        <CustomPressable
          text= {t('btn_PROCEED')}
          marginTop={10}
          btnWidth={mobW - 40}
          route={''}
          isGradient={true}
          backgroundColor={'#10281C'}
          onPress={() => {
            StorageProvider.setObject('selectedHubdetails', {
              hubname: SelectedPlan.name,
              hubaddress: SelectedPlan.details,
              km: SelectedPlan.distance,
            });
            SelectedPlan.length === 0
              ? Toast.show({
                  type: 'warning',
                  text1: t('Alert_txt'),
                  text2: t('Please Select Operation Hub'),
                })
              : navigation.navigate('ChooseBookingSlot');
          }}
          position={'relative'}
          bottom={10}
        />
      ) : (
        <TouchableOpacity
          disabled={true}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            height: 50,
            opacity: 0.4,
            alignSelf: 'center',
            width: mobW - 40,
            backgroundColor: '#c0c0c0',
            position: 'absolute',
            bottom: 10,
          }}>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              color: '#ffffff',
              fontFamily: 'Roboto-Bold',
            }}>
            {t('btn_PROCEED')}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.black_BG,
    flex: 1,
    paddingVertical: 20,
  },
  headerSubBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 0.037 * mobW,
    marginTop: 30,
  },

  headerTitle: {
    color: color.white,
    justifyContent: 'flex-start',
    marginLeft: 20,
    fontSize: 20,
    fontFamily: BOLD,
  },
  mapBox: {
    width: '100%',
    marginVertical: 15,
    height: mobH * 0.3,
    borderWidth: 1,
    borderColor: color.riderDiveder,
    borderRadius: 5,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    height: 125,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#10281C',
  },
});
