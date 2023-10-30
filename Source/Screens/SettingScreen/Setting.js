import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {color} from '../../utils/color';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import {BOLD} from '../../utils/fonts';
import {useTranslation} from 'react-i18next';
import { userActivateDeactivate } from '../../Redux/appSlice';

export default function Setting({navigation}) {
  const {t} = useTranslation();

  const dispatch = useDispatch();
  const btnClick=(item)=>{
    if(item.data=='DeactivateAccount'){
      Alert.alert(t('confirmMsgTitle'),
      t('accountDeavtivationMsg'),
        [
          {
            text:  t('No'),
          },
          {
            text: t('Yes'),
            onPress: () => {
              dispatch(userActivateDeactivate(false)).then((response)=>{
                if(response?.payload?.message=='Success'){
                  navigation.goBack();
                }
                console.log('userActivateDeactivate',response)
              })
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    }else{
      item.data && navigation.navigate(item.data)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
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
            <Text style={styles.headerTitle}>{t('drawer_Settings')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection: 'row'}} />
        </View>

        <View style={styles.listcontainer}>
          <FlatList
            ItemSeparatorComponent={() => (
              <View style={{height: 1, backgroundColor: color.dividerLine}} />
            )}
            data={[
              {
                key: 'Payments',
                data: '',
                image: require('../../Assests/image/payement.png'),
              },
              {
                key: 'Notification_Preferences',
                data: 'Notificationpref',
                image: require('../../Assests/image/notiPrefernce.png'),
              },
              {
                key: 'Delete_My_Account',
                data: 'Deletemyac',
                image: require('../../Assests/image/delete-account.png'),
              },
              {
                key: 'Deactivate_My_Account',
                data: 'DeactivateAccount',
                image: require('../../Assests/image/delete-account.png'),
              },
            ]}
            renderItem={({item}) => (
              <View style={styles.listbox}>
                <TouchableOpacity
                 disabled={item.key == 'Payments' ? true :false}
                  onPress={() => {
                    btnClick(item)
                  }}
                  style={{
                    flexDirection: 'row',
                    opacity:item.key == 'Payments' ? 0.2 :1,
                    alignItems: 'center',
                    width: '70%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 20,
                      // backgroundColor: color.black_BG,
                      height: 40,
                      width: 40,
                      borderRadius: 8,
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{width: 20, marginLeft: 10, height: 20}}
                      source={item.image}
                    />
                  </View>
                  <View style={{justifyContent: 'flex-start', marginLeft: 19}}>
                    <Text style={styles.listTitle}>{t(item.key)}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity   onPress={() => {
                    btnClick(item)
                  }}
                  style={{
                    width: 40,
                    alignItems: 'center',opacity:item.key == 'Payments' ? 0.2 :1,
                    marginRight: 20,
                  }}>
                  <Image
                    style={{
                      width: 10,
                      height: 15,
                      marginLeft: 30,
                    }}
                    source={require('../../Assests/image/next.png')}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.black_BG,
    flex: 1,
    paddingVertical: 20,
  },
  headerBox: {
    paddingTop: mobH * 0.032,
  },
  headerSubBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0.037 * mobW,
  },
  listbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    alignItems: 'center',
  },
  listcontainer: {
    // backgroundColor: color.Black_light,
    marginTop: 25,
  },
  headerTitle: {
    color: color.white,
    fontSize: 20,
    fontFamily:BOLD,
    // marginLeft: -20,
  },
  listTitle: {
    color: color.white,
    fontSize: 16,
    // marginTop: 15,
  },
});
