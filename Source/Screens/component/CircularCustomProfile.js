import {View, StyleSheet, Image, Text} from 'react-native';
import {color} from '../../utils/color';
import {REGULAR} from '../../utils/fonts';

const CircularCustomProfile = ({rideDetails}) => {
  return (
    <View>
      <View style={{
        width: 48,
        height: 48,
        borderRadius: 48 / 2,
        justifyContent:"center",
        alignItems:"center",
        borderWidth: 1,
        borderColor: '#ffffff',
      }}>
           <Image
              source={
                rideDetails?.passengerProfileUrl != ''
                  ? {uri: rideDetails?.passengerProfileUrl}
                  : require('../../Assests/image/user_avtar.png')
              }
              style={
                rideDetails?.passengerProfileUrl != ''
                  ? {
                      width: 45,
                      height: 45,
                      borderRadius: 45 / 2,
                      alignSelf: 'center',
                      borderWidth: 1,
                      borderColor: '#ffffff',
                      resizeMode: 'cover',
                    }
                  : {height: 38, width: 38, resizeMode: 'contain'}
              }
            />
     </View>
    
    {rideDetails?.passenger ?  <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#FF9500',
          height: 13,
          position: 'absolute',
          top: 35,
          left: 3,
          width: 40,
          justifyContent: 'center',
          borderRadius: 2,
        }}>

        <Image
          style={{width: 9, height: 9, alignSelf: 'center'}}
          source={require('../../Assests/image/ratingstar.png')}
        />
        <Text
          style={{
            fontSize: 10,
            color: color.white,
            fontFamily: REGULAR,
            alignSelf: 'center',
            marginStart: 2,
          }}>
          {rideDetails?.passengerRating ? rideDetails?.passengerRating : 0.00}
        </Text>
      </View> : null}
     
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 45,
    height: 45,
    borderRadius: 40,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
    resizeMode: 'cover',
  },
});
export default CircularCustomProfile;
