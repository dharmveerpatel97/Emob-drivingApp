import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {barContent, color} from '../../utils/color';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import CustomBtn from '../customComp/customBtn';
import {BOLD, REGULAR} from '../../utils/fonts';
import {Strings} from '../../utils/strings';
import i18n from '../../language/i18n';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import StorageProvider from '../../Session/StorageProvider';
import {locationPermission} from '../../utils/commonFunction';

const initI18n = i18n;

const Language = [
  {
    id: 1,
    title: 'हिन्दी',
  },
  {
    id: 2,
    title: 'English',
  }
];

const ChooseLang = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const [selectedId, setSelectedId] = useState(1);
  const [Error, setError] = useState(true);

  const selectlang = async () => {
    i18n.changeLanguage('hn');
    await StorageProvider.saveItem('language', 'hn');
  };

  const onpressHandler = async item => {
    if (item.id === 1) {
      i18n.changeLanguage('hn'); //changing language to hindi
      await StorageProvider.saveItem('language', 'hn');
    } else {
      i18n.changeLanguage('en'); //changing language to english
      await StorageProvider.saveItem('language', 'en');
    }
    setSelectedId(item.id);
    setError(true);
  };
  //===================back button exit code================
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        backPress,
      );
      return () => subscription.remove();
    }, []),
  );
  const getLiveLocation = async () => {
    await locationPermission();
  };

  useEffect(() => {
    getLiveLocation();
    selectlang();
  }, []);

  backPress = () => {
    Alert.alert(
      'Exit App',
      'Do you want to exit app?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Yes',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      },
    );
    return true;
  };
  //=====================back button exit code=============

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <StatusBar backgroundColor={color.black_BG} barStyle={barContent.light} />

      <View style={styles.chooseYourNameContainer}>
        <Text style={styles.chooseYourNameTitleText}>
          {t(Strings.CHOOSE_YOUR_LANGUAGE)}
        </Text>
      </View>

      <View style={styles.flatListViewContainer}>
        <FlatList
          data={Language}
          extraData={selectedId}
          ItemSeparatorComponent={() => {
            return <View style={{height: 14}} />;
          }}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  onpressHandler(item);
                }}
                style={{
                  padding: 14,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: item.id !== selectedId ? color.Blue_light : null,
                  backgroundColor:
                    item.id == selectedId
                      ? color.purpleborder
                      : color.Black_light,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color:
                      item.id == selectedId ? color.white : color.purpleborder,
                    fontSize: 18,
                    fontFamily: REGULAR,
                  }}>
                  {t(item.title)}
                </Text>
                {item.id == selectedId ? (
                  <View
                    style={{
                      padding: 2,
                      borderWidth: 2,
                      borderColor: color.white,
                      borderRadius: 100,
                    }}>
                    <Icon name={'circle'} size={20} color={color.white} />
                  </View>
                ) : (
                  <View
                    style={{
                      padding: 2,
                      borderWidth: 2,
                      borderColor: 'grey',
                      borderRadius: 100,
                    }}>
                    <Icon name={'circle'} size={18} color={color.Black_light} />
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <CustomBtn
        text={t('CONTINUE')}
        btnWidth={Dimensions.get('screen').width / 1.1}
        route={'Login'}
        navigation={navigation}
        Allow={true}
        ErrorMessage={'**Please choose language'}
        position={'absolute'}
        bottom={24}
      />
    </SafeAreaView>
  );
};

export default ChooseLang;

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    backgroundColor: color.black_BG,
    flex: 1,
  },
  flatListViewContainer: {
    backgroundColor: color.Black_light,
    padding: 30,
    margin: 14,
    borderRadius: 10,
  },
  chooseYourNameContainer: {
    margin: 16,
    marginTop: 30,
  },
  chooseYourNameTitleText: {
    color: color.white,
    fontSize: 20,
    fontFamily: BOLD,
  },
});
