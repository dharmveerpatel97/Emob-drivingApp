import {Dimensions, Text, TouchableOpacity} from 'react-native';
import {color} from '../../../utils/color';
import {BOLD} from '../../../utils/fonts';
import { useTranslation } from 'react-i18next';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const RejectButton = ({onPress}) => {
  const {t} = useTranslation();
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      style={{
        width: WIDTH / 3,
        height: 50,
        borderRadius: 10,
        backgroundColor: color.red,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: 16,
          fontFamily: BOLD,
          color: color.white,
          alignSelf: 'center',
        }}>
        {t('REJECT')}
      </Text>
    </TouchableOpacity>
  );
};
export default RejectButton;
