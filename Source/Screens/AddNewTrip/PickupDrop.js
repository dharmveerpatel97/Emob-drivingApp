import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import React, {useState} from 'react';
import {color} from '../../utils/color';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import DatePicker from 'react-native-date-picker';
import StorageProvider from '../../Session/StorageProvider';

import {mobW, mobH} from '../../utils/config';
import {FlatList} from 'react-native-gesture-handler';
import {useEffect} from 'react';

import axios from 'axios';
import {urls} from '../../utils/config';
import {getCurrentLocation} from '../../utils/commonFunction';
import {useTranslation} from 'react-i18next';

const PickupDrop = ({
  ispickupdrop,
  onClose,
  Onsuccess,
  currentlocpoint,
  navigation = {},
}) => {
  const {t} = useTranslation();
  const [droplocation, setDropLOcation] = useState('');
  const [Pickuploc, setPickuploc] = useState('');
  const [SearchData, setSearchData] = useState([]);
  const [recentPlaces, setRecentPlaces] = useState([]);
  const [dropEditing, setDropEditing] = useState(false);
  //************************************************** *//

  const SearchLocByLATLONG = async () => {
    const {latitude, longitude, heading} = await getCurrentLocation();
    StorageProvider.getObject('accessToken').then(responce => {
      var myHeaders = new Headers();
      myHeaders.append('Authorization', 'Bearer ' + responce.accesstoken);
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      let apiUrl = `${urls.DMS_BASE_URL}mapservice/e-mob/maps/v1/reverse-geocode?latitude=${latitude}&longitude=${longitude}`;

      return new Promise((resolve, reject) => {
        fetch(apiUrl, requestOptions)
          .then(response => response.json())
          .then(Res => {
            setPickuploc(Res.results[0].formattedAddress);
            resolve(Res);
          })

          .catch(er => {
            reject(er);
            console.log('location serach gives error', JSON.stringify(er));
          });
      });
    });
  };

  const CheckBothLoc = item => {
    setDropLOcation(item.address),
      setCordinates(item.latitude, item.Longitude),
      Pickuploc.length != 0 && onPress();
  };

  const PlaceDetails = async (eloc, item) => {
    StorageProvider.getObject('accessToken').then(responce => {
      var myHeaders = new Headers();
      myHeaders.append('Authorization', 'Bearer ' + responce.accesstoken);
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      let apiUrl = `${urls.DMS_BASE_URL}mapservice/e-mob/maps/v1/place-detail?eLoc=${eloc}`;

      return new Promise((resolve, reject) => {
        fetch(apiUrl, requestOptions)
          .then(response => response.json())
          .then(Res => {
            Onsuccess(Pickuploc, item, Res);
            setDropLOcation('');
            // navigation.navigate('NewTrip',{surceLoc:Pickuploc,destinaLoc:item,destinapoints:Res})
            resolve(Res);
          })

          .catch(er => {
            reject(er);
            console.log('location serach gives error', JSON.stringify(er));
          });
      });
    });
  };

  const getRecentPlaces = async () => {
    StorageProvider.getObject('accessToken').then(responce => {
      var myHeaders = new Headers();
      myHeaders.append('Authorization', 'Bearer ' + responce.accesstoken);
      var requestOptions = {
        method: 'GET',

        headers: myHeaders,

        redirect: 'follow',
      };

      return new Promise((resolve, reject) => {
        fetch(`${urls.DMS_BASE_URL}/rms/ride/recent-places`, requestOptions)
          .then(response => response.json())

          .then(res => {
            // console.log("response response", res);

            resolve(res);
          })

          .catch(e => {
            reject(e);

            console.log('getRecentPlaces gives error', e);
          });
      });
    });
  };

  useEffect(() => {
    if (ispickupdrop) {
      SearchLocByLATLONG();
      getRecent();
    }
  }, [ispickupdrop]);

  const getRecent = async () => {
    await getRecentPlaces()
      .then(res => {
        if (res != null) {
          setRecentPlaces(res);
        }
      })
      .catch(err => console.log(' place err', err));
  };

  const SearchLocation = async Text => {
    setDropLOcation(Text);
    if (Text.length > 3) {
      StorageProvider.getObject('accessToken').then(responce => {
        var myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + responce.accesstoken);
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };

        let apiUrl = `${urls.DMS_BASE_URL}mapservice/e-mob/maps/v1/auto-suggest?search=${Text}`;
        return new Promise((resolve, reject) => {
          fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(res => {
              console.log('data', res);
              if (res.suggestedLocations == null) {
              } else {
                setSearchData(res.suggestedLocations);
              }
            })
            .catch(error => {
              console.log(error);
            });
        });
      });
    } else {
      setSearchData([]);
      getRecent();
    }
  };

  return (
    <Modal transparent visible={ispickupdrop}>
      <View style={styles.container}>
        <View style={styles.headerSubBox}>
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="arrowleft" color={color.white} size={24} />
          </TouchableOpacity>
          <TouchableOpacity></TouchableOpacity>
          {/* <TouchableOpacity
              onPress={() => {
                OnNotoofiction()
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
            </TouchableOpacity> */}
        </View>

        <View style={styles.topContainer}>
          <View style={styles.imgContainer}>
            <Image
              source={require('../../Assests/image/distance.png')}
              style={{height: 16, width: 16, resizeMode: 'contain'}}
            />

            <View style={styles.dotedIcons} />
            <Image
              source={require('../../Assests/image/end_icon.png')}
              style={{resizeMode: 'contain', height: 20, width: 20}}
            />
          </View>
          <View>
            <View
              style={[
                styles.inputContainer,
                {flexDirection: 'row', marginBottom: 10},
              ]}>
              <Text
                style={{
                  width: '90%',
                  flexShrink: 1,
                  flexWrap: 'wrap',
                  fontSize: 16,
                  fontFamily: 'Roboto-Bold',
                  color: color.white,
                  height: 20,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                }}>
                {Pickuploc}
              </Text>
              <Image
                source={require('../../Assests/image/gps.png')}
                style={{height: 20, width: 20, position: 'absolute', right: 20}}
              />
            </View>
            <View
              style={[
                styles.inputContainer,
                {borderWidth: 1, borderColor: color.Border_color},
              ]}>
              <TextInput
                style={styles.input}
                value={droplocation}
                onChangeText={text => SearchLocation(text)}
                onPressIn={e => setDropEditing(true)}
                onEndEditing={() => setDropEditing(false)}
                placeholder={t('Drop Location')}
                placeholderTextColor={color.white}
              />

              {droplocation.length > 0 && dropEditing && (
                <TouchableOpacity
                  style={{
                    borderRadius: 10,
                    marginEnd: 10,
                    backgroundColor: 'grey',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setDropLOcation('');
                  }}>
                  <Entypo name="cross" color="white" size={20} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            height: 1.5,
            backgroundColor: 'rgba(0,0,0,0.1)',
            shadowColor: '#001A0F',
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowOpacity: 1.25,
            shadowRadius: 3,
            elevation: 3,
          }}></View>

        {SearchData.length > 0 ? (
          <View style={{flex: 1}}>
            <FlatList
              keyboardShouldPersistTaps={'handled'}
              data={SearchData}
              ListEmptyComponent={() => {
                return (
                  <View style={{marginTop: 20}}>
                    <Text
                      style={{fontFamily: 'Roboto-Bold', color: color.Grey}}>
                      No Match Found!!
                    </Text>
                  </View>
                );
              }}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setDropLOcation(item.placeName);
                      PlaceDetails(item.eLoc, item.placeName);
                      setSearchData([]);
                    }}
                    style={styles.listCont}>
                    <View
                      style={{
                        backgroundColor: color.white,
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 30,
                        height: 30,
                      }}>
                      <Image
                        source={require('../../Assests/image/dis_away.png')}
                        style={{
                          width: 16,
                          height: 16,
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                    <View style={{paddingHorizontal: 16}}>
                      <Text style={styles.heading}>{item.placeName}</Text>
                      <Text style={{color: color.white}}>
                        {item.placeAddress}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              contentContainerStyle={{paddingBottom: 30}}>
              <FlatList
                keyboardShouldPersistTaps={'handled'}
                data={recentPlaces}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        CheckBothLoc(item);
                      }}
                      style={styles.listCont}>
                      <View
                        style={{
                          backgroundColor: color.black_BG,
                          padding: 10,
                          borderRadius: 210,
                          shadowColor: '#001A0F',
                          shadowOffset: {
                            width: 0,
                            height: 0,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3,
                          elevation: 3,
                          width: 40,
                          height: 40,
                        }}>
                        <Image
                          source={require('../../Assests/image/about.png')}
                          style={{
                            //   marginTop: 5,
                            width: 20,
                            height: 20,
                            // backgroundColor: 'red',
                            resizeMode: 'contain',
                          }}
                        />
                      </View>

                      <View style={{paddingHorizontal: 10}}>
                        <Text
                          style={{
                            color: '#00AF66',
                            fontSize: 16,
                            paddingEnd: 16,
                            fontFamily: 'Roboto-Medium',
                          }}>
                          {item.address}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  );
};
export default PickupDrop;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#001A0F80',
  },

  topContainer: {
    alignItems: 'center',
    marginTop: 40,
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: color.black_BG,
  },
  imgContainer: {
    marginEnd: 10,
    alignItems: 'center',
  },

  listCont: {
    marginVertical: 8,
    marginHorizontal: 16,
    paddingEnd: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    fontSize: 14,
    color: color.white,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#10281C',

    borderRadius: 10,
    height: 50,
    marginBottom: 5,
    padding: Platform.OS == 'android' ? 0 : 12,
    width: Dimensions.get('screen').width / 1.2,
  },
  headerSubBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0.037 * mobW,
  },

  input: {
    width: '88%',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: color.white,
  },
  container: {backgroundColor: color.black_BG, flex: 1, paddingVertical: 20},
  dotedIcons: {
    borderStyle: 'dotted',
    height: 50,
    borderLeftWidth: 2,
    borderColor: color.white,
  },
});
