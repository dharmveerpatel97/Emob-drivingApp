import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import {mobW, mobH} from '../../utils/config';
import {color} from '../../utils/color';
import CustomTripButton from '../customComp/CustomTripButton';
import {t} from 'i18next';
import CustomToastProvider from '../customComp/CustomToastProvider';
import moment from 'moment';
import {useEffect, useRef, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
const NonPassengerride = ({isnonpassengerride, rideDetails}) => {
  const [Dtime, setDtime] = useState(rideDetails?.createdAt);

  function formatUnixTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    StorageProvider.getItem('droptiming').then(res => {
      let drop1 = parseFloat(res) + timestamp;
      const date = new Date(drop1 * 1000);
      dropdate = moment(date).format('h:mm A');
      setDtime(dropdate);
    });
    return moment(date).format('h:mm A');
  }

  return (
    <Modal transparent visible={isnonpassengerride}>
      <View style={styles.container}>
        <CustomToastProvider />
        <View style={styles.innerContainer}>
          <View style={styles.topContainer}>
            <View style={[styles.imgContainer, {width: '10%'}]}>
              <Image
                source={require('../../Assests/image/distance.png')}
                style={{height: 20, width: 20,resizeMode:'contain'}}
              />

              <View style={styles.dotedIcons} />
              <Image
                source={require('../../Assests/image/dis_away.png')}
                style={{resizeMode: 'contain', height: 20, width: 20}}
              />
            </View>
            <View style={{height: '100%', width: '70%'}}>
              <View style={{marginHorizontal: 10}}>
                <Text
                  style={{
                    fontsize: 12,
                    opacity: 0.6,
                    fontFamily: REGULAR,
                    color: color.white,
                  }}>
                  {t('Pickup Location')}
                </Text>
                <Text
                  style={{
                    fontsize: 16,
                    height: 20,
                    flexShrink: 1,
                    flexWrap: 'nowrap',
                    fontFamily: BOLD,
                    color: '#ffffff',
                    marginTop: 5,
                  }}>
                  {rideDetails?.source?.address}
                </Text>
              </View>

              <View style={{marginHorizontal: 10, marginTop: 10}}>
                <Text
                  style={{
                    fontsize: 12,
                    opacity: 0.6,
                    fontFamily: REGULAR,
                    color: color.white,
                  }}>
                  {t('Drop Location')}
                </Text>
                <Text
                  style={{
                    fontsize: 16,
                    fontFamily: BOLD,
                    color: '#ffffff',
                    marginTop: 5,
                  }}>
                  {rideDetails?.destination?.address}
                </Text>
              </View>
            </View>

            <View style={{height: '100%', width: '20%'}}>
              <View style={{alignItems: 'flex-end', marginTop: 10}}>
                <Text
                  style={{
                    fontsize: 12,
                    opacity: 0.6,
                    fontFamily: REGULAR,
                    color: color.white,
                    width: '100%',
                  }}>
                  {formatUnixTimestamp(rideDetails?.createdAt)}
                </Text>
              </View>

              <View style={{marginTop: 40, alignItems: 'flex-end'}}>
                <Text
                  style={{
                    fontsize: 12,
                    opacity: 0.6,
                    fontFamily: REGULAR,
                    color: color.white,
                    width: '100%',
                  }}>
                  {Dtime}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    height: 130,
    width: '100%',
  },
  innerContainer: {
    width: mobW - 20,
    height: '100%',
    marginHorizontal: 16,

    backgroundColor: '#10281C',
    alignSelf: 'center',
    borderRadius: 10,
  },
  topContainer: {
    alignItems: 'center',
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    height: '100%',
  },
  imgContainer: {
    marginEnd: 10,
    height: '90%',
    alignItems: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#10281C',

    borderRadius: 10,
    height: 50,
    marginBottom: 5,
    padding: Platform.OS == 'android' ? 0 : 12,
    width: '100%',
  },
  dotedIcons: {
    borderStyle: 'dotted',
    height: 50,
    borderLeftWidth: 2,
    borderColor: color.white,
  },
});
export default NonPassengerride;
