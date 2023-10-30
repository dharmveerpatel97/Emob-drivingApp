import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import {mobW} from '../../utils/config';
import { useTranslation } from 'react-i18next';
import { color } from '../../utils/color';

const Loader = ({visible = false}) => {
  const {t} = useTranslation();
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalView}>
          <ActivityIndicator
            style={{alignSelf: 'center'}}
            size={'large'}
            color={'#00AF66'}
          />
          <Text style={{color: 'white'}}>{t('Please wait...')}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#10281C',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
    width: mobW * 0.5,
    alignSelf: 'center',
  },
});
