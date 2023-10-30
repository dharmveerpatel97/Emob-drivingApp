import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Header,
  StyleSheet,
  StatusBar,
  ImageBackground,
  SafeAreaView,
  Platform,
  Text,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import {color} from '../../utils/color';
import {mobW, mobH} from '../../utils/config';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import starimage from '../../Assests/image/star.png';
import fillstarimage from '../../Assests/image/fill_star.png';
import CustomPressable from '../customComp/CustomPressable';
import {useTranslation} from 'react-i18next';

const SubmitReview = ({route, navigation}) => {
  const {t} = useTranslation();
  const [text, settext] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={{resizeMode: 'cover', height: mobH / 2, width: mobW}}
        source={require('../../Assests/image/submitrevie_bg.png')}>
        <View style={{height: mobH, width: mobW}}>
          <StatusBar translucent barStyle="light-content" />
          <View
            style={{
              marginTop: 60,
              paddingHorizontal: 0.037 * mobW,
              height: 30,
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrowleft" color={color.white} size={24} />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              textAlign: 'center',
              color: color.white,
              marginTop: 40,
              fontSize: 20,
              fontFamily: 'Roboto-Bold',
            }}>
            {' '}
            {t('Thank You')}{' '}
          </Text>

          <View
            style={{
              marginTop: 20,
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 70, height: 70, resizeMode: 'cover'}}
              source={require('../../Assests/image/profile.png')}
            />
          </View>

          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              height: 30,
              alignItems: 'center',
              marginTop: 30,
            }}>
            <Image
              style={{width: 30, height: 30, marginHorizontal: 5}}
              source={route.params.rating >= 1 ? fillstarimage : starimage}
            />

            <Image
              style={{width: 30, height: 30, marginHorizontal: 5}}
              source={route.params.rating >= 2 ? fillstarimage : starimage}
            />
            <Image
              style={{width: 30, height: 30, marginHorizontal: 5}}
              source={route.params.rating >= 3 ? fillstarimage : starimage}
            />
            <Image
              style={{width: 30, height: 30, marginHorizontal: 5}}
              source={route.params.rating >= 4 ? fillstarimage : starimage}
            />
            <Image
              style={{width: 30, height: 30, marginHorizontal: 5}}
              source={route.params.rating >= 5 ? fillstarimage : starimage}
            />
          </View>

          <Text
            style={{
              textAlign: 'center',
              color: color.white,
              marginTop: 40,
              fontSize: 16,
              fontFamily: 'Roboto-Medium',
            }}>
            {' '}
            {t('We are glad to hear from you.')}{' '}
          </Text>
          <TextInput
            style={styles.input}
            value={text}
            placeholder="Type here ..."
            placeholderTextColor={color.white}
            returnKeyType="next"
            onChangeText={text => settext(text)}
            multiline={true}
          />
          <Text
            style={{
              textAlign: 'center',
              opacity: 0.7,
              color: color.white,
              lineHeight: 20,
              paddingHorizontal: 50,
              fontSize: 16,
              fontFamily: 'Roboto-Regular',
              flexWrap: 'wrap',
            }}>
            {' '}
            {t('Your feedback will help US improve driving experience better.')}{' '}
          </Text>

          <CustomPressable
            text={t('Submit')}
            btnWidth={mobW - 60}
            route={'home'}
            isGradient={true}
            backgroundColor="#10281C"
            onPress={() => {
              navigation.navigate('home');
            }}
            position={'absolute'}
            bottom={50}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SubmitReview;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#001A0F'},
  input: {
    marginHorizontal: 16,
    marginVertical: 40,
    padding: 20,
    color: color.white,
    lineHeight: 20,
    fontSize: 18,
    backgroundColor: '#10281C',
    borderRadius: 10,
    height: 170,
    textAlignVertical: 'top',
  },
  headerTitle: {color: color.white, fontSize: 20, fontWeight: 'bold'},
});
