import {
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Item,
} from 'react-native';
import React, {useContext, useState} from 'react';
// import MultipleChoice from 'react-native-multiple-choice-picker';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-vector-icons/dist/Ionicons';
import {AuthContext} from '../../constant/auth';
import { useTranslation } from 'react-i18next';
import { color } from '../../utils/color';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const RequestConfirmation = () => {
  const {t} = useTranslation();
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigation();
  const {signOut} = useContext(AuthContext);

  // render the item inside modal
  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const textColor = item.id === selectedId ? 'white' : color.black_BG;

    return (
      <View
        style={{
          borderRadius: 5,
          borderColor: '#6F74F9',
          borderWidth: 2,
          padding: 10,
          margin: 10,
        }}>
        <Text style={{color: 'white', fontSize: 20}}>{item.title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.modal}>
      <View style={styles.firstContainer}>
        <View style={styles.imgContainer}>
          <Image
            style={{width: 50.4, height: 46.52}}
            source={require('../../Assests/image/request.png')}
          />
        </View>
        <Text style={styles.text}>{t('reqConfirm_Request_confirmation')}</Text>
      </View>
      <View style={styles.secondContainer}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <Button title="START NOW" color="#fff" onPress={() => signOut()} />
      </View>
    </View>
  );
};

export default RequestConfirmation;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },

  modal: {
    backgroundColor: '#10281C',
    borderRadius: 20,
    width: '90%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 100,
  },
  firstContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '40%',
    // borderColor:"green",
    // borderWidth:2,
    width: '100%',
  },
  imgContainer: {
    backgroundColor: '#141414',
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 20,
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  secondContainer: {
    width: '100%',
    height: '50%',
    paddingHorizontal: 10,
  },
});
