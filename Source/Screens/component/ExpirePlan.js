import {
  View,
  Dimensions,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import QrCodeGenerator from '../../utils/QrCodeGenerator';
import {color} from '../../utils/color';
import {useState} from 'react';
import {t} from 'i18next';
import {useTranslation} from 'react-i18next';

import CustomPressable from '../customComp/CustomPressable';
import SwipeButton from '../../rn-swipe-button';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const ExpirePlan = ({showExpirePlan, onclose, onswipe}) => {
  const {t} = useTranslation();

  return (
    <Modal transparent visible={showExpirePlan}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View
            style={{
              borderRadius: 30,
              height: 50,
              marginLeft: 40,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                onswipe();
              }}
              style={{
                backgroundColor: '#FE4A5E',
                borderRadius: 30,
                height: 50,
                width: '85%',
              }}>
              <View
                style={{
                  height: 50,
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-start',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    paddingLeft: 25,
                    fontFamily: REGULAR,
                    color: color.white,
                    alignSelf: 'center',
                  }}>
                  {' '}
                  {t('ExpirePLan_YourPlanIsExpiring')}
                </Text>
                <Image
                  source={require('../../Assests/image/next.png')}
                  style={{
                    height: 15,
                    width: 15,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                    right: 25,
                    position: 'absolute',
                  }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onclose();
              }}
              style={{height: 20, width: 20, alignSelf: 'center'}}>
              <Image
                source={require('../../Assests/image/cross.png')}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  right: 15,
                  position: 'absolute',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#001A0F80',
  },
  innerContainer: {
    width: width - 20,
    height: 50,
    marginTop: 100,
  },
});
export default ExpirePlan;
