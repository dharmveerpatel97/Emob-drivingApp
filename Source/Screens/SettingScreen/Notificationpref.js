import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import { getNotificationPre, updateNotificationPre } from '../../Redux/appSlice';
import {color} from '../../utils/color';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import {useDispatch} from 'react-redux';
import { useTranslation } from 'react-i18next';
export default NotiPre = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  //Psh notification
  const [pushNoti, setPushNoti] = useState(false);
  const [updateNoti, setUpdateNoti] = useState(false);
  //Email notifucation
  const [emailOffers, setEmailOffers] = useState(false);
  const [emailPermission, setEmailPermission] = useState(false);

  const toggleSwitch = setIsEnabled => {
    setIsEnabled(previousState => !previousState);
    // setnotification()
  };

  let dispatch = useDispatch();

  useEffect(() => {
    Getnotification();
  }, []);

  const Getnotification = () => {
    dispatch(getNotificationPre())
      .then(res => {
        if (res.payload) {
          setEmailOffers(res?.payload?.promotionalEmail);
          setEmailPermission(res?.payload?.AppEmail);
          setPushNoti(res?.payload?.mobilePushNotification);
          setUpdateNoti(res?.payload?.updatesInPushNotification);
        }
        console.log('getNotificationPre', res);
      })
      .catch(error => {
        console.log('getNotificationPre', error);
      });
  };

  const setnotification = async () => {
    let data = {
      mobilePushNotification: pushNoti,
      updatesInPushNotification: updateNoti,
      promotionalEmail: emailOffers,
      AppEmail: emailPermission,
    };
    dispatch(updateNotificationPre(data))
      .then(res => {
        console.log('updateNotificationPre', res);
      })
      .catch(error => {
        console.log('updateNotificationPre', error);
      });
  };

  useEffect(() => {
    setnotification();
  }, [pushNoti, updateNoti, emailOffers, emailPermission]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color.black_BG}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.headerSubBox}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="arrowleft" color={'#FFF'} size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.headerTitle}>{t('Notification Preferences')}</Text>
          </TouchableOpacity>
          <TouchableOpacity></TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexDirection: 'column',
            flex: 1,
          }}>
          <View
            style={{
              justifyContent: 'center',
              paddingHorizontal: 16,
              marginTop: 10,
              backgroundColor: '#001A0F',
            }}>
            <View
              style={{
                justifyContent: 'center',
                marginTop: 30,
                marginBottom: 5,
                backgroundColor: '#001A0F',
              }}>
              <Text
                style={{
                  fontSize: 16,fontFamily:'Roboto-Light',
                  color: color.white,
                }}>
                {t('Push Notification')}
              </Text>
            </View>

            <View style={styles.notiCont}>
              <Text style={styles.notifText}>
                {t('Allow mobile push notifications')}
              </Text>
              <Switch
                trackColor={{false: '#767577', true: '#00AF66'}}
                thumbColor={pushNoti ? '#ffff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch(setPushNoti)}
                value={pushNoti}
              />
            </View>
            <View style={styles.notiCont}>
              <Text style={styles.notifText}>
                {t('Allow updates to be sent in push notification')}
              </Text>
              <Switch
                trackColor={{false: '#767577', true: '#00AF66'}}
                thumbColor={updateNoti ? '#ffff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch(setUpdateNoti)}
                value={updateNoti}
              />
            </View>
          </View>

          <View
            style={{
              justifyContent: 'center',
              paddingHorizontal: 16,
              marginTop: 10,
              backgroundColor: '#001A0F',
            }}>
            <View
              style={{
                justifyContent: 'center',
                marginTop: 15,
                marginBottom: 5,
                backgroundColor: '#001A0F',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#fff',fontFamily:BOLD
                }}>
                {t('Email')}
              </Text>
            </View>

            <View style={styles.notiCont}>
              <Text style={styles.notifText}>
                {t('Allow emails for promotions & offers')}
              </Text>
              <Switch
                trackColor={{false: '#767577', true: '#00AF66'}}
                thumbColor={emailOffers ? '#ffff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch(setEmailOffers)}
                value={emailOffers}
              />
            </View>
            <View style={styles.notiCont}>
              <Text style={styles.notifText}>{t('Allow emails from this app')}</Text>
              <Switch
                trackColor={{false: '#767577', true: '#00AF66'}}
                thumbColor={emailPermission ? '#ffff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch(setEmailPermission)}
                value={emailPermission}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerBox: {
    paddingTop: mobH * 0.032,
  },
  headerSubBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0.037 * mobW,
    marginTop: 40,
  },
  item: {
    flexDirection: 'row',
    height: 54,
    borderColor: '#6666',
    borderWidth: 0.35,
    marginVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    opacity: '30%',
  },
  notifText: {
    fontSize: 14,
    opacity: 0.8,
    color: '#fff',
  },
  notiCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },

  title: {fontSize: 14, color: '#00AF66'},
  topHeading: {
    fontSize: 20,

    color: '#68C692',
    textAlign: 'center',
  },
  modalContainer: {
    paddingVertical: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: BOLD,
    marginLeft: -20,
  },
});
