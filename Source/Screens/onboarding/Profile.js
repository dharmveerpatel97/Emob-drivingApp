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
  Modal,
  Pressable,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import CustomPressable from '../customComp/CustomPressable';
import {responsive_factor} from '../../constant/auth';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {color, fontstyles} from '../../utils/color';
import DatePicker from 'react-native-date-picker';
import DropdownComponent from '../customComp/customDropDown';
import Header from '../customComp/Header';
import {BOLD, REGULAR, ITALIC} from '../../utils/fonts';
import RestApiClient from '../../network/RestApiClient';
import StorageProvider from '../../Session/StorageProvider';
import {urls} from '../../utils/config';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import CustomTextInput from '../component/CustomTextInput';
import {setToken, setLanguage} from '../../Redux/appSlice';
import {useDispatch} from 'react-redux';
import {ImagePickerModal} from '../component/ImagePickerModal';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

const Profile = ({navigation, route}) => {
  const {t} = useTranslation();

  const dispatch = useDispatch();
  const mobileno = route?.params?.value;
  useEffect(() => {
    StorageProvider.getObject('userdata')
      .then(response => {
        if (route?.params?.value === undefined) {
          mobileno = response.mobile;
        }
      })
      .catch(() => {});
  }, []);
  const [isOpenImagePicker, setIsOpenImagePicker] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isregister, setisregister] = useState(false);
  // userdata state
  const [userData, setUserData] = useState({
    userName: '',
    userMobileNo: mobileno,
    userEmail: '',
  });

  // error state
  const [isError, setIsError] = useState({
    userName: '',
    userEmail: '',
    userMobileNo: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const backPress = () => {
    Alert.alert(
      t('Exit App'),
      t('exitAppAsk'),
      [
        {
          text: t('No'),
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: t('Yes'),
          onPress: () => navigation.navigate('Login'),
        },
      ],
      {
        cancelable: false,
      },
    );
    return true;
  };
  //=====================back button exit code=============
  // const {t, i18n} = useTranslation();
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
    if (!profilePicture) {
      vailidation_flag = false;
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('Please select a profile picture'),
      });
    }

    if (vailidation_flag) {
      setErrorMessage('');
      if (isregister) {
        navigation.navigate('signup', {value: userData?.userMobileNo});
      } else {
        SelfRegistration();
      }
    }
  };

  const SelfRegistration = () => {
    StorageProvider.getObject('userdate')
      .then(response => {
        const body = {
          name: userData?.userName,
          email: userData?.userEmail,
          mobile: userData?.userMobileNo,
          mobileToken: '' + response.token,
          clientId: urls.CLIENT_ID,
        };

        setIsLoading(true);

        RestApiClient('POST', JSON.stringify(body), 'user/register', 'IAM')
          .then(response => {
            setIsLoading(false);
            console.log(response);
            if (response?.message) {
              Alert.alert(
                'Alert',
                'Session Expired',
                [
                  {
                    text: 'OK',

                    onPress: () => navigation.navigate('Login'),
                  },
                ],
                {
                  cancelable: false,
                },
              );

              //navigation.navigate('Login');
            } else {
              dispatch(setToken(response.accesstoken));
              if (profilePicture != null) {
                // btnSubmitDocuments(response.accesstoken)
              }
              setisregister(true);
              StorageProvider.setObject('accessToken', response);
              navigation.navigate('signup', {
                value: userData?.userMobileNo,
                Profilepath: profilePicture,
              });
            }
          })
          .catch(error => {
            setIsLoading(false);
            console.log('API ERROR' + error);
          });
      })
      .catch(error => {
        Alert.alert('Error', 'Token not found');
      });
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

  const btnSubmitDocuments = async token => {
    console.log('profile uplaod line number 100');
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'multipart/form-data');
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + token);

    let profilePicData = new FormData();
    profilePicData.append('file', {
      uri: profilePicture,
      type: 'image/jpg',
      name: 'image.jpg',
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: profilePicData,
      redirect: 'follow',
    };

    console.log('requestOptions', requestOptions);
    let url = urls.DMS_BASE_URL + 'driverManagement/driver/updateSelfProfile';
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('profile uplaod res 1234', result);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log('profile uplaod line number 134', error);
      });
  };

  const _openGallary = () => {
    try {
      ImagePicker.openPicker({
        cropping: true,
      }).then(image => {
        console.log(image, 'image');
        setProfilePicture(image.path);
        setIsOpenImagePicker(false);
      });
    } catch (error) {
      setIsOpenImagePicker(false);
      console.log(error);
    }
  };

  const _openCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      showCropFrame: false,
      freeStyleCropEnabled: true,
    })
      .then(image => {
        console.log(image);
        setProfilePicture(image.path);
        setIsOpenImagePicker(false);
      })
      .catch(error => {
        setIsOpenImagePicker(false);
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
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

      <KeyboardAvoidingView style={{flex: 1}}>
        <Header
          navigation={navigation}
          HeaderName={t('Profile')}
          onClick={backPress}
        />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 30,
            flexGrow: 1,
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          bounces={false}>
          <View style={{flex: 4.8}}>
            <TouchableOpacity
              onPress={() => {
                profilePicture != null
                  ? navigation.navigate('ImageView', {path: profilePicture})
                  : null;
              }}
              style={{
                height: 120,
                width: 120,
                borderRadius: 60,
                borderWidth: 1,
                borderColor: '#00AF66',
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
                  borderColor: '#00AF6660',
                  alignSelf: 'center',
                  backgroundColor: '#00AF6660',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={
                    profilePicture != null
                      ? {uri: profilePicture}
                      : require('../../Assests/image/user_avtar.png')
                  }
                  style={
                    profilePicture != null
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
                onPress={() => {
                  setIsOpenImagePicker(true);
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
                  source={require('../../Assests/image/camera_edit.png')}
                  style={{
                    height: 55,
                    width: 55,
                    resizeMode: 'contain',
                    borderRadius: 55 / 2,
                  }}
                />
              </TouchableOpacity>
            </TouchableOpacity>

            {/*================= full name ===========*/}
            <CustomTextInput
              Inputheading={t('Full name')}
              autoFocused={false}
              placeholderTextColor={color.white_50}
              style={styles.input}
              // autoFocus={false}
              autoCapitalize="words"
              keyboardAppearance={'dark'}
              keyboardType={'default'}
              placeHolder={t('Enter your full name')}
              maxLength={20}
              value={userData.userName}
              onFocus={e => {
                onChangesData(userData.userName, 'fullname');
              }}
              onChangeText={e => {
                console.log('full name', e);
                onChangesData(e, 'fullname');
                setUserData({...userData, userName: e});
              }}
              isError={t(isError.userName)}
            />

            {/* ============mobile number============ */}

            <View style={styles.inputContainer}>
              <Text style={styles.inputHeading}>{t('Mobile no.')} *</Text>
              <View style={styles.Inputbox}>
                <TextInput
                  value={mobileno}
                  keyboardAppearance={'dark'}
                  placeholderTextColor={color.white_50}
                  style={styles.input}
                  placeholder={t('Enter your mobile number')}
                  editable={false}
                />
                <Image style={{height:18,width:18}} source={require('../../Assests/image/verified_icon.png')} />
              </View>
              {userData.userMobileNo.length < 10 && (
                <Text style={{color: 'red'}}>{isError.userMobileNo}</Text>
              )}
            </View>
            {/* =========Email=========== */}
            <CustomTextInput
              Inputheading={t('Email ID')}
              placeholderTextColor={color.white_50}
              style={styles.input}
              keyboardType={'email-address'}
              placeHolder={t('Enter your email id')}
              autoFocused={false}
              value={userData.userEmail}
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

          <View style={{flex: 1.2}}>
            <CustomPressable
              text={`${t('SAVE & CONTINUE')} (1/4)`}
              btnWidth={Dimensions.get('screen').width / 1.19}
              onPress={() => {
                validateForm();
              }}
              isLoading={isLoading}
              ErrorMessage={errorMessage}
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

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black_BG,
    display: 'flex',
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
    height: 50,
  },

  inputHeading: {
    color: '#ffff',
    marginLeft: 2,
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
