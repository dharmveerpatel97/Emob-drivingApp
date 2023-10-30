import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import {color} from '../../utils/color';
import {mobW, mobH} from '../../utils/config';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import starimage from '../../Assests/image/star.png';
import fillstarimage from '../../Assests/image/fill_star.png';
import {useTranslation} from 'react-i18next';

const Returnev_review = ({route, navigation}) => {
  const {t} = useTranslation();
  const [returnstatus, setreturnstatus] = useState(false);
  const [starRating, setStarRating] = useState(0);

  const RatingClick = val => {
    navigation.navigate('SubmitReview', {rating: val});
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent barStyle="light-content" />
      <View style={styles.headerSubBox}>
        <TouchableOpacity></TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.headerTitle}>{t('Return EV')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('home')}
          style={{flexDirection: 'row', marginRight: 15, alignItems: 'center'}}>
          <Icon name="close" color={color.white} size={24} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          justifyContent: 'center',
          marginTop: mobH * 0.1,
          alignItems: 'center',
        }}>
        <Image
          style={{width: 250, height: 170, resizeMode: 'contain'}}
          source={require('../../Assests/image/returnev.png')}
        />
      </View>
      {returnstatus ? (
        <View style={{marginTop: mobH / 9}}>
          <Text
            style={{
              paddingHorizontal: 50,
              lineHeight: 30,
              flexWrap: 'wrap',
              width: '100%',
              textAlign: 'center',
              color: '#68C692',
              alignItems: 'center',
              fontSize: 20,
              fontFamily: 'Roboto-Bold',
            }}>
            {' '}
            {t('Thanks for Returning the EV')}
          </Text>
          <Text
            style={{
              marginTop: mobH / 16,
              paddingHorizontal: 30,
              lineHeight: 25,
              flexWrap: 'wrap',
              width: '100%',
              textAlign: 'center',
              color: color.white,
              alignItems: 'center',
              fontSize: 14,
              fontFamily: 'Roboto-Regular',
            }}>
            {' '}
            {t('We hope to see you again.')}
          </Text>
          <View
            style={{width: '100%', padding: 16, height: 120, marginTop: 30}}>
            <ImageBackground
              style={{resizeMode: 'cover', margin: 10, height: 120}}
              source={require('../../Assests/image/returnev_bg.png')}>
              <Text
                style={{
                  fontSize: 18,
                  marginVertical: 20,
                  textAlign: 'center',
                  color: color.white,
                  fontFamily: 'Roboto-Bold',
                }}>
                {t('Kindly share you feedback')}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  height: 30,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{marginHorizontal: 5}}
                  onPress={() => RatingClick(1)}>
                  <Image
                    style={{width: 30, height: 30}}
                    source={starRating >= 1 ? fillstarimage : starimage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginHorizontal: 5}}
                  onPress={() => RatingClick(2)}>
                  <Image
                    style={{width: 30, height: 30}}
                    source={starRating >= 2 ? fillstarimage : starimage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginHorizontal: 5}}
                  onPress={() => RatingClick(3)}>
                  <Image
                    style={{width: 30, height: 30}}
                    source={starRating >= 3 ? fillstarimage : starimage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginHorizontal: 5}}
                  onPress={() => RatingClick(4)}>
                  <Image
                    style={{width: 30, height: 30}}
                    source={starRating >= 4 ? fillstarimage : starimage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginHorizontal: 5}}
                  onPress={() => RatingClick(5)}>
                  <Image
                    style={{width: 30, height: 30}}
                    source={starRating >= 5 ? fillstarimage : starimage}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </View>
      ) : (
        <View style={{marginTop: mobH / 8}}>
          <Text
            style={{
              marginTop: mobH / 8,
              paddingHorizontal: 50,
              lineHeight: 30,
              flexWrap: 'wrap',
              width: '100%',
              textAlign: 'center',
              color: '#FF9401',
              alignItems: 'center',
              fontSize: 20,
              fontFamily: 'Roboto-Bold',
            }}>
            {' '}
            {t('Operator is processing your return request.')}
          </Text>
          <Text
            style={{
              marginTop: mobH / 16,
              paddingHorizontal: 30,
              lineHeight: 25,
              flexWrap: 'wrap',
              width: '100%',
              textAlign: 'center',
              color: color.white,
              alignItems: 'center',
              fontSize: 14,
              fontFamily: 'Roboto-Regular',
            }}>
            {' '}
            {t('Kindly wait for the operator to inspect and take some action regarding your return.')}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Returnev_review;

const styles = StyleSheet.create({
  container: {backgroundColor: color.black_BG, flex: 1, paddingVertical: 20},
  headerSubBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0.037 * mobW,
    marginTop: 50,
  },
  headerTitle: {color: color.white, fontSize: 20, fontWeight: 'bold'},
});
