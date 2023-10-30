import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import CustomPressable from '../customComp/CustomPressable';
import {color} from '../../utils/color';
import {mobW} from '../../utils/config';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import CustomTextInput from '../component/CustomTextInput';
import { BOLD, REGULAR } from '../../utils/fonts';
import {useTranslation} from 'react-i18next';

export default function Deletemyac1({navigation}) {
  const [text, onChangeText] = React.useState('');
  const [text1, onChangeText1] = React.useState(true);
  const {t} = useTranslation();

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
        {t('deletemsg1').concat(t('deletemsg2'))}
      </Text>

      <TextInput
        style={styles.input}
        value={text}
        placeholder={t("Type Here")}
        returnKeyType="next"
        onChangeText={onChangeText}
        multiline={true}
      />

      <CustomPressable
        text={t('btn_CONTINUE')}
        marginTop={0}
        btnWidth={mobW - 60}
        route={''}
        onPress={() => {
          Alert.alert(
            t('deleteAlertTitle'),
            t('deleteAlertMSG'),
            [
              {
                text: t('Not Now'),
                onPress: () => console.log('Cancel Pressed'),
              },
              {
                text: t('Yes'),

                onPress: () =>
                  navigation.navigate('Deletefailure', {
                    showmsg: true,
                  }),
              },
            ],
            {
              cancelable: false,
            },
          );
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
    marginTop: 40,
  },

  headerTitle: {
    color: color.white,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  listTitle: {
    width: '90%',
    textAlign: 'center',
    marginTop: 40,
    color: color.white,
    fontSize: 14,
    flexWrap: 'wrap',
    margin: 16,
    lineHeight: 24,
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
  },
  input: {
    margin: 16,
    padding: 10,
    color: color.white,
    lineHeight: 20,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#00AF66',
    borderRadius: 10,
    height: 170,
    textAlignVertical: 'top',
  },
});
