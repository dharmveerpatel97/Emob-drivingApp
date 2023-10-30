import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Header,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {color} from '../../utils/color';
import {mobW, mobH} from '../../utils/config';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import { useTranslation } from 'react-i18next';

export default function Notification({navigation}) {
  const {t} = useTranslation();
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
            <Text style={styles.headerTitle}>{t('Notification')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection: 'row'}} />
        </View>

        <View style={styles.listcontainer}>
           <View style={{height:'80%',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{color:"#ffffff",fontSize:18}}>{t('No records found')}</Text>
              </View>
          {/* <FlatList
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 0.5,
                  opacity: 0.5,
                  marginHorizontal: 10,
                  marginVertical: 20,
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                }}
              />
            )}
            data={[
              {
                key: 'System',
                date: 'now',
                mediatype: 'image',
                data: 'Booking #1234 hase been success...Booking #1234 hase been success...',
                image: require('../../Assests/image/Notificarion/noti1.png'),
              },
              {
                key: 'System',
                date: 'now',
                mediatype: 'image',
                data: 'Booking #1234 hase been success...Booking #1234 hase been success...',
                image: require('../../Assests/image/Notificarion/noti1.png'),
              },
              {
                key: 'System',
                date: 'now',
                mediatype: 'image',
                data: 'Booking #1234 hase been success...Booking #1234 hase been success...',
                image: require('../../Assests/image/Notificarion/noti1.png'),
              },

              {
                key: 'Promotion',
                date: '24 aug',
                mediatype: 'text',
                data: 'Invite friends - Get 3 coupon each!',
                image: require('../../Assests/image/Notificarion/noti1.png'),
              },
              {
                key: 'Promotion',
                date: '24 aug',
                mediatype: 'text',
                data: 'Invite friends - Get 3 coupon each!',
                image: require('../../Assests/image/Notificarion/noti1.png'),
              },
            ]}
            renderItem={({item}) => (
              <View style={styles.listbox}>
                <TouchableOpacity
                  style={{
                    height: 45,
                    width: 45,
                    marginHorizontal: 16,
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 55,
                      marginLeft: 10,
                      height: 55,
                      resizeMode: 'cover',
                    }}
                    source={item.image}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    marginBottom: 5,
                    flexDirection: 'column',
                    width: '65%',
                  }}>
                  <Text style={styles.listTitle}>{item.key}</Text>
                  <Text
                    style={{
                      color: color.white,
                      fontSize: 14,
                      margin: 5,
                      marginBottom: 10,
                      flexWrap: 'wrap',
                      fontFamily: REGULAR,
                    }}>
                    {item.data}
                  </Text>

                  {item.mediatype == 'image' ? (
                    <Image
                      style={{
                        width: '95%',
                        borderRadius: 10,
                        margin: 10,
                        height: 140,
                        resizeMode: 'cover',
                      }}
                      source={require('../../Assests/image/delete_failue.png')}
                    />
                  ) : null}
                </View>

                <View
                  style={{
                    justifyContent: 'flex-end',
                    right: 0,
                    position: 'absolute',
                    flexDirection: 'row',
                    marginRight: 5,
                    height: 30,
                  }}>
                  <Text
                    style={{
                      color: color.white,
                      fontSize: 12,
                      height: 20,
                      fontFamily: REGULAR,
                    }}>
                    {item.date}
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: 6,
                      height: 6,
                      margin: 5,
                      borderRadius: 3,
                      backgroundColor: '#CB0017',
                    }}></TouchableOpacity>
                </View>
              </View>
            )}
          /> */}
        </View>
        {/* <TouchableOpacity
          style={{
            borderRadius: 10,
            bottom: 0,
            marginHorizontal: 20,
            marginVertical: -20,
            backgroundColor: '#10281C',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
            width: 70,
            right: 0,
            position: 'absolute',
          }}>
          <Text
            style={{
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: 14,
              fontFamily: 'Roboto-Light',
            }}>
            {'Clear All'}
          </Text>
        </TouchableOpacity> */}
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
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  listcontainer: {
    height: '85%',
    marginTop: 25,
  },
  headerTitle: {
    color: color.white,
    fontSize: 20,
    fontFamily: BOLD,
    marginLeft: -20,
  },
  listTitle: {
    color: color.white,
    fontSize: 16,
    marginHorizontal: 5,
    fontFamily: 'Roboto-Medium',
  },
});
