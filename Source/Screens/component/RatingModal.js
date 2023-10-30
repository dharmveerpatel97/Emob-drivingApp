import {
  View,
  Dimensions,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {BOLD, REGULAR} from '../../utils/fonts';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import StarRating from 'react-native-star-rating-widget';

import {useTranslation} from 'react-i18next';
import CustomToastProvider from '../customComp/CustomToastProvider';
import Icon from 'react-native-vector-icons/dist/Ionicons';
// import Icon from 'react-native-vector-icons/dist/Ionicons';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
import {useFocusEffect} from '@react-navigation/native';
import { color } from '../../utils/color';

const RatingModal = ({
  isRatingModalOpen,
  onRatingModalOpenClose,
  rideDetails,
}) => {
  const {t} = useTranslation();
  const [rating, setRating] = React.useState(0);
  const onRationgChange = rating => {
    // setRating(rating);
    onRatingModalOpenClose(rating);
  };

  const handleStarPress = selectedRating => {
    setRating(selectedRating);
    onRatingModalOpenClose(selectedRating);
    // Perform additional logic here based on the selected rating
  };

  return (
    <Modal transparent visible={isRatingModalOpen}>
      <View style={styles.container}>
        {/* <CustomToastProvider/>  */}
        <View style={styles.innerContainer}>
          <View style={{marginBottom: 20}}>
            {/* <View
              style={{
                width: 100,
                height: 3,
                backgroundColor: '#ffffff50',
                alignSelf: 'center',
                marginTop: 14,
                borderRadius: 3 / 2,
              }}
            /> */}
            <Text
              style={{
                fontFamily: BOLD,
                color: '#fff',
                fontSize: 18,
                alignSelf: 'center',
                marginTop: 18,
                fontWeight: '600',
              }}>
              {t(`rateModelPas`)}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 5,
                marginTop: 14,
                justifyContent: 'center',
                alignItems: 'center',
                width: '90%',
              }}>
              <Image
                style={{
                  width: 50,
                  marginLeft: 20,
                  height: 50,
                  borderRadius: 50 / 2,
                  borderColor: '#ffffff',
                  resizeMode: 'contain',
                }}
                source={
                  rideDetails?.passengerProfileUrl != ''
                    ? {uri: rideDetails?.passengerProfileUrl}
                    : require('../../Assests/image/user_avtar.png')
                }
              />

              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  marginStart: 10,
                  marginTop: -6,
                }}>
                <Text style={{color: '#fff', fontSize: 16, fontFamily: BOLD}}>
                  {rideDetails?.passenger?.name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    height: 13,
                    borderRadius: 2,
                    marginTop: 5,
                  }}>
                  <Image
                    style={{
                      width: 15,
                      height: 15,
                      alignSelf: 'center',
                      tintColor: '#FF9500',
                    }}
                    source={require('../../Assests/image/ratingstar.png')}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#ffffff50',
                      fontFamily: REGULAR,
                      alignSelf: 'center',
                      marginStart: 4,
                    }}>
                    {rideDetails?.passengerRating
                      ? rideDetails?.passengerRating
                      : 0}
                  </Text>
                </View>
              </View>

              {/* <View style={{alignSelf: 'center', marginTop: -9}}>
                <Text
                  style={{
                    color: '#ffffff50',
                    fontSize: 12,
                    fontFamily: REGULAR,
                  }}>
                  {t(`rateModelCustomer`)}
                </Text>
              </View> */}
            </View>

            <View
              style={{
                width: '90%',
                marginHorizontal: 16,
                backgroundColor: '#00AF66',
                borderRadius: 10,
                justifyContent: 'center',
                marginTop: 15,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 22,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontFamily: BOLD,
                  color: '#fff',
                  alignSelf: 'center',
                  fontWeight: '700',
                }}>
                {t(`rateModelCustomer1`)} {rideDetails?.passenger?.name} ?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  width: '60%',
                  justifyContent: 'space-between',
                }}>
                {[1, 2, 3, 4, 5].map(index => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleStarPress(index)}>
                    <Icon
                      name={index <= rating ? 'star' : 'star-outline'}
                      color={color.white}
                      size={24}
                    />
                  </TouchableOpacity>
                ))}
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
    height: '100%',
    width: '100%',
    backgroundColor: '#001A0F80',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: width,
    backgroundColor: '#10281C',
    position: 'absolute',
    bottom: 0,
  },
  textInputContainer: {
    marginTop: 40,
    width: 250,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 3,
    backgroundColor: '#10281C',
    color: '#fff',
    width: 50,
    height: 50,
  },
});
export default RatingModal;
