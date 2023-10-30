import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {color} from '../../utils/color';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {resetStack} from '../../utils/commonFunction';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import {useTranslation} from 'react-i18next';

const Driversuccessful = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent barStyle="light-content" />
      <TouchableOpacity
        onPress={() => navigation.navigate('VerificationProcess')}>
        <TouchableOpacity
          onPress={() => {
            resetStack('UnverifiedDrawer', navigation);
            navigation.navigate('VerificationProcess');
          }}
          style={{
            alignItems: 'center',
            position: 'absolute',
            right: 0,
            marginHorizontal: 25,
            marginVertical: 40,
          }}>
          <Icon name="close" color={color.white} size={24} />
        </TouchableOpacity>

        <View
          style={{
            justifyContent: 'center',
            marginBottom: 30,
            marginTop: 160,
            alignItems: 'center',
          }}>
          <Image
            style={{width: 200, height: 200, resizeMode: 'cover'}}
            source={require('../../Assests/image/doc_succes.png')}
          />
        </View>
        <Text style={styles.listTitle_suc}>
          {' '}
          {t('driverSucc_msg1')} {'\n'}
          {t('driverSucc_msg2')}
        </Text>
        <Text style={styles.listTitle1}>
          {t('driverSucc_msg3')} {'\n'} {t('driverSucc_msg4')}
        </Text>
        <Text style={styles.listTitle1}>{t('driverSucc_Thankyou')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Driversuccessful;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.black_BG,
    flex: 1,
    paddingVertical: 20,
  },

  listTitle_suc: {
    width: '100%',
    textAlign: 'center',
    lineHeight: 30,
    color: color.purpleborder,
    flexWrap: 'wrap',
    marginTop: 30,
    fontSize: 20,
    marginBottom: 50,
    fontFamily: 'Roboto-Medium',
  },
  listTitle1: {
    width: '100%',
    textAlign: 'center',
    lineHeight: 25,
    color: color.white,
    fontSize: 14,
    marginBottom: 50,
    fontFamily: REGULAR,
  },
});
