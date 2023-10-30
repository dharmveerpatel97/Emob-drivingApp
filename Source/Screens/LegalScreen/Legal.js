import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Header,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  Text,
  FlatList,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {color} from '../../utils/color';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import {getTermAndCondi} from '../../Redux/appSlice';
import { useTranslation } from 'react-i18next';

export default function Legal({navigation}) {
  const {t} = useTranslation();
  const [terms, setTerms] = useState('');
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [aboutUs, setAboutUs] = useState('');
  let dispatch = useDispatch();
  useEffect(() => {
    getPolicy();
  }, []);

  // PrivacyPolicy
  // termsAndConditions

  const getPolicy = () => {
    console.log('getTermAndCond res---');
    dispatch(getTermAndCondi('policy'))
      .then(res => {
        console.log('getTermAndCond res---', res);
        if (res?.payload?.policy && res?.payload?.policy.length > 0) {
          let privacyPolicyDriver = res?.payload?.policy.filter(p => p.type=='privacyPolicyDriver')[0]?.data

          let termsConditionDriver = res?.payload?.policy.filter(p => p.type=='termsConditionDriver')[0]?.data
   
          setTerms(termsConditionDriver);
          setAboutUs(termsConditionDriver);
          setPrivacyPolicy(privacyPolicyDriver);
        }
      })
      .then(error => {
        console.log('getTermAndCond errorerror---', error);
      });
  };
   

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
            <Text style={styles.headerTitle}>{t('drawer_Legal')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection: 'row'}} />
        </View>

        <View style={styles.listcontainer}>
          <FlatList
            ItemSeparatorComponent={() => (
              <View style={{height: 2, backgroundColor: color.black_BG}} />
            )}
            data={[
              {
                key: 'About ',
                data: 'About',
                image: require('../../Assests/image/about.png'),
                dataset: aboutUs,
              },
              {
                key: 'Privacy Policy ',
                data: 'PrivatePolicy',
                image: require('../../Assests/image/file.png'),
                dataset: privacyPolicy,
              },
              {
                key: 'Terms & Conditions ',
                data: 'TermsandCon',
                image: require('../../Assests/image/terms.png'),
                dataset: terms,
              },
            ]}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => {
                navigation.navigate('About', {
                  label: item.key,
                  url: item.dataset,
                });
              }} activeOpacity={0.7} style={styles.listbox}>
                <View 
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '70%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 20,
                      backgroundColor: color.black_BG,
                      height: 40,
                      width: 40,
                      borderRadius: 8,
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{width: 20, marginLeft: 10,resizeMode:'contain', height: 20}}
                      source={item.image}
                    />
                  </View>
                  <View style={{justifyContent: 'flex-start', marginLeft: 19}}>
                    <Text numberOfLines={2} style={styles.listTitle}>
                      {t(`${item.key}`)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    marginRight: 20,
                    width: 40,
                    right: 0,
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 10,
                      height: 15,
                      marginLeft: 30,
                    }}
                    source={require('../../Assests/image/next.png')}
                  />
                </View>
              </TouchableOpacity>
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
    alignItems: 'center',
    paddingVertical: 10,
  },
  listcontainer: {
    backgroundColor: color.Black_light,
    marginTop: 25,
  },
  headerTitle: {
    color: color.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: -20,
  },
  listTitle: {
    color: color.white,
    fontSize: 16,
  },
});
