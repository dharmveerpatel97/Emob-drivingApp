import {
  Dimensions,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Alert,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import CustomPressable from '../customComp/CustomPressable';
import {responsive_factor} from '../../constant/auth';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {color, fontstyles} from '../../utils/color';
import DatePicker from 'react-native-date-picker';
import DropdownComponentEdit from '../customComp/customDropDownEdit';
import Header from '../customComp/Header';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import RestApiClient from '../../network/RestApiClient';
import StorageProvider from '../../Session/StorageProvider';
import {CLIENT_ID} from '../../config/config';
import {useFocusEffect} from '@react-navigation/native';
import msgProvider from '../../utils/MessageProvider';
import {endPoints, methods, urlReqType, urls} from '../../utils/config';
import {useTranslation} from 'react-i18next';
import {isValidPhoneNumber} from '../../utils/commonFunction';

import Toast from 'react-native-toast-message';
import CustomTextInputEdit from '../component/CustomTextInputEdit';

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

const EditDriverBasicInfo = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const userDetails = route?.params?.userDetails;
  console.log('====================================');
  console.log('userDetails', userDetails);
  console.log('====================================');
  const inputRef = useRef();
  const [value, setVale] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dob, setDob] = useState('Date of Birth*');
  // userdata state
  const [userData, setUserData] = useState({
    userName: '',
    userMobileNo: '',
    userEmail: '',
    userDob: 'Enter your DOB',
    userBloodGroup: '',
    userGender: '',
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

  useEffect(() => {
    if (userDetails) {
      let splitDate = '';
      if (userDetails?.dob) {
        splitDate = userDetails?.dob?.split('/').join('-') + ' ';
      }
      setDate(splitDate);
      setUserData({
        ...userData,
        userName: userDetails?.emergencyContact?.name,
        relation: userDetails?.emergencyContact?.relation,
        userMobileNo: userDetails?.emergencyContact?.phNumber,
        userBloodGroup: userDetails?.bloodGroup,
        userGender: userDetails?.gender,
        userDob: splitDate,
      });
    }
  }, [userDetails]);

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
    if (userData?.userMobileNo.length < 10) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, userMobileNo: t('MobileMinLength')};
      });
    }

    if (!isValidPhoneNumber(userData?.userMobileNo)) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, userMobileNo: t('validMobile')};
      });
    }

    if (userData?.userDob == t('Select DOB')) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, userDob: t('emptyDOB')};
      });
    }
    if (!userData?.userGender) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, userGender: t('emptyGender')};
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
    }

    let body = {
      address: userDetails.address,
      emergencyContact: {
        name: userData?.userName,
        phNumber: userData?.userMobileNo,
        relation: userData?.relation,
      },
      alternateMobileNumbers: ['7886868583'],
      bloodGroup: userData?.userBloodGroup,
      dob: userData.userDob,
      gender: userData.userGender,
    };

    console.log('===body===', body);

    if (vailidation_flag) {
      StorageProvider.getObject('accessToken')
        .then(response => {
          setIsLoading(true);
          RestApiClient(
            methods.PUT,
            JSON.stringify(body),
            endPoints.EDIT_DRIVER_PROFILE_AND_ADDRESS,
            urlReqType.DMS,
            response.accesstoken,
          )
            .then(response => {
              setIsLoading(false);
              console.log(response, '-------response---------');
              if (response?.message) {
                if (response?.message == 'Success') {
                  ToastAndroid.show('Updated successfully', ToastAndroid.SHORT);
                  navigation.goBack();
                } else {
                  ToastAndroid.show(response?.message, ToastAndroid.SHORT);
                }
              }
            })
            .catch(error => {
              setIsLoading(false);
              // console.log('API ERROR' + JSON.stringify(error));
            });
        })
        .catch(error => {
          console.log('error', error);
          Alert.alert('Error', 'Token not found');
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
      } else if (!regex.test(data)) {
        setIsError({...isError, userMobileNo: t('validMobile')});
      } else if (!isValidPhoneNumber(data)) {
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
  const btnEditable = () => {
    setIsEditable(true);
    // setOpen(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{flex: 1}}>
        <Header
          navigation={navigation}
          HeaderName={t('Basic Details')}
          rightIcon={!isEditable}
          rightClick={btnEditable}
        />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 30,
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          bounces={false}>
          {/* =========DOB=========== */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeading}>{t('DOB')}*</Text>
            <TouchableOpacity
              style={[
                styles.datebtn,
                {borderColor: isEditable ? color.purpleborder : color.black_medum},
              ]}
              disabled={!isEditable ? true : false}
              onPress={() => {
                onChangesData(userData.userDob, 'date');
                setOpen(true);
              }}>
              <Text
                style={{
                  fontSize: 18,
                  paddingLeft: 5,
                  color: '#ffffff',
                }}>
                {userData.userDob}
              </Text>
              <Image
                source={require('../../Assests/image/calendar.png')}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
            {isError.userDob && (
              <Text
                style={{
                  color: 'red',
                  fontFamily: 'Roboto-Medium',
                  paddingHorizontal: 5,
                }}>
                {isError.userDob}
              </Text>
            )}
            <DatePicker
              modal
              mode={'date'}
              theme="dark"
              open={open}
              date={new Date()}
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
              style={{backgroundColor: 'red'}}
              textColor={color.purpleborder}
            />
          </View>
          {/* =========DOB=========== */}
          {/* <View style={styles.inputContainer}>
            <Text style={styles.inputHeading}>Date of Birth*</Text>

            <TouchableOpacity
              style={styles.datebtn}
              disabled={!isEditable? true : false}
              onPress={() => {
                onChangesData(userData.userDob, 'date');
                setOpen(true);
              }}>
              <Text
                style={{
                  fontSize: 18,
                  paddingLeft: 5,
                  color: '#ffffff',
                }}>
                {userData.userDob}
              </Text>
              <Image
                source={require('../../Assests/image/Otp/calender.png')}
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
              date={
                date ?  new Date(date):
                new Date()
              }
              maximumDate={new Date()}
              onConfirm={date => {
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
              style={{backgroundColor: 'red'}}
              textColor={color.purpleborder}
            />
          </View> */}

          {/* =========Blood Group=========== */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeading}>{t('Blood Group')}</Text>
            <View style={{marginTop: 4}}>
              <DropdownComponentEdit
                disabale={!isEditable}
                showborder={isEditable}
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
              <Text
                style={{
                  color: 'red',
                  fontFamily: 'Roboto-Medium',
                  paddingHorizontal: 5,
                }}>
                {isError.userBloodGroup}
              </Text>
            )}
          </View>

          {/* ============gender box========== */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeading}>{t('Gender')}*</Text>
            <View style={{marginTop: 4}}>
              <DropdownComponentEdit
                disabale={!isEditable}
                showborder={isEditable}
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
              <Text
                style={{
                  color: 'red',
                  fontFamily: 'Roboto-Medium',
                  paddingHorizontal: 5,
                }}>
                {isError.userGender}
              </Text>
            )}
          </View>

          <Text
            style={{
              color: '#ffff',

              fontSize: fontstyles.InputHeadingSize,
              fontFamily: BOLD,
              marginTop: 27,
            }}>
            {t('Emergency Contact Details')}
          </Text>

          {/*========= full name ===========*/}
          <CustomTextInputEdit
            Inputheading={t('name')}
            placeholderTextColor={'#fff'}
            style={styles.input}
            showborder={isEditable}
            autoCapitalize="words"
            keyboardAppearance={'dark'}
            placeHolder={t('Enter contact name')}
            maxLength={25}
            value={userData.userName}
            isEditable={isEditable}
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

          <CustomTextInputEdit
            Inputheading={t('Relation')}
            placeholderTextColor={'#fff'}
            style={styles.input}
            autoCapitalize="words"
            showborder={isEditable}
            keyboardAppearance={'dark'}
            keyboardType={'default'}
            isEditable={isEditable}
            placeHolder={t('Enter relation with contact')}
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

          <CustomTextInputEdit
            Inputheading={t('Mobile no.')}
            placeholderTextColor={'#fff'}
            style={styles.input}
            autoCapitalize="words"
            isEditable={isEditable}
            showborder={isEditable}
            keyboardAppearance={'dark'}
            keyboardType={'number-pad'}
            placeHolder={t('Enter your mobile number')}
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
          {isEditable && (
            <CustomPressable
              text={t('SAVE')}
              props={value}
              btnWidth={Dimensions.get('screen').width - 60}
              onPress={() => {
                validateForm();
              }}
              ErrorMessage={errorMessage}
              position={'relative'}
              bottom={0}
              isLoading={isLoading}
            />
          )}
          {/* </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditDriverBasicInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black_BG,
    display: 'flex',
    paddingVertical: 20,
  },
  inputContainer: {
    marginTop: 15,
    width: '100%',
    display: 'flex',
  },
  Inputbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.Black_light,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  inputHeading: {
    color: '#ffff',
    marginBottom: 5,
    paddingHorizontal: 5,
    fontSize: fontstyles.InputHeadingSize,
    fontFamily: BOLD,
  },
  datebtn: {
    flexDirection: 'row',
    backgroundColor: color.Black_light,
    borderWidth: 1,
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
  btnContainer: {
    
  },
});
