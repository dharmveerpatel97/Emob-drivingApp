import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  StatusBar,
  ToastAndroid,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {color} from '../../utils/color';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import CustomPressable from '../customComp/CustomPressable';
import {useTranslation} from 'react-i18next';
import RestApiClient from '../../network/RestApiClient';
import {endPoints, methods, urlReqType} from '../../utils/config';
import {useFocusEffect} from '@react-navigation/native';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
export default function Support({navigation}) {
  const {t} = useTranslation();
  useEffect(() => {
    //  getPolicy();
  }, []);
  const [userData, setUserData] = useState({
    userName: '',
    userEmail: '',
    usermsg: '',
  });

  useFocusEffect(
    useCallback(() => {
      setUserData({
        userName: '',
        userEmail: '',
        usermsg: '',
      });
    }, []),
  );

  const [isLoading, setIsLoading] = useState(false);

  const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const onsend = async () => {
    let vailidation_flag = true;
    if (!userData?.userName) {
      vailidation_flag = false;
      ToastAndroid.show(t('supportEmptyName'), ToastAndroid.SHORT);
    } else if (!userData?.userEmail) {
      vailidation_flag = false;
      ToastAndroid.show(t('supportEmptyEmail'), ToastAndroid.SHORT);
    } else if (!userData?.usermsg) {
      vailidation_flag = false;
      ToastAndroid.show(t('supportEmptyMSG'), ToastAndroid.SHORT);
    }
    else if (!email_regex.test(userData.userEmail)) {
      vailidation_flag = false;
      ToastAndroid.show(t('supportValidEmail'), ToastAndroid.SHORT);
    }

    if (vailidation_flag) {
      setIsLoading(true);
      await StorageProvider.getObject('accessToken')
        .then(res => {
          if (res) {
            const body = {
              name: userData.userName,
              email: userData.userEmail,
              message: userData.usermsg,
            };

            RestApiClient(
              methods.POST,
              JSON.stringify(body),
              endPoints.SUPPROT_SEND,
              urlReqType.DMS,
              res?.accesstoken,
            )
              .then(response => {
                console.log('response support', response);
                if (response?.message == 'Success') {
                  setIsLoading(false);

                  setUserData({userName: '', userEmail: '', usermsg: ''});

                  navigation.goBack();
                  ToastAndroid.show(
                    t('supportMSGSucc'),
                    ToastAndroid.SHORT,
                  );
                } else {
                  setIsLoading(false);
                  ToastAndroid.show(t('errorOccured'), ToastAndroid.SHORT);
                }
              })
              .catch(error => {
                ToastAndroid.show(
                  t('errorOccured'),
                  ToastAndroid.SHORT,
                );
                console.log(error);
              });
          }
        })
        .catch(err => {
          ToastAndroid.show(
            t('errorOccured'),
            ToastAndroid.SHORT,
          );
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent barStyle="light-content" />

      <View style={styles.headerSubBox}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="arrowleft" color={color.white} size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.headerTitle}> {t('supportTXT')} </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Notification');
          }}
          style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
          <Image
            style={{width: 40, height: 40}}
            source={require('../../Assests/image/notification_white.png')}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: mobH * 0.08}}
        scrollEnabled={true}>
        <View
          style={{
            justifyContent: 'center',
            marginTop: 20,
            alignItems: 'center',
          }}>
          <Image
            style={{width: 200, height: 150, resizeMode: 'contain'}}
            source={require('../../Assests/image/back_support.png')}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flexDirection: 'row',
              width: '45%',
              height: 50,
              margin: 20,
            }}>
            <View
              style={{
                height: 44,
                width: 44,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                backgroundColor: '#10281C',
                borderRadius: 22,
              }}>
              <Image
                style={{height: 20, width: 20, resizeMode: 'contain',tintColor:color.purpleborder}}
                source={require('../../Assests/image/email_s.png')}></Image>
            </View>
            <Text
              style={{
                marginLeft: 10,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                fontSize: 14,
                color: color.white,
                fontFamily: 'Roboto-Regular',
              }}>
              {'info@emobility.vom'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '40%',
              height: 50,
              marginTop: 20,
            }}>
            <View
              style={{
                height: 44,
                width: 44,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                backgroundColor: '#10281C',
                borderRadius: 22,
                marginLeft: 10,
              }}>
              <Image
                style={{height: 20, width: 20, resizeMode: 'contain',tintColor:color.purpleborder}}
                source={require('../../Assests/image/mobile_s.png')}></Image>
            </View>
            <Text
              style={{
                marginLeft: 10,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                fontSize: 14,
                color: color.white,
                fontFamily: 'Roboto-Regular',
              }}>
              {'+011 1234567'}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '40%',
            height: 50,
            marginLeft: 20,
          }}>
          <View
            style={{
              height: 44,
              width: 44,
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              backgroundColor: '#10281C',
              borderRadius: 22,
            }}>
            <Image
              style={{height: 20, width: 20, resizeMode: 'contain',tintColor:color.purpleborder}}
              source={require('../../Assests/image/call_s.png')}></Image>
          </View>
          <Text
            style={{
              marginLeft: 10,
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              fontSize: 14,
              color: color.white,
              fontFamily: 'Roboto-Regular',
            }}>
            {'1234567890'}
          </Text>
        </View>
        <View style={[styles.blockStyle, {height: 240}]}>
          <TextInput
            value={userData.userName}
            placeholder={t('name')}
            placeholderTextColor={color.white}
            onChangeText={e => {
              setUserData({...userData, userName: e});
            }}
            style={{
              color: color.white,
              height: 40,
              marginHorizontal: 20,
              marginVertical: 10,
            }}
          />
          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: color.white,
              opacity: 0.6,
              height: 1,
            }}></View>
          <TextInput
            value={userData.userEmail}
            placeholder={t("Email ID")}
            placeholderTextColor={color.white}
            onChangeText={e => {
              setUserData({...userData, userEmail: e});
            }}
            style={{
              color: color.white,
              height: 50,
              marginHorizontal: 20,
              marginTop: 10,
            }}
          />

          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: color.white,
              opacity: 0.6,
              height: 1,
            }}></View>
          <TextInput
            value={userData.usermsg}
            multiline={true}
            placeholder={t('supportMessageTXT')}
            placeholderTextColor={color.white}
            keyboardAppearance={'dark'}
            keyboardType={'default'}
            onChangeText={e => {
              setUserData({...userData, usermsg: e});
            }}
            style={{
              color: color.white,
              height: 80,
              marginHorizontal: 20,
              marginTop: 10,
              textAlignVertical: 'top',
            }}
          />
        </View>
        <CustomPressable
          text={t('supportSendTXT')}
          marginTop={80}
          onPress={() => onsend()}
          isLoading={isLoading}
          btnWidth={mobW / 1.2}
          ErrorMessage={''}
          position={'absolute'}
          bottom={10}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: color.black_BG, flex: 1, paddingVertical: 20},

  headerBox: {paddingTop: mobH * 0.032},
  headerSubBox: {
    paddingTop: mobH * 0.032,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0.037 * mobW,
  },
  blockStyle: {
    marginHorizontal: 16,
    marginVertical: 30,
    backgroundColor: '#10281C',
    borderRadius: 10,
    borderColor: '#707070',
    borderWidth: 1,
  },
  headerTitle: {
    color: color.white,
    fontSize: 20,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontFamily: 'Robot-Bold',
    height: 40,
  },
});
