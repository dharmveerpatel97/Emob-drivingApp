import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import {color} from '../../utils/color';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import { useTranslation } from 'react-i18next';

const About = ({route, navigation}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent barStyle="light-content" />
      <View style={styles.headerSubBox}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{flexDirection: 'row', alignItems: 'center',width:'15%',marginLeft:10}}>
          <Icon name="arrowleft" color={color.white} size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.headerTitle}>{t(`${route.params.label}`)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Notification');
          }}
          style={{flexDirection: 'row', alignItems: 'center', width:'15%'}}>
          <Image
            style={{width: 40, height: 40}}
            source={require('../../Assests/image/notification_white.png')}
          />
        </TouchableOpacity>
      </View>
      {/* <Text style={styles.listTitle}>{'Version v.2..2'}</Text> */}
      {route.params.url.length > 0 ? (
        <Text style={styles.listTitle}>{route.params.url}</Text>
      ) : (
        <View
          style={{
            height: '80%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: '#ffffff', fontSize: 18}}>{t('No records found')}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default About;

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
    justifyContent:"space-between",
    marginTop: 20,
  },
  listbox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 60,
    marginTop: 5,
  },
  listcontainer: {
    backgroundColor: color.Black_light,
    marginTop: 25,
  },
  headerTitle: {
    color: color.white,
    fontSize: 20,justifyContent:'center',alignSelf:'center',textAlignVertical:'center',
    fontFamily: BOLD,
  },
  listTitle: {
    width: '96%',
    color: color.white,
    fontSize: 14,
    lineHeight: 25,
    alignSelf: 'center',
    textAlign: 'justify',
    marginTop: 30,
    paddingHorizontal: 20,
  },
});
