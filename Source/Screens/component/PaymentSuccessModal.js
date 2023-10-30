import {useTranslation} from 'react-i18next';
import {
  View,
  Dimensions,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import CustomToastProvider from '../customComp/CustomToastProvider';
import { color } from '../../utils/color';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const PaymentSuccessModal = ({
  isPaymentDone,
  onClosePaymentSuccess,
  totalFare,
  rideDetails,
}) => {
  const {t} = useTranslation();
  const rideIcon = require('../../Assests/image/payment_succ_icon.png');
  return (
    <Modal
      transparent
      visible={isPaymentDone}
      onRequestClose={onClosePaymentSuccess}>
      <TouchableOpacity
        activeOpacity={1}
        style={{height: '100%', width: '100%', backgroundColor: '#001A0F80'}}>
        <CustomToastProvider />
        <View style={styles.container}>
          <TouchableOpacity
            onPress={onClosePaymentSuccess}
            style={{
              width: width * 0.04,
              padding: 15,
              backgroundColor: '#00AF66',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: 6,
              top: 6,
              borderRadius: 4,
              zIndex: 999,
            }}>
            <Image
              source={require('../../Assests/image/cross.png')}
              style={{
                height: width * 0.03,
                width: width * 0.03,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <Image
            source={rideIcon}
            style={{
              height: width * 0.65,
              width: width * 0.65,
              resizeMode: 'contain',
            }}
          />
          <Text style={{fontSize: 16, color: '#fff', fontWeight: '600'}}>
            {t('payComplete')}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#fff',
              fontWeight: '400',
              marginTop: 19,
            }}>
            {t('payComplete1')}
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: '#fff',
              fontWeight: 'bold',
              marginTop: 16,
            }}>
            ₹ {totalFare}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#fff',
              fontWeight: '400',
              marginTop: 15,
            }}>
            {t('payCompleteFrom')}
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: '#fff',
              fontWeight: 'bold',
              marginTop: 15,
            }}>
            {rideDetails?.passenger
              ? rideDetails?.passenger?.name
              : 'Passenger'}
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 20,
    marginHorizontal: 16,
    height: height * 0.77,
    backgroundColor: '#10281C',
    alignSelf: 'center',
    marginTop: height * 0.07,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default PaymentSuccessModal;
