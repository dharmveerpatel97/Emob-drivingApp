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
} from 'react-native';
import React, {useEffect} from 'react';
import arrowRight from '../../Assests/image/arrowRight.png';
import supportImage from '../../Assests/image/supportN.png';
import {color} from '../../utils/color';
import {mobW, mobH} from '../../utils/commonFunction';
import {DrawerActions} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {getDriverProfileInfo, getUserProfile} from '../../Redux/appSlice';
import {useDispatch, useSelector} from 'react-redux';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
export default function VerificationProcess({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const app = useSelector(state => state.app);
  console.log('home app 2', app);
  useEffect(() => {
    getUserProfileInfo();
  }, []);
  useEffect(() => {
    dispatch(getDriverProfileInfo());
    console.log(
      'app.driverDetail?.profilePicPath',
      app.driverDetail?.profilePicPath,
    );
  }, []);

  const getUserProfileInfo = async () => {
    dispatch(getUserProfile())
      .then(res => {
        console.log('getUserProfile', res.payload);
      })
      .catch(() => {
        ToastAndroid.show(t('errorOccured'), ToastAndroid.SHORT);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
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
              }}
              source={require('../../Assests/image/blueBars.png')}
            />
          </Pressable>

          <View style={styles.topContainer_text}>
            <Text
              style={[styles.innerText, {width: mobW * 0.4}]}
              numberOfLines={1}>
              {' '}
              {t('hello')}, {app?.driverProfileInfo?.name?.trim()}!
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

      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: mobH * 0.1}}
        scrollEnabled={true}>
        <View
          style={{
            justifyContent: 'center',
            marginTop: 40,
            alignItems: 'center',
          }}>
          <Image
            style={{width: 210, height: 190, resizeMode: 'cover'}}
            source={require('../../Assests/image/doc_under_proc.png')}
          />
        </View>

        <Text style={styles.listTitle_suc}>
          {' '}
          {t('VerificationProcess_des11')} {'\n'}{' '}
          {t('VerificationProcess_des12')}
        </Text>
        <Text style={styles.listTitle1}>
          {t('VerificationProcess_des21')} {'\n'}{' '}
          {t('VerificationProcess_des22')}
        </Text>
        <Text style={styles.listTitle1}>
          {t('VerificationProcess_des31')} {'\n'}{' '}
          {t('VerificationProcess_des32')}
        </Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Support');
          }}
          style={styles.bottomContainer}>
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
                fontFamily: BOLD,
              }}>
              {' '}
              {t('home_help_support')}
            </Text>
            <Text
              style={{
                fontSize: 12,
                opacity: 0.6,
                fontFamily: 'Roboto-Light',
                color: 'white',
              }}>
              {' '}
              {t('home_click_here')}
            </Text>
          </View>
          <Image
            style={{
              width: 30,
              height: 30,
              backgroundColor: '#001A0F',
              borderRadius: 40,
            }}
            source={arrowRight}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black_BG,
  },
  topContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 16,
    marginTop: mobH * 0.056,
  },
  topContainer_text: {
    display: 'flex',
    justifyContent: 'center',
  },
  innerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    fontFamily: BOLD,
  },

  listTitle_suc: {
    width: '80%',
    textAlign: 'center',
    lineHeight: 30,
    alignSelf: 'center',
    color: '#00AF66',
    flexWrap: 'wrap',
    marginTop: 30,
    fontSize: 20,
    marginBottom: 40,
    fontFamily: 'Roboto-Medium',
  },
  listTitle1: {
    width: '90%',
    textAlign: 'center',
    alignSelf: 'center',
    lineHeight: 25,
    color: '#FFFFFF',
    fontFamily: REGULAR,
    fontSize: 14,
    marginBottom: 40,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 16,
    borderRadius: 10,
    borderColor: '#10281C',
    borderWidth: 2,
    backgroundColor: '#10281C',
    paddingVertical: 10,
  },
});
