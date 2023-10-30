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
  ToastAndroid,
  KeyboardAvoidingView,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import CustomPressable from '../customComp/CustomPressable';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {color, fontstyles} from '../../utils/color';
import Header from '../customComp/Header';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import RestApiClient from '../../network/RestApiClient';
import StorageProvider from '../../Session/StorageProvider';
import {CLIENT_ID} from '../../config/config';
import {useFocusEffect} from '@react-navigation/native';
import CustomTextInputEdit from '../component/CustomTextInputEdit';
import {useTranslation} from 'react-i18next';
import {ImagePickerModal} from '../component/ImagePickerModal';
import ImagePicker from 'react-native-image-crop-picker';

import {urls} from '../../utils/config';
import {getDriverProfileInfo} from '../../Redux/appSlice';
const EditDriverProfile = ({navigation, route}) => {
  const {t} = useTranslation();
  const userDetails = route?.params?.userDetails;
  const [errorMessage, setErrorMessage] = useState('');
  // userdata state
  const [userData, setUserData] = useState({
    userName: '',
    userMobileNo: '',
    userEmail: '',
  });

  // error state
  const [isError, setIsError] = useState({
    userName: '',
    userEmail: '',
    userMobileNo: '',
  });
  console.log(userDetails, 'userDetails');

  useEffect(() => {
    if (userDetails) {
      setUserData({
        userName: userDetails?.firstName + ' ' + userDetails?.lastName + ' ',
        userMobileNo: userDetails.mobile,
        userEmail: userDetails.email,
      });
      setProfilePicture(userDetails.profilePicPath);
    }
  }, [userDetails]);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isOpenImagePicker, setIsOpenImagePicker] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const btnEditable = () => {
    if (isEditable) {
      setIsEditable(false);
    } else {
      setIsEditable(true);
    }
  };
  const onChangesData = (data, type) => {
    if (type === 'fullname') {
      let name_regex = /^[a-zA-Z ]+$/;
      if (data.length <= 0) {
        setIsError({...isError, userName: t('emptyFullName')});
      } else if (!name_regex.test(data)) {
        setIsError({...isError, userName: t('validFullName')});
      } else if (data.length < 4) {
        setIsError({...isError, userName: t('fullNameMinLength')});
      } else {
        setUserData({...userData, userName: data});
        setIsError({...isError, userName: ''});
      }
    }

    if (type === 'email') {
      let email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (data.length <= 0) {
        setUserData({...userData, userEmail: data});
        setIsError({...isError, userEmail: ''});
      } else if (!email_regex.test(data)) {
        setIsError({...isError, userEmail: t('validMail')});
      } else {
        setUserData({...userData, userEmail: data});
        setIsError({...isError, userEmail: ''});
      }
    }
  };

  const _openGallary = () => {
    try {
      ImagePicker.openPicker({
        cropping: true,
      }).then(image => {
        console.log(image, 'image');
        setProfilePicture(image.path);
        btnSubmitDocuments(image.path);
        setIsOpenImagePicker(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const _openCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      showCropFrame: false,
      freeStyleCropEnabled: true,
    }).then(image => {
      console.log(image);
      btnSubmitDocuments(image.path);
      setProfilePicture(image.path);
      setIsOpenImagePicker(false);
    });
  };

  const validateForm = () => {
    let vailidation_flag = true;
    if (!userData?.userName) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, userName: t('emptyFullName')};
      });
    }
    if (!userData?.userMobileNo) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, userMobileNo: t('Mobile number is required')};
      });
    }

    if (!userData.userEmail) {
      vailidation_flag = false;
      setIsError(prev => {
        return {...prev, userEmail: t('emptyMail')};
      });
    }

    if (vailidation_flag) {
      setErrorMessage('');
    }

    let body = {
      name: userData?.userName,
      email: userData?.userEmail,
      mobile: userData?.userMobileNo,
      fields: [{key: 'profileImage', value: 'abc.jpg'}],
    };
    console.log('editbody', body);

    if (vailidation_flag) {
      let accessToken = '';
      StorageProvider.getObject('accessToken').then(responce => {
        setIsLoading(true);
        accessToken = responce.accesstoken;
        const apiUrl =
          'https://dmrc.iam.emobility-dev.lifestyleindia.net/api/identity/v1/user/profile';
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
          body: JSON.stringify({
            name: userData?.userName,
            email: userData?.userEmail,
            mobile: userData?.userMobileNo,
            fields: [{key: 'profileImage', value: 'abc.jpg'}],
          }),
        };
        fetch(apiUrl, requestOptions)
          .then(response => response.json())
          .then(data => {
            setIsLoading(false);
            console.log(data, '-------response---------');
            ToastAndroid.show(t('uploadSucc'), ToastAndroid.SHORT);
            navigation.goBack();
          })
          .catch(error => {
            console.error(error);
            setIsLoading(false);
          });
      });
    }
  };

  const btnSubmitDocuments = async path => {
    let res = await StorageProvider.getObject('accessToken');
    if (res) {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'multipart/form-data');
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', 'Bearer ' + res?.accesstoken);

      let profilePicData = new FormData();
      profilePicData.append('file', {
        uri: path,
        type: 'image/jpg',
        name: 'image.jpg',
      });

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: profilePicData,
        redirect: 'follow',
      };
      let url = urls.DMS_BASE_URL + 'driverManagement/driver/updateSelfProfile';
      fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
          setIsLoading(false);
          dispatch(getDriverProfileInfo());
        })
        .catch(error => {
          setIsLoading(false);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{
            width: Dimensions.get('screen').width,
            alignSelf: 'center',
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          bounces={false}>
          <Header
            navigation={navigation}
            HeaderName={t('Profile')}
            rightIcon={!isEditable}
            rightClick={btnEditable}
          />
          <ImagePickerModal
            openGallary={() => {
              _openGallary();
            }}
            openCamera={() => {
              _openCamera();
            }}
            isOpenImagePicker={isOpenImagePicker}
            closePicker={() => setIsOpenImagePicker(false)}
          />
          <View
            style={{
              height: 120,
              width: 120,
              borderRadius: 60,
              borderWidth: isEditable ? 1 : 0,
              borderColor: isEditable ? color.purpleborder : null,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                profilePicture != null
                  ? navigation.navigate('ImageView', {path: profilePicture})
                  : null;
              }}
              activeOpacity={1}
              style={{
                height: 120,
                width: 120,
                borderRadius: 60,
                borderWidth: isEditable ? 1 : 0,
                borderColor: isEditable ? color.purpleborder : null,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  height: 112,
                  width: 112,
                  borderRadius: 112 / 2,
                  borderWidth: 2,
                  borderColor: '#00AF66',
                  alignSelf: 'center',
                  backgroundColor: '#00AF66',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={
                    profilePicture != ''
                      ? {uri: profilePicture}
                      : require('../../Assests/image/user_avtar.png')
                  }
                  style={
                    profilePicture != ''
                      ? {
                          height: 112,
                          width: 112,
                          borderRadius: 112 / 2,
                          resizeMode: 'contain',
                        }
                      : {height: 50, width: 50, resizeMode: 'contain'}
                  }
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (isEditable) {
                    setIsOpenImagePicker(true);
                  }
                }}
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: -14,
                  right: -6,
                  zIndex: 999,
                }}>
                <Image
                  source={require('../../Assests/image/camera_icon.png')}
                  style={{
                    height: 55,
                    width: 55,
                    resizeMode: 'contain',
                    borderRadius: 55 / 2,
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/*========= full name ===========*/}
          <View style={{marginTop: 30, marginHorizontal: 30}}>
            <CustomTextInputEdit
              showborder={isEditable}
              Inputheading={t('Full name')}
              placeholderTextColor={'#fff'}
              style={styles.input}
              autoCapitalize="words"
              keyboardAppearance={'dark'}
              keyboardType={'default'}
              placeHolder={t('Enter your full name')}
              maxLength={25}
              isEditable={isEditable}
              value={userData.userName}
              onFocus={e => {
                onChangesData(userData.userName, 'fullname');
              }}
              onChangeText={e => {
                onChangesData(e, 'fullname');
                setUserData({...userData, userName: e});
              }}
              isError={t(isError.userName)}
            />
            {/* ============mobile number============ */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputHeading}>{t('Mobile no.')} *</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 50,
                  backgroundColor: isEditable ? '#10281C' : color.Black_light,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  borderColor: isEditable
                    ? color.purpleborder
                    : color.black_medum,
                  borderWidth: isEditable ? 1 : 0,
                }}>
                <TextInput
                  value={userData.userMobileNo}
                  keyboardAppearance={'dark'}
                  placeholderTextColor={'#fff'}
                  style={styles.input}
                  placeholder={t('Enter your mobile number')}
                  editable={false}
                />
                <Icon name="checkcircle" size={20} color={color.Green} />
              </View>
              {userData.userMobileNo.length < 10 && (
                <Text style={{color: 'red'}}>{isError.userMobileNo}</Text>
              )}
            </View>
            {/* =========Email=========== */}

            <CustomTextInputEdit
              showborder={isEditable}
              Inputheading={t('Email ID')}
              placeholderTextColor={'#ffffff'}
              style={styles.input}
              keyboardType={'email-address'}
              placeHolder={t('Enter your email id')}
              value={userData.userEmail}
              isEditable={isEditable}
              onFocus={e => {
                onChangesData(userData.userEmail, 'email');
              }}
              onChangeText={e => {
                onChangesData(e, 'email');
                setUserData({...userData, userEmail: e});
              }}
              isError={isError.userEmail}
            />
          </View>
          {isEditable && (
            <CustomPressable
              text={t('SAVE')}
              marginTop={50}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditDriverProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black_BG,
    display: 'flex',
    paddingVertical: 20,
  },
  inputContainer: {
    marginTop: 25,
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
    borderColor: color.Border_color,
    borderWidth: 2,
  },

  inputHeading: {
    color: '#ffff',
    marginLeft: 6,
    marginBottom: 7,
    fontSize: fontstyles.InputHeadingSize,
    fontFamily: BOLD,
  },
  datebtn: {
    flexDirection: 'row',
    backgroundColor: color.Black_light,
    borderColor: color.Border_color,
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'space-between',
    height: 60,
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
