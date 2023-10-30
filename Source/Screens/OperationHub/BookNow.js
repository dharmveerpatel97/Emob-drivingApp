import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,ToastAndroid
} from 'react-native';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import RentalEVStyle from '../../styles/RentalEVStyle';
import {endPoints} from '../../utils/config';
import React, {useEffect, useState} from 'react';
import PaymentChoice from '../component/PaymentChoice';
import arrowRight from '../../Assests/image/arrowRight.png';
import Check from '../../Assests/image/checked.png';
import right_tick from '../../Assests/image/right_tick.png';
import supportImage from '../../Assests/image/supportN.png';
import {color} from '../../utils/color';
import {mobW} from '../../utils/commonFunction';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {urls} from '../../utils/config';
import LinearGradient from 'react-native-linear-gradient';
import RestApiClient from '../../network/RestApiClient';
import {useRef} from 'react';
import CustomPressable from '../customComp/CustomPressable';
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';
import {BounceInDown} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-snap-carousel';
global.userdata = null;
export const SLIDER_WIDTH = Dimensions.get('window').width + 40;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

export default function BookNow({route, navigation}) {
  const {t} = useTranslation();
  const [isvisibleModal, setvisibleModal] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [DATA, setDATA] = useState([]);
  const [count, setcount] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [errorString, setErrorString] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [firstItem, setFirstItem] = useState(0);
  const [seldate, setseldate] = useState(new Date());

  const dispatch = useDispatch();

  const [height, setHeight] = useState(0);

  const handleLayout = event => {
    const {height} = event.nativeEvent.layout;
    setHeight(height);
  };

  const getddate = async () => {
    let selectedDat = await StorageProvider.getObject('selectedDate');
    setseldate(new Date(selectedDat));
  }
  useEffect(() => { 

    getddate();

    const unsubscribe = navigation.addListener('focus', () => {
      setvisibleModal(false);
      setSelectedId(0);
      setCurrentIndex(0);
      setDATA([]);
      setcount([]);
      setUserInfo({});
      setErrorString('');
      setIsFetching(false);
      setFirstItem(0);
      getUserData();
      GetPlans();
    });
    return unsubscribe;
  }, [navigation]);

  const carusalRef = useRef(null);
  const scrollToCenter = index => {
    // flatListRef.current.scrollToIndex({index, animated: true});
  };
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const updatecount = (selIndex, method) => {
    if (count[selIndex] < DATA[selIndex].maxDurationUnit && method == 'add') {
      const updatedArray = [...count];
      updatedArray[selIndex] =
        method == 'add' ? count[selIndex] + 1 : count[selIndex] - 1;

      setcount(updatedArray);
    }

else  if (count[selIndex] > DATA[selIndex].minDurationUnit && method == 'minus') {
      const updatedArray = [...count];
      updatedArray[selIndex] =
        method == 'add' ? count[selIndex] + 1 : count[selIndex] - 1;
      setcount(updatedArray);
    }
    
  };

  const GETtypes = item => {
    switch (item.toUpperCase()) {
      case 'DAILY':
        return 'Days';
      case 'HOURLY':
        return 'Hours';
      case 'WEEKLY':
        return 'Week';
      case 'MONTHLY':
        return 'Month';
      default:
        return '';
    }
  };

  const Item = ({
    item,
    index,
    onPress,
    borderColor,
    backgroundColor,
    textColor,
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[modalStyles.touchOpacity, backgroundColor, borderColor]}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[modalStyles.title_head, textColor]}>
            {capitalizeFirstCharacter(item.planName)} 
          </Text>
        </View>

        <View
          style={{
            margin: 5,
            flexDirection: 'row',  
            marginTop: 20,
            alignItems: 'center',
          }}>
          <Image
            style={{width: 20, marginHorizontal: 10, height: 20}}
            source={Check}
          />
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              width: '80%',
              fontFamily: 'Roboto-Medium',
            }}>
           {capitalizeFirstLetter(item.description)}
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: 5,
            flexDirection: 'row', 
            marginBottom:10,
            alignItems:'center'
          }}>
          <Image
            style={{width: 20, marginHorizontal: 10, height: 20}}
            source={Check}
          />
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              fontFamily: 'Roboto-Medium',
            }}>
            {item?.freeChargingHours} {t('Hours free charging')}
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: 5,
            flexDirection: 'row',
           
            marginBottom:10,
            alignItems:'center'
          }}>
          <Image
            style={{width: 20, marginHorizontal: 10, height: 20}}
            source={Check}
          />
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              fontFamily: 'Roboto-Medium',
            }}>
            {t('Minimum rental duration: ')} {item?.minDurationUnit} {GETtypes(item.planType)}
          </Text>
        </View>

        <View
          style={{
            marginHorizontal: 5,
            flexDirection: 'row',
           
            marginBottom:10,
            alignItems:'center'
          }}>
          <Image
            style={{width: 20, marginHorizontal: 10, height: 20}}
            source={Check}
          />
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              fontFamily: 'Roboto-Medium',
            }}>
             {t('Maximum rental duration:')} {item.maxDurationUnit} {GETtypes(item.planType)}
          </Text>
        </View>




{/* 
        Minimum rental duration: [Minimum hours]
Maximum rental duration: [Maximum hours] */}
       
        <View
          style={{
            borderColor: color.white_50,
            marginHorizontal: 20,
            borderStyle: 'dashed',
            borderBottomWidth: 1,
          }}></View>

        <View style={{flexDirection: 'row',marginHorizontal: 5, height: 40, marginTop: 15}}>
          <Text
            style={{
              fontSize: 14,
              margin: 10,paddingLeft:5,
              width:'35%',
              fontFamily: REGULAR,
              color: color.white,
            }}>
            {t('Select ')}
            {GETtypes(item.planType)}
          </Text>
          <View style={{width:'60%'}}> 
          <View
            style={{
              backgroundColor: index == selectedId ? color.white : color.black_BG,
              borderRadius: 5,
              height: 35,width:150,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              margin: 5,
            }}>
            <TouchableOpacity onPress={() => updatecount(index, 'minus')}>
              <Image
                source={require('../../Assests/image/minus.png')}
                style={{height: 2, width: 10, margin: 10}}
              />
            </TouchableOpacity>

            <Text
              style={{
                color: color.Border_color,
                fontFamily: BOLD,
                paddingHorizontal: 10,
                borderLeftColor: color.Border_color,
                borderRightColor: color.Border_color,
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
              }}>
            
              {count[index]} {GETtypes(item.planType)}
            </Text>
            <TouchableOpacity onPress={() => updatecount(index, 'add')}>
              <Image
                source={require('../../Assests/image/plus_p.png')}
                style={{height: 10, width: 10, margin: 10}}
              />
            </TouchableOpacity>
          </View>
          </View>
        </View>

        <View style={{flexDirection: 'row', height: 40,marginHorizontal: 5,}}>
          <Text
            style={{
              fontSize: 14,
              margin: 10,paddingLeft:5,
              width:'35%',
              fontFamily: REGULAR,
              color: color.white,
            }}>
            {t('Total')}
          </Text>
          <View style={{width:'60%'}}> 
          <Text
            style={{
              fontSize: 18,
              marginTop: 10,
              fontFamily: REGULAR,
              color: color.white,
              alignItems: 'center',alignSelf:'center',
              justifyContent: 'center',
            }}>
            {'₹'}
            {count[index] * item.rentPerUnit}
            {'/-'}
          </Text>
          </View>
        </View>
        <View style={{height: 40, marginTop: 20, width: '100%'}}>
          {index === selectedId ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                right: 0,
                height: 40,
                width: 40,
                bottom: 0,
                borderTopLeftRadius: 10,
                position: 'absolute',
                borderLeftColor: color.white,
                borderTopColor: color.white,
                borderLeftWidth: 2,
                borderTopWidth: 2,
              }}>
              <Image
                style={{width: 15, height: 15, alignItems: 'center'}}
                source={right_tick}
              />
            </View>
          ) : null}
        </View>
      {/* </LinearGradient> */}
    </TouchableOpacity>
  );

  const renderItem = ({item, index}) => {
    const borderColor =   null;
    const backgroundColor = index === selectedId ? '#00AF66' : '#10281C';
    const color = '#fff';

    return (
      <Item
        item={item}
        index={index}
        onPress={() => {
          setSelectedId(index);
          setCurrentIndex(index);
        }}
        borderColor={{borderColor}}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };

  const CalculateEnd = () => {
    console.log(
      'DATA[selectedId].planType.toUpperCase()',
      DATA[selectedId].planType.toUpperCase(),
    );
    switch (DATA[selectedId].planType.toUpperCase()) {
      case 'DAILY':
        const daily =
          Math.floor(seldate.getTime() / 1000) + count[selectedId] * 3600 * 24;
        return daily;
      case 'HOURLY':
        const hour =
          Math.floor(seldate.getTime() / 1000) + count[selectedId] * 3600;
        return hour;

      case 'WEEKALY':
        const week =
          Math.floor(seldate.getTime() / 1000) + count[selectedId] * 604800; //3600*24*7
        return week;
      case 'MONTHLY':
        const month =
          Math.floor(seldate.getTime() / 1000) +
          count[selectedId] * 30 * 24 * 60 * 60;
        return month;
      default:
        return '';
    }
  };

  const CreateRentalOrder = async selIndex => {
    await StorageProvider.getObject('accessToken').then(res => {
      StorageProvider.getItem('SelOperationHub').then(operatID => {
        setIsFetching(true);
        operatID = JSON.parse(operatID);
        let body = {
          driverId: res.userId,
          rentalPlanId: DATA[selectedId].planId,
          operatorHubId: operatID.operationHubID,
          startTime: Math.floor(seldate.getTime() / 1000),
          endTime: CalculateEnd(),
          Units: count[selectedId],
          paymentType: selIndex == 1 ? 'poh' : 'online',
        };
        console.log('selected Body', body);

        RestApiClient(
          'POST',
          JSON.stringify(body),
          endPoints.Create_Rental_order,
          'DMS',
          res.accesstoken,
        )
          .then(response => {
            setIsFetching(false);
            console.log('create rental order=', response);
            if (response?.message) {
              setErrorString(response?.message);
            } else {
              StorageProvider.saveItem('RentalId', response?.rentalOrderId);
              navigation.navigate('Home');
              setIsFetching(false);
              setvisibleModal(false);
            }
          })
          .catch(() => {
            setErrorString('Error occurred, please try again');
            setIsFetching(false);
          });
      });
    });
  };

  const capitalizeFirstCharacter = str => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const GetPlans = async () => {
    let accessToken = '';
    await StorageProvider.getObject('accessToken').then(responce => {
      accessToken = responce.accesstoken;
    });

    let id = await AsyncStorage.getItem('OperationHubID');
    console.log('selected OPID', id);
    fetch(urls.DMS_BASE_URL + endPoints.Rental_Plans + '?operatorHubId=' + id, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });

    fetch(urls.DMS_BASE_URL + endPoints.Rental_Plans, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Rental Plans ===', data?.plans);
        setDATA(data?.plans);
        setCurrentIndex(0);

        const nameArray = data?.plans.map(item => item.minDurationUnit);
        //const newArray = Array(data?.plans.length).fill(1);
        setcount(nameArray);
        console.log('New count min ===', count);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getUserData = async () => {
    await StorageProvider.getItem('userInfo').then(userInfo1 => {
      userInfo1 = JSON.parse(userInfo1);
      console.log('userdata', userInfo1);
      setUserInfo(userInfo1);
    });
  };

  const calculateCarouselHeight = () => {
    const paddingHorizontal = 20;
    const itemHeight = 50;
    const additionalSpace = 20; // Additional space for margins, paddings, etc.

    const carouselHeight =
      DATA.length * itemHeight + additionalSpace + paddingHorizontal * 2;

    return carouselHeight;
  };
  const carouselHeight = calculateCarouselHeight();

  return (
    <SafeAreaView style={styles.container}>
      <Modal transparent visible={isvisibleModal}>
        <PaymentChoice
          amount={DATA[selectedId]?.rentPerUnit * count[selectedId]}
          btnName={t('CONFIRM BOOKING')}
          hideOnline={true}
          isLoading={isFetching}
          errorMessage={errorString}
          onclose={() => {
            setvisibleModal(false);
          }}
          onNextscreenmove={selectedID => {
            CreateRentalOrder(selectedID);
          }}></PaymentChoice>
      </Modal>
      <View style={RentalEVStyle.topContainer}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChooseBookingSlot')}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="arrowleft" color={color.white} size={24} />
          </TouchableOpacity>

          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Notification');
              }}
              style={{
                right: 10,
                alignItems: 'flex-end',
                alignSelf: 'flex-end',
              }}>
              <Image
                style={{width: mobW * 0.1, height: mobW * 0.1}}
                source={require('../../Assests/image/notification_white.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={{flexGrow: 1}} scrollEnabled={true}>
        <Text style={styles.listTitle}>
          {t(' Start Exploring Rental Options ')}
          {/* Get Started {'\n'} Rent an Electric Vehicle */}
        </Text>
        <Text style={styles.listTitle1}> {t('Select a Plan')}</Text>

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Carousel
            data={DATA}
            ref={carusalRef}
            sliderHeight={carouselHeight}
            itemHeight={carouselHeight}
            renderItem={renderItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            firstItem={firstItem}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            loopClonesPerSide={0}
            currentIndex={currentIndex}
            onSnapToItem={index => {
              setSelectedId(index);
              setCurrentIndex(index);
            }}
          />
        </View>
      <View style={styles.bottomContainer}>
        <CustomPressable
          text={t('PROCEED TO PAY')}
          marginTop={50}
          btnWidth={mobW - 100}
          route={''}
          isGradient={true}
          backgroundColor="#10281C"
          onPress={() => {
            selectedId === ''
              ? Toast.show({
                  type: 'warning',
                  text1: t('Alert_txt'),
                  text2: t('Please Select Rental Plan'),
                })
              : setvisibleModal(true);
          }}
          position={'relative'}
          bottom={10}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Support1')}
          style={RentalEVStyle.FifthContainer}>
          <View
            style={{
              backgroundColor: color.black_BG,
              height: 50,
              width: 50,
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: 25,
                height: 25,
                justifyContent: 'center',
                alignItems: 'center',

              }}
              source={supportImage}
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: 21,
                color: 'white',
              }}>
              {' '}
              {t('home_help_support')}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: 'white',
              }}>
              {' '}
              {t('home_click_here')}
            </Text>
          </View>
         <Image
            style={{width: 30,height:30}}
            source={arrowRight}
          />
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: color.black_BG},
  listTitle: {
    width: '100%',
    textAlign: 'center',
    lineHeight: 35,
    color: color.white,
    flexWrap: 'wrap',
    fontWeight: '800',
    marginTop: 5,
    fontSize: 22,
    marginBottom: 15,
    fontFamily: BOLD,
  },
  listTitle1: {
    width: '100%',
    textAlign: 'center',
    lineHeight: 25,
    color: color.white,
    fontSize: 18,
    marginBottom: 40,
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    borderRadius: 10,
    marginBottom: 30,
  },
  menu: {
    width: '100%',
    flexGrow: 0,
  },
});

const modalStyles = StyleSheet.create({
  touchOpacity: {
    borderRadius: 10,
    // borderWidth: 2,
    width: mobW - 100,
  },
  title_head: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
    fontWeight: '600',
    marginTop: 15,
  },
  title: {
    fontSize: 18,
    marginTop: 5,
    fontFamily: REGULAR,
    justifyContent: 'center',
    textAlign: 'center',
  },
  title2: {
    fontSize: 18,
    marginTop: -5,
    fontFamily: REGULAR,
    justifyContent: 'center',
    textAlign: 'center',
  },
});
