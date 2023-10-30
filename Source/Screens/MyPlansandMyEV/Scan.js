import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Header,
  Modal,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import QRCodeScanner from 'react-native-qrcode-scanner';
import CustomPressable from '../customComp/CustomPressable';
import {color} from '../../utils/color';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import {useTranslation} from 'react-i18next';

export default function Scan({route, navigation}) {
  const {t} = useTranslation();
  const [viewdues, setviewdues] = useState(false);
  const [viewdetailsshow, setviewdetailsshow] = useState(false);
  const [due, setdue] = useState('₹1450');
  const [dropaddress, setdropaddress] = useState(
    'C 17, SMA, Jahangirpuri Industrial Area, Jahangirpuri, Delhi, 110033',
  );
  const [qrvalue, setQrvalue] = useState('');
  const [opneScanner, setOpneScanner] = useState(false);
  const [inprocess, setinprocess] = useState('In Process');

  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');
  const [scan, setscan] = useState(false);
  const [ScanResult, setScanResult] = useState(true);

  const handleScan = e => {
    if (e.data !== null) {
      setScanned(true);
      setData(e.data);
    }
  };

  const onSuccess = e => {
    const check = e.data.substring(0, 4);
    console.log('scanned data' + check);
    setviewdues(true);
    setScanResult(true);
  };

  const damage_Details = [
    {
      count: '1',
      name: 'Left Head Light ',
      amount: '₹1450',
    },
    {
      count: '1',
      name: 'Left Head Light  Left Head Light ',
      amount: '₹1450',
    },
    {
      count: '1',
      name: 'Left Head Light  Item',
      amount: '₹1450',
    },
    {
      count: '1',
      name: 'Left Head Light  Item',
      amount: '₹1450',
    },
    {
      count: '1',
      name: 'Left Head Light  Item',
      amount: '₹1450',
    },
    {
      count: '1',
      name: 'Left Head Light  Item',
      amount: '₹1450',
    },
    {
      count: '1',
      name: 'Left Head Light  Item',
      amount: '₹1450',
    },
    {
      count: '1',
      name: 'Left Head Light  Item',
      amount: '₹1450',
    },
    {
      count: '1',
      name: 'Left Head Light  Item',
      amount: '₹1450',
    },
  ];

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          padding: 10,
          marginLeft: 20,
          flexDirection: 'row',
        }}>
        <Text style={modalStyles.titlelist}>{item.count}</Text>
        <Text style={modalStyles.titlelist}>{item.name}</Text>
        <Text
          style={[
            modalStyles.titlelist,
            {right: 15, position: 'absolute', paddingTop: 5},
          ]}>
          {item.amount}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal transparent visible={viewdues}>
        <View style={modalStyles.container1}>
          <View style={modalStyles.innerContainer}>
            <View
              style={{
                width: 30,
                height: 30,
                right: 0,
                marginRight: 20,
                position: 'absolute',
                top: 30,
              }}>
              <TouchableOpacity onPress={() => setviewdues(false)}>
                <Image
                  style={{width: 30, height: 30}}
                  source={require('../../Assests/image/close_blue.png')}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: 100,
                height: 100,
                marginTop: -20,
                borderRadius: 100 / 2,
                backgroundColor: '#001A0F',
                justifyContent: 'center',
                alignSelf: 'center',
                marginBottom: 15,
              }}>
              <Image
                style={{width: 50, height: 50, alignSelf: 'center'}}
                source={require('../../Assests/image/rupee_1.png')}
              />
            </View>

            <View
              style={{
                alignSelf: 'center',
                marginBottom: 10,
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontfamily: 'Roboto-Bold',
                  color: color.white,
                }}>
                {t('Pending Dues')}
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  paddingLeft: 10,
                  fontfamily: 'Roboto-#00AF66',
                  color: color.white,
                }}>
                {due}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setviewdetailsshow(true);
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontfamily: 'Roboto-Regular',
                  color: '#00AF66',
                  textDecorationLine: 'underline',
                }}>
                {t('View Detail')}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                marginHorizontal: 30,
                marginTop: 30,
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#00AF66',
                backgroundColor: '#001A0F80',
              }}>
              <TouchableOpacity style={{width: '86%'}}>
                <Text style={{fontSize: 16, marginLeft: 21, color: '#00AF66'}}>
                  {t('Pay Online Now')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Image
                  style={{width: 20, marginHorizontal: 10, height: 20}}
                  source={require('../../Assests/image/radioselected.png')}
                />
              </TouchableOpacity>
            </View>

            <CustomPressable
              text={`₹178/-${t('MAKE PAYMENT NOW')}`}
              marginTop={20}
              btnWidth={mobW - 100}
              route={''}
              isGradient={true}
              backgroundColor="#10281C"
              onPress={() => {
                navigation.navigate('setScanResult', {
                  showmsg: true,
                  rootmove: 'Returnev_review',
                  rootname: 'Continue',
                });
              }}
              position={'absolute'}
              bottom={40}
            />
          </View>
        </View>
      </Modal>

      <Modal transparent visible={viewdetailsshow}>
        <View style={modalStyles.container1}>
          <View style={modalStyles.innerContainer1}>
            <View style={[styles.headerSubBox, {marginTop: 10}]}>
              <TouchableOpacity
                onPress={() => {
                  setviewdetailsshow(false);
                }}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="arrowleft" color={color.white} size={24} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.headerTitle}>{t('Damage Invoice')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection: 'row'}} />
            </View>
            <View style={{marginTop: 50, height: mobH / 1.6}}>
              <FlatList
                data={damage_Details}
                ItemSeparatorComponent={() => {
                  return <View style={{height: 10}} />;
                }}
                renderItem={renderItem}
              />
            </View>

            <View
              style={{
                borderColor: '#FFFFFF',
                marginHorizontal: 20,
                borderStyle: 'dashed',
                height: 1,
                borderWidth: 1,
                borderRadius: 1,
              }}></View>

            <View
              style={{alignSelf: 'flex-end', margin: 20, flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 14,
                  opacity: 0.7,
                  fontfamily: 'Roboto-Medium',
                  color: color.white,
                }}>
                {t('Total :')}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  paddingLeft: 10,
                  fontfamily: 'Roboto-Bold',
                  color: color.white,
                }}>
                {due}
              </Text>
            </View>

            <CustomPressable
              text={t('Pay Now')}
              btnWidth={mobW - 60}
              route={''}
              isGradient={true}
              backgroundColor="#10281C"
              onPress={() => {
                setviewdetailsshow(false);
                setviewdues(true);
              }}
              position={'absolute'}
              bottom={50}
            />
          </View>
        </View>
      </Modal>

      <StatusBar translucent barStyle="light-content" />
      <View style={styles.headerBox}>
        <View style={styles.headerSubBox}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="arrowleft" color={color.white} size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.headerTitle}>{t('Return EV')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection: 'row'}} />
        </View>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, paddingBottom: mobH * 0.08}}
          scrollEnabled={true}>
          <View
            style={{
              marginTop: 30,
              height: 350,
              marginHorizontal: 30,
              width: mobW - 60,
            }}>
            <View style={Scanstyles.scrollViewStyle}>
              <QRCodeScanner
                cameraStyle={{marginTop: 30, height: 150, width: mobW - 60}}
                containerStyle={{
                  marginTop: 30,
                  width: mobW - 60,
                  height: mobH - 300,
                }}
                reactivate={true}
                showMarker={true} 
                onRead={onSuccess}
              />
            </View>
          </View>

          <View style={styles.listcontainer}>
            <View
              style={{
                marginLeft: 20,
                width: 100,
                backgroundColor: '#2A2114',
                marginTop: 10,
                borderRadius: 10,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: color.yellow,
                  fontSize: 12,
                  fontFamily: 'Roboto-Medium',
                }}>
                {inprocess}
              </Text>
            </View>

            <Text
              style={{
                color: color.white,
                textAlign: 'left',
                paddingLeft: 20,
                marginVertical: 15,
                fontSize: 20,
                fontFamily: 'Roboto-Bold',
              }}>
              {t('Bronze - Monthly (₹4,999)')}
            </Text>
            <Text
              style={[
                styles.listTitle,
                {justifyContent: 'flex-start', paddingHorizontal: 10},
              ]}>
              {t('EV Drop off Details')}
            </Text>
            <Text
              style={{
                color: color.white,
                justifyContent: 'flex-start',
                paddingLeft: 20,
                marginTop: 10,
                fontFamily: 'Roboto-Bold',
                fontSize: 16,
              }}>
              {t('DL - 7S EA 0110')}
            </Text>

            <View style={{flexDirection: 'row', marginTop: 20}}>
              <View style={{flexDirection: 'row', paddingLeft: 20}}>
                <Image
                  style={{width: 20, height: 20}}
                  source={require('../../Assests/image/calendar.png')}
                />
                <Text
                  style={[styles.listTitle, {justifyContent: 'flex-start'}]}>
                  {t('2 December 2023')}
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
                  source={require('../../Assests/image/mytrips.png')}
                />
                <Text style={[styles.listTitle, {justifyContent: 'flex-end'}]}>
                  {t('01:00 PM')}
                </Text>
              </View>
            </View>

            <View style={{flexDirection: 'row', margin: 20}}>
              <Image
                style={{
                  height: mobW * 0.045,
                  marginTop: 5,
                  resizeMode: 'contain',
                  width: mobW * 0.045,
                }}
                source={require('../../Assests/image/dis_away.png')}
              />
              <Text style={[styles.listTitle, {lineHeight: 20}]}>
                {' '}
                {dropaddress}{' '}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
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
  listbox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 60,
    marginTop: 5,
  },
  listcontainer: {
    backgroundColor: '#10281C',
    marginHorizontal: 15,
    borderRadius: 14,
  },
  headerTitle: {
    color: color.white,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginLeft: -20,
  },
  listTitle: {
    color: color.white,
    marginHorizontal: 10,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
});

const modalStyles = StyleSheet.create({
  touchOpacity: {
    borderRadius: 10,
    borderWidth: 2,
    marginHorizontal: 20,
    width: mobW - 80,
    height: '90%',
  },
  container1: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
    height: '100%',
    borderWidth: 1,
  },

  innerContainer: {
    backgroundColor: '#10281C',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    height: '65%',
    marginVertical: '30%',
  },

  innerContainer1: {
    backgroundColor: color.black_BG,
    height: mobH,
  },
  title_head: {
    fontSize: 24,
    marginTop: 20,
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    marginTop: 5,
    fontFamily: 'Roboto-Regular',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title2: {
    fontSize: 18,
    marginTop: -5,
    fontFamily: 'Roboto-Regular',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title1: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginVertical: 30,
    marginHorizontal: 26,
    lineHeight: 20,
    justifyContent: 'center',
    textAlign: 'center',
  },
  titlelist: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    paddingLeft: 10,
  },
});

const Scanstyles = {
  scrollViewStyle: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  cardView: {
    width: mobW - 32,
    height: mobH - 350,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
  },
};
