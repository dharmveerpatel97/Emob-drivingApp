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
import { mobH} from '../../utils/config';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { useTranslation } from 'react-i18next';

const Deletefailure = ({route, navigation}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent barStyle="light-content" />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          alignItems: 'center',
          position: 'absolute',
          right: 0,
          marginHorizontal: 25,
          marginVertical: 50,
        }}>
        <Icon name="close" color={color.white} size={24} />
      </TouchableOpacity>

      <View
        style={{
          justifyContent: 'center',
          marginTop: mobH * 0.2,
          alignItems: 'center',
        }}>
        {route.params.showmsg ? (
          <Image
            style={{width: 300, height: 230, resizeMode: 'contain'}}
            source={require('../../Assests/image/delelet_success.png')}
          />
        ) : (
          <Image
            style={{width: 300, height: 230, resizeMode: 'contain'}}
            source={require('../../Assests/image/delete_failue.png')}
          />
        )}
      </View>
      {route.params.showmsg ? (
        <Text style={styles.listTitle_suc}>{t('Deleted Successfully!')}</Text>
      ) : (
        <Text style={styles.listTitle}>{t('Deletion Failure!')}</Text>
      )}
      {route.params.showmsg ? (
        <Text style={styles.listTitle1}>
          {t('Your Account has been permanently removed.')}
        </Text>
      ) : (
        <Text style={styles.listTitle1}>
          {t('Your Account has not been removed.')}
        </Text>
      )}
    </SafeAreaView>
  );
};

export default Deletefailure;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.black_BG,
    flex: 1,
    paddingVertical: 20,
  },

  headerTitle: {
    color: color.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  listTitle: {
    width: '100%',
    textAlign: 'center',
    color: color.red_title,
    fontSize: 20,
    height: 30,
    marginVertical: 30,
  },

  listTitle_suc: {
    width: '100%',
    textAlign: 'center',
    color: '#68C692',
    fontSize: 20,
    height: 30,
    marginVertical: 30,
  },
  listTitle1: {
    width: '100%',
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    height: 40,
  },
});
