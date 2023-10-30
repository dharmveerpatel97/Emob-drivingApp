import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import CustomPressable from '../customComp/CustomPressable';
import {color} from '../../utils/color';
import {mobW} from '../../utils/config';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { BOLD, REGULAR } from '../../utils/fonts';
import { useTranslation } from 'react-i18next';
import CustomBtn from "../customComp/customBtn"
export default function Deletemyac({navigation}) {
  const {t} = useTranslation();
  const [isLiked, setIsLiked] = useState([
    { id: 1, value: true, name: "Something was broken", selected: true },
    { id: 2, value: false, name: "Created a second account", selected: false },
    { id: 3, value: false, name: "I have a privacy concern", selected: false },
    { id: 4, value: false, name: "Other", selected: false }
  ]);

  const onRadioBtnClick = (item) => {
    let updatedState = isLiked.map((isLikedItem) =>
      isLikedItem.id === item.id
        ? {...isLikedItem, selected: true}
        : {...isLikedItem, selected: false},
    );
    setIsLiked(updatedState);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent barStyle="light-content" />
      <View style={styles.headerSubBox}>
        <TouchableOpacity></TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.headerTitle}>{t('Delete Profile')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="close" color={color.white} size={24} />
        </TouchableOpacity>
      </View>
      <Text style={styles.listTitle}>
        {t('Are you sure you wish to delete your account ?')}
      </Text>
      {isLiked.map(item => (
        <View key={item.name} style={styles.radioButtonContainer}>
          <TouchableOpacity
            onPress={() => onRadioBtnClick(item)}
            style={{width: '86%'}}>
            <Text style={styles.radioButtonText}>{t(`${item.name}`)}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onRadioBtnClick(item)}>
            {item.selected ? (
              <Image
                style={{width: 20, marginLeft: 10, height: 20}}
                source={require('../../Assests/image/radioselected.png')}
              />
            ) : (
              <Image
                style={{width: 20, marginLeft: 10, height: 20}}
                source={require('../../Assests/image/radio_nonselect.png')}
              />
            )}
          </TouchableOpacity>
        </View>
      ))}
      <CustomBtn
        text={t('btn_CONTINUE')}
        btnWidth={Dimensions.get('screen').width / 1.1}
        route={'Deletemyac1'}
        navigation={navigation}
        Allow={true}
        onPress={() => {
          navigation.navigate('Deletemyac1');
        }}
        position={'absolute'}
        bottom={50}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.black_BG,
    flex: 1,
    paddingVertical: 20,
  },
  headerSubBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0.037 * mobW,
    marginTop: 30,
  },

  headerTitle: {
    color: color.white,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  listTitle: {
    width: '100%',
    textAlign: 'center',
    color: color.white,
    fontSize: 14,
    height: 20,
    marginTop: 40,
    marginBottom: 30,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    height: 50,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 10,
    backgroundColor: '#10281C',
  },
  radioButton: {
    height: 20,
    width: 20,
    backgroundColor: '#10281C',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00AF66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonIcon: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: '#10281C',
  },
  radioButtonText: {
    fontSize: 16,
    color: color.white,
    marginLeft: 22,
  },
});
