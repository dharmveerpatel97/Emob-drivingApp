import React, { useEffect,  useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {BOLD, REGULAR} from '../../utils/fonts';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import CustomPressable from '../customComp/CustomPressable';
import {color} from '../../utils/color';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {mobW, mobH} from '../../utils/config';
import { useTranslation } from 'react-i18next';


const ChooseBookingSlot = ({ navigation}) => {
  const {t} = useTranslation();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [operationhubDetails, setoperationhubDetails] = useState({});

  const onPress = () => {
    setShowPicker(true);
  };
  const dispatch = useDispatch();

  useEffect(async() => {
     let ID =  await StorageProvider.getObject('selectedHubdetails');
     setoperationhubDetails(ID);
  }, []);

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1); 


  const onTimeChange = hours => {
    setShowPicker(false);
    setDate(hours);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={{resizeMode: 'resize', height: mobH * 0.43}}
        source={require('../../Assests/image/vehicle_hub_details.png')}>
        <StatusBar translucent barStyle="light-content" />
        <View style={styles.headerSubBox}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="arrowleft" color={color.white} size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.headerTitle}>{t('Choose Booking Slots')}</Text>
          </TouchableOpacity>
        </View>

      </ImageBackground>
      <ImageBackground
          style={{
            marginHorizontal: 16,
            borderRadius: 20,
            marginTop:-40
          }}
          imageStyle={{borderRadius:10}}
          source={require('../../Assests/image/bg.png')}>
          <View style={{flexDirection: 'column', marginHorizontal: 20}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: BOLD,
                width: 200,
                fontWeight: '800',
                marginTop: 5,
                lineHeight: 30,
                color: color.white,
              }}>
                {operationhubDetails?.hubname}
             
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginBottom: 5,
                justifyContent: 'space-between',
              }}>
              <Text numberOfLines={1} ellipsizeMode="tail"
                style={{
                  width: '90%',
                  fontSize: 14,
                  color: color.white,
                  opacity: 0.7,
                 
                  fontFamily: REGULAR,
                }}>
                 {operationhubDetails?.hubaddress}
              </Text>
              <Image
                style={{
                  width: 30,
                  resizeMode: 'contain',
                  marginRight: 30,
                  marginTop:-10,
                  height: 30,
                }}
                source={require('../../Assests/image/drop_location.png')}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifycontent: 'center',
                marginBottom: 20,
              }}>
              <Image
                style={{
                  width: 12,
                  height: 12,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
                source={require('../../Assests/image/dis_away.png')}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: color.white,
                  justifyContent: 'center',
                  fontFamily: 'Roboto-Medium',
                }}>
                {' '}
                {operationhubDetails?.km} {t('away')}
              </Text>
            </View>
          </View>
        </ImageBackground>
     
     
     
     
      <Text
        style={{
          fontSize: 14,
          fontFamily: 'Roboto-Medium',
          lineHeight: 30,
          marginHorizontal: 16,
          marginTop: 30,
          marginBottom: 10,
          color: color.white,
        }}>
        {t('Select Booking Date & Time')}
      </Text>

      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            backgroundColor: '#10281C',
            borderRadius: 10,
            justifycontent: 'center',
            marginHorizontal: 16,
          }}>
          <Image
            style={{
              width: 20,
              height: 20,
              marginVertical: 20,
              marginHorizontal: 10,
              resizeMode: 'contain',
            }}
            source={require('../../Assests/image/calendar.png')}
          />
          <Text
            style={{
              fontFamily: REGULAR,
              marginHorizontal: 2,
              fontSize: 14,
              marginVertical: 15,
              textAlignVertical: 'center',
              color: color.white,
            }}>
            {moment(date).format('ddd,DD MMM, hh:mm a')}
          </Text>
        </View>
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.container1}>
          <DatePicker
            format="h:mm A"
            modal
            mode={'datetime'}
            theme="dark"
            title={t('Select Booking Date & Time')}
            fadeToColor={color.black_BG} 
            open={showPicker}
            maximumDate={maxDate}
            textColor={color.white}
            date={new Date()}
            minimumDate={new Date()}
            onConfirm={date => {
              onTimeChange(date);
            }}
            onCancel={() => {
              setShowPicker(false);
            }}
            customStyles={{
              dateIcon: {
                display: 'none', // Hide the date picker icon
              },
              dateInput: {
                backgroundColor: '#10281C', // Set the background color of the input
              },
              dateText: {
                color: color.white,
              },
              placeholderText: {
                color: color.white, // Set the color of the placeholder text
              },
              datePicker: {
                backgroundColor: color.black_BG, // Set the background color of the date picker container
              },
              btnTextConfirm: {
                color: color.white, // Set the color of the confirm button text
              },
            }}
          />
        </View>
      )}

      <CustomPressable
        text={t('btn_CONTINUE')}
        marginTop={0}
        btnWidth={Dimensions.get('screen').width / 1.1}
        route={''}
        isGradient={true}
        backgroundColor="#10281C"
        onPress={() => {

          StorageProvider.setObject('selectedDate', date);
          navigation.navigate('BookNow');
        }}
        position={'absolute'}
        bottom={24}
      />
    </SafeAreaView>
  );
};

export default ChooseBookingSlot;

const styles = StyleSheet.create({
  container: {backgroundColor: color.black_BG, flex: 1, paddingVertical: 20},
  headerBox: {paddingTop: mobH * 0.032},
  headerSubBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 0.017 * mobW,
    marginTop: 40,
  },
  listbox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 60,
    marginTop: 5,
  },
  listcontainer: {backgroundColor: color.Black_light, marginTop: 25},
  headerTitle: {
    color: color.white,
    fontSize: 20,
    justifyContent: 'flex-start',
    fontFamily: BOLD,
    paddingHorizontal: 20,
  },
  listTitle: {
    width: '100%',
    textAlign: 'center',
    color: color.white,
    fontSize: 12,
    height: 20,
    marginTop: 50,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.black_BG, // Set the background color for the container
  },
});
