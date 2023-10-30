import {
  View,
  Dimensions,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import OTPTextView from 'react-native-otp-textinput';
import CustomTripButton from '../customComp/CustomTripButton';
import {color} from '../../utils/color';
import {BOLD, REGULAR} from '../../utils/fonts';
import {t} from 'i18next';
import {useState} from 'react';
import CustomToastProvider from '../customComp/CustomToastProvider';
import {mobW} from '../../utils/commonFunction';
import {useTranslation} from 'react-i18next';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const TripStartOtpModal = ({
  isTripArrivedForOtp,
  onStartNowPressed,
  rideDetails,
  errorMess = '',
  onchnage,
}) => {
  const {t} = useTranslation();
  const [error, setError] = useState('');
  const [otp, setOTP] = useState('');

  const onsendclick = txt => {
    onStartNowPressed(otp);
  };

  const capitalizeFirstCharacter = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const onHandleChange = txt => {
    onchnage('');
    setOTP(txt);

    console.log('errrororor', txt);
  };
  return (
    <Modal transparent visible={isTripArrivedForOtp}>
      <View style={styles.container}>
        <CustomToastProvider />
        <View style={styles.innerContainer}>
          <View style={{marginHorizontal: 16}}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 100 / 2,
                backgroundColor: color.purpleborder,
                justifyContent: 'center',
                alignSelf: 'center',
                marginBottom: 20,
              }}>
              <Image
                style={{width: 50, height: 50, alignSelf: 'center'}}
                source={require('../../Assests/image/location_pin.png')}
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontfamily: BOLD,
                  fontWeight: '600',
                  color: color.white,
                  textAlign: 'center',
                }}>
                {t('Enter_Trip_Start_OTP_Below')}
              </Text>
              {/* <Text
                style={{
                  fontSize: 14,
                  fontFamily: REGULAR,
                  textAlign: "center",
                  color: color.greySubHeading,
                  marginTop: 8,
                }}>
                  {t('Add_Passengers_for_OTP_to_start')}
              </Text> */}
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <OTPTextView
                handleTextChange={text => onHandleChange(text)}
                containerStyle={styles.textInputContainer}
                textInputStyle={styles.roundedTextInput}
                tintColor={color.purpleborder}
                offTintColor="#10281C"
                inputCount={4}
                inputCellLength={1}

                // defaultValue={rideDetails.otp}
              />
            </View>
            <View
              style={{
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {errorMess && (
                <Text
                  style={{
                    color: 'red',
                    alignSelf: 'flex-start',
                    marginLeft: 30,
                  }}
                  numberOfLines={2}>
                  {capitalizeFirstCharacter(errorMess)}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => {
                  if (otp.length == 4) {
                    onsendclick(otp);
                  }
                }}
                disabled={otp.length == 4 ? false : true}
                style={{
                  width: width - 120,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor:
                    otp.length < 4 ? color.black_BG : '#00AF66',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontWeight: '700',
                    fontFamily: BOLD,
                    fontSize: 16,
                    color: color.white,
                  }}>
                  {t('START NOW')}
                </Text>
              </TouchableOpacity>
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
    width: width - 40,
    marginHorizontal: 16,
    backgroundColor: '#10281C',
    alignSelf: 'center',
    borderRadius: 10,

    paddingVertical: 30,
  },
  textInputContainer: {
    marginTop: 40,
    width: mobW - 120,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 3,
    backgroundColor: color.black_BG,
    color: '#fff',
    width: 50,
    height: 50,
  },
});
export default TripStartOtpModal;
