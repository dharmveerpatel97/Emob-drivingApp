import {
  Dimensions,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Alert,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import CustomPressable from '../customComp/CustomPressable';
import {color, fontstyles} from '../../utils/color';
import DatePicker from 'react-native-date-picker';
import DropdownComponent from '../customComp/customDropDown';
import Header from '../customComp/Header';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import RestApiClient from '../../network/RestApiClient';
import StorageProvider from '../../Session/StorageProvider';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import CustomTextInput from '../component/CustomTextInput';
import {isValidPhoneNumber} from '../../utils/commonFunction';
import { endPoints,methods,mobW,urlReqType,urls } from '../../utils/config';
import { appLogOut, deleteFCMToken,onDutyOffDuty, reset, resetAppStates } from '../../Redux/appSlice';
const bloodgroup = [
  {id: 1, name: 'A+'},
  {id: 2, name: 'A-'},
  {id: 3, name: 'B+'},
  {id: 4, name: 'B-'},
  {id: 5, name: 'AB+'},
  {id: 6, name: 'AB-'},
  {id: 7, name: 'O+'},
  {id: 8, name: 'O-'},
];
const Gender = [
  {id: 1, name: 'Female'},
  {id: 2, name: 'Male'},
  {id: 3, name: 'Others'},
];

const Signup = ({navigation, route}) => {
  const [userDatainfo, setuserDatainfo] = useState({});

  const dispatch = useDispatch();
  //===================back button exit code================
  useFocusEffect(
    useCallback(() => {
      getUserProfileInfo();

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        backPress,
      );
      return () => subscription.remove();
    }, []),
  );

  const getMaxDate = () => {
    const currentDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(currentDate.getFullYear() - 16);
    return maxDate;
  };

  const getmindate = () => {
    const currentDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(currentDate.getFullYear() - 100);
    return maxDate;
  };

  const getUserProfileInfo = async () => {
    await StorageProvider.getObject('accessToken')
      .then(res => {
        if (res) {
          RestApiClient(
            methods.GET,
            '',
            endPoints.GET_DRIVER_PROFILE_SELF,
            urlReqType.DMS,
            res?.accesstoken,
          )
            .then(response => {
              if (!response?.message) {
                setuserDatainfo(response);
                let splitDate = '';
                if (response?.dob) {
                  splitDate = response?.dob?.split('/').join('-') + ' ';
                }
                setUserData({
                  ...userData,
                  userName: response?.emergencyContact?.name,
                  userMobileNo: response?.emergencyContact?.phNumber,
                  userEmail: response?.emergencyContact?.phNumber,
                  userDob: splitDate,
                  userBloodGroup: response?.bloodGroup,
                  userGender: response?.gender,
                  relation: response?.emergencyContact?.relation,
                });
              }
            })
            .catch(error => {
              ToastAndroid.show(t('errorOccured'), ToastAndroid.SHORT);
              console.log(error);
            });
        }
      })
      .catch(err => {
        ToastAndroid.show(t('errorOccured'), ToastAndroid.SHORT);
      });
  };

  const backPress = () => {
    Alert.alert(
      t('Exit App'),
      t('Do you want to exit app?'),
      [
        {
          text: t('No'),
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: t('Yes'),
          onPress: () => BackHandler.exitApp(),
        },
      ],
      {
        cancelable: false,
      },
    );
    return true;
  };

  const backPress1 = () => {
    Alert.alert(
      t('Exit App'),
      t('Do you want to exit app?'),
      [
        {
          text: t('No'),
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: t('Yes'),
          onPress: async () => {
            await StorageProvider.getObject('accessToken')
              .then(res => {
                dispatch(appLogOut()).then(logOut => {
                  navigation.navigate('Login');
                  StorageProvider.clear();
                  dispatch(resetAppStates());
                  dispatch(resetRideStates());
                  console.log('logOut', 'logOut');
                });
              })
              .catch(BackHandler.exitApp());
          },
        },
      ],
      {
        cancelable: false,
      },
    );
    return true;
  };

  //=====================back button exit code=============
  const {t, i18n} = useTranslation();
  const inputRef = useRef();
  const [value, setVale] = useState('');

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  // userdata state
  const [userData, setUserData] = useState({
    userName: '',
    userMobileNo: '',
    userEmail: '',
    userDob: t('Select DOB'),
    userBloodGroup: t('Select Blood Group'),
    userGender: t('Select Gender'),
    relation: '',
  });

  // error state
  const [isError, setIsError] = useState({
    userName: '',
    userEmail: '',
    userMobileNo: '',
    userDob: '',
    userBloodGroup: '',
    userGender: '',
    relation: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    let vailidation_flag = true;
    if (!userData?.userName) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, userName: t('emptyName')};
      });
    }
    if (!userData?.userMobileNo) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, userMobileNo: t('emptyMobile')};
      });
    }
    if (userData?.userDob == t('Select DOB')) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, userDob: t('emptyDOB')};
      });
    }

    if (!isValidPhoneNumber(userData?.userMobileNo)) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, userMobileNo: t('validMobile')};
      });
    }


    if (userData?.userGender == t('Select Gender')) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, userGender: t('emptyGender')};
      });
    }
    if (userData?.userBloodGroup == t('Select Blood Group')) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, userBloodGroup: t('Blood Group is required')};
      });
    }

    if (!userData?.relation) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, relation: t('emptyRelations')};
      });
    }

    if (vailidation_flag) {
      setErrorMessage('');
      navigation.navigate('Address Details', {
        userData: userData,
        Profilepath: route?.params?.Profilepath,
      });
    }
  };

  const onChangesData = (data, type) => {
    if (type === 'fullname') {
      let name_regex = /^[a-zA-Z ]+$/;
      if (data.length <= 0) {
        setIsError({...isError, userName: t('emptyName')});
      } else if (!name_regex.test(data)) {
        setIsError({...isError, userName: t('validName')});
      } else if (data.length < 4) {
        setIsError({
          ...isError,
          userName: t('NameMinLength'),
        });
      } else {
        setUserData({...userData, userName: data});
        setIsError({...isError, userName: ''});
      }
    }

    if (type === 'userMobileNo') {
      let regex = /^\d+$/;
      if (data.length <= 0) {
        setIsError({...isError, userMobileNo: t('emptyMobile')});
      }
      else  if (!isValidPhoneNumber(data)) {
        setIsError({...isError, userMobileNo: t('validMobile')});
      }
      else if (!regex.test(data)) {
        setIsError({...isError, userMobileNo: t('validMobile')});
      } else if (data.length < 10) {
        setIsError({
          ...isError,
          userMobileNo: t('MobileMinLength'),
        });
      } else {
        setUserData({...userData, userMobileNo: data});
        setIsError({...isError, userMobileNo: ''});
      }
    }

    if (type === 'relation') {
      let name_regex = /^[a-zA-Z ]+$/;
      if (data.length <= 0) {
        setIsError({...isError, relation: t('emptyRelations')});
      } else if (!name_regex.test(data)) {
        setIsError({...isError, relation: t('validRelations')});
      } else {
        setUserData({...userData, relation: data});
        setIsError({...isError, relation: ''});
      }
    }

    if (type === 'date') {
      if (data == 'Enter your DOB') {
        setIsError({...isError, userDob: t('emptyDOB')});
      } else {
        setUserData({...userData, userDob: data});
        setIsError({...isError, userDob: ''});
      }
    }

    if (type === 'gender') {
      if (data == '') {
        setIsError({...isError, userGender: t('emptyGender')});
      } else {
        setUserData({...userData, userGender: data});
        setIsError({...isError, userGender: ''});
      }
    }

    if (type === 'bloodgroup') {
      setUserData({...userData, userBloodGroup: data});
      setIsError({...isError, userBloodGroup: ''});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{flex: 1}}>
        <Header
          onClick={backPress1}
          navigation={navigation}
          HeaderName={t('Basic Details')}
        />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 25,
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          bounces={false}>
          {/* =========DOB=========== */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeading}>{t('DOB')}*</Text>
            <TouchableOpacity
              style={styles.datebtn}
              onPress={() => {
                onChangesData(userData.userDob, 'date');
                setOpen(true);
              }}>
              <Text
                style={{
                  fontSize: 18,
                  paddingLeft: 5,
                  color:
                    userData.userDob == t('Select DOB')
                      ? color.white_50
                      : '#ffffff',
                }}>
                {userData.userDob}
              </Text>
              <Image
                source={require('../../Assests/image/calendar.png')}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
            {isError.userDob && (
              <Text style={{color: 'red', fontFamily: ITALIC}}>
                {isError.userDob}
              </Text>
            )}
            <DatePicker
              modal
              mode={'date'}
              theme="dark"
              open={open}
              date={date}
              minimumDate={getmindate()}
              maximumDate={getMaxDate()}
              onConfirm={date => {
                console.log(date);
                setOpen(false);
                setDate(date);
                let date12 = (
                  (date.getDate().toString().length <= 1
                    ? '0' + date.getDate()
                    : date.getDate()) +
                  '-' +
                  ((date.getMonth() + 1).toString().length <= 1
                    ? '0' + (date.getMonth() + 1)
                    : date.getMonth() + 1) +
                  '-' +
                  date.getFullYear()
                ).toString();
                onChangesData(date12, 'date');
              }}
              onCancel={() => {
                setOpen(false);
                console.log('xzczczx');
              }}
              textColor={color.purpleborder}
            />
          </View>

          {/* =========Blood Group=========== */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeading}>
              {t('Blood Group')}
              {'*'}
            </Text>
            <View style={{marginTop: 4}}>
              <DropdownComponent
                selectedValue={userData.userBloodGroup}
                onFocus={() => {
                  onChangesData(userData.userBloodGroup, 'bloodgroup');
                }}
                onChange={ble => {
                  onChangesData(ble, 'bloodgroup');
                }}
                dropdownList={bloodgroup}
                title={t('Select Blood Group')}
              />
            </View>
            {isError.userBloodGroup && (
              <Text style={{color: 'red', fontFamily: ITALIC}}>
                {isError.userBloodGroup}
              </Text>
            )}
          </View>

          {/* ============gender box========== */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeading}>{t('Gender')}*</Text>
            <View style={{marginTop: 4}}>
              <DropdownComponent
                selectedValue={userData.userGender}
                onFocus={() => {
                  onChangesData(userData.userGender, 'gender');
                }}
                onChange={gender => {
                  onChangesData(gender, 'gender');
                }}
                dropdownList={Gender}
                title={t('Select Gender')}
              />
            </View>
            {isError.userGender && (
              <Text style={{color: 'red', fontFamily: ITALIC}}>
                {isError.userGender}
              </Text>
            )}
          </View>

          <Text
            style={{
              color: '#ffff',
              marginBottom: 5,
              fontSize: fontstyles.InputHeadingSize,
              fontFamily: BOLD,
              fontFamily: '700',
              fontSize: 20,
              marginHorizontal: 30,
              marginTop: 27,
            }}>
            {t('Emergency Contact Details')}
          </Text>
          {/*========= full name ===========*/}

          <View style={{marginHorizontal: 30}}>
            <CustomTextInput
              Inputheading={t('name')}
              placeholderTextColor={color.white_50}
              autoFocused={false}
              style={styles.input}
              autoCapitalize="words"
              keyboardAppearance={'dark'}
              placeHolder={t('Enter Contact Name')}
              maxLength={25}
              value={userData.userName}
              onFocus={e => {
                onChangesData(userData.userName, 'fullname');
              }}
              onChangeText={e => {
                console.log('full name', e);
                onChangesData(e, 'fullname');
                setUserData({...userData, userName: e});
              }}
              isError={isError.userName}
            />
            {/*========= Relation     ===========*/}

            <CustomTextInput
              Inputheading={t('Relation')}
              placeholderTextColor={color.white_50}
              style={styles.input}
              autoCapitalize="words"
              keyboardAppearance={'dark'}
              autoFocused={false}
              keyboardType={'default'}
              placeHolder={t('Enter Relation with contact')}
              maxLength={25}
              value={userData.relation}
              onFocus={e => {
                onChangesData(userData.relation, 'relation');
              }}
              onChangeText={e => {
                onChangesData(e, 'relation');

                setUserData({...userData, relation: e});
              }}
              isError={isError.relation}
            />

            {/* ============mobile number============ */}

            <CustomTextInput
              Inputheading={t('Mobile no.')}
              placeholderTextColor={color.white_50}
              style={styles.input}
              autoCapitalize="words"
              keyboardAppearance={'dark'}
              autoFocused={false}
              keyboardType={'number-pad'}
              placeHolder={t('Enter Mobile Number')}
              maxLength={10}
              value={userData.userMobileNo}
              onFocus={e => {
                onChangesData(userData.userMobileNo, 'userMobileNo');
              }}
              onChangeText={e => {
                const hasSpecialCharacters =
                  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(e);
                if (!hasSpecialCharacters) {
                  onChangesData(e, 'userMobileNo');
                  setUserData({...userData, userMobileNo: e});
                }
              }}
              isError={isError.userMobileNo}
            />

            <CustomPressable
              text={`${t('SAVE & CONTINUE')} (2/4)`}
              props={value}
              btnWidth={mobW - 80}
              onPress={() => {
                validateForm();
              }}
              // ErrorMessage={errorMessage}
              position={'relative'}
              bottom={0}
            />
          </View>
          {/* </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black_BG,
    display: 'flex',
  },
  inputContainer: {
    marginTop: 25,
    marginHorizontal: 30,
    display: 'flex',
  },

  inputHeading: {
    color: '#ffff',
    marginBottom: 5,
    fontSize: fontstyles.InputHeadingSize,
    fontFamily: BOLD,
  },
  datebtn: {
    flexDirection: 'row',
    backgroundColor: color.Black_light,
    width: '100%',
    borderColor: color.Border_color,
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'space-between',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  input: {
    color: '#fff',
    fontSize: fontstyles.InputFontSize,
    fontFamily: REGULAR,
    borderRadius: 20,
    height: 60,
    width: '95%',
  },
});
