import {useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import {color} from '../../../utils/color';
import {BOLD} from '../../../utils/fonts';
import { useTranslation } from 'react-i18next';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const AcceptButton = ({onPress, requestAcceptTimer}) => {
  const {t} = useTranslation();
  return (
    <TouchableOpacity
        disabled={(requestAcceptTimer==0)?true:false}
      onPress={() => {
        onPress();
      }}
      style={{
        width: WIDTH / 2.3,
        height: 50,
        borderRadius: 10,
        backgroundColor: color.acceptGreenColor,
        justifyContent: 'center',
      }}>
      <View style={{flexdirection: 'row', alignSelf: 'center'}}>
        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: BOLD,
              color: color.white,
              alignSelf: 'center',
              marginEnd: 10,
            }}>
            {t('ACCEPT')}
          </Text>
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#165E39',
              justifyContent: 'center',
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: BOLD,
                color: color.white,
                alignSelf: 'center',
              }}>
              {requestAcceptTimer}
            </Text>
          </View>
        </View>

        {/* <>
       <Text>30</Text>
       </> */}
      </View>
    </TouchableOpacity>
  );
};
export default AcceptButton;
